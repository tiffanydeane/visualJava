// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY David Galles ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco

import Algorithm, {
	addControlToAlgorithmBar,
	addDivisorToAlgorithmBar,
	addGroupToAlgorithmBar,
	addLabelToAlgorithmBar,
} from './Algorithm.js';
import { act } from '../anim/AnimationMain';

const MAX_ARRAY_SIZE = 18;

const INFO_MSG_X = 25;
const INFO_MSG_Y = 15;

const ARRAY_START_X = 100;
const ARRAY_START_Y = 130;
const ARRAY_ELEM_WIDTH = 50;
const ARRAY_ELEM_HEIGHT = 50;

const COMP_COUNT_X = 100;
const COMP_COUNT_Y = 50;

let lastSwapEnabled = true;

export default class BubbleSort extends Algorithm {
	constructor(am, w, h) {
		super(am, w, h);
		this.addControls();
		this.nextIndex = 0;
		this.setup();
	}

	addControls() {
		this.controls = [];

		const verticalGroup = addGroupToAlgorithmBar(false);

		addLabelToAlgorithmBar(
			'Comma separated list',
			verticalGroup,
		);

		const horizontalGroup = addGroupToAlgorithmBar(true, verticalGroup);

		// List text field
		this.listField = addControlToAlgorithmBar('Text', '', horizontalGroup);
		this.listField.onkeydown = this.returnSubmit(
			this.listField,
			this.sortCallback.bind(this),
			40,
			false,
		);
		this.controls.push(this.listField);

		// Sort button
		this.sortButton = addControlToAlgorithmBar('Button', 'Sort', horizontalGroup);
		this.sortButton.onclick = this.sortCallback.bind(this);
		this.controls.push(this.sortButton);

		verticalGroup.style.alignItems = 'center';

		addDivisorToAlgorithmBar();

		const verticalGroup2 = addGroupToAlgorithmBar(false);

		// Random data button
		this.randomButton = addControlToAlgorithmBar('Button', 'Random', verticalGroup2);
		this.randomButton.onclick = this.randomCallback.bind(this);
		this.controls.push(this.randomButton);

		// Clear button
		this.clearButton = addControlToAlgorithmBar('Button', 'Clear', verticalGroup2);
		this.clearButton.onclick = this.clearCallback.bind(this);
		this.controls.push(this.clearButton);
	}

	setup() {
		this.commands = [];

		this.arrayData = [];
		this.arrayID = [];
		this.displayData = [];
		this.iPointerID = this.nextIndex++;
		this.jPointerID = this.nextIndex++;

		this.infoLabelID = this.nextIndex++;
		this.cmd(act.createLabel, this.infoLabelID, '', INFO_MSG_X, INFO_MSG_Y, 0);

		this.comparisonCountID = this.nextIndex++;
		this.compCount = 0;
		this.cmd(
			act.createLabel,
			this.comparisonCountID,
			'Comparison Count: ' + this.compCount,
			COMP_COUNT_X,
			COMP_COUNT_Y,
		);

		this.swapCountID = this.nextIndex++;
		this.swapCount = 0;
		this.cmd(
			act.createLabel,
			this.swapCountID,
			'Swap Count: ' + this.swapCount,
			COMP_COUNT_X + 250,
			COMP_COUNT_Y,
		);

		this.animationManager.startNewAnimation(this.commands);
		this.animationManager.skipForward();
		this.animationManager.clearHistory();
	}

	reset() {
		this.nextIndex = 0;
		this.compCount = 0;
		this.swapCount = 0;
		this.arrayData = [];
		this.arrayID = [];
		this.displayData = [];
		this.iPointerID = this.nextIndex++;
		this.jPointerID = this.nextIndex++;
		this.comparisonCountID = this.nextIndex++;
		this.infoLabelID = this.nextIndex++;
		this.swapCountID = this.nextIndex++;
	}

	randomCallback() {
		//Generate between 5 and 15 random values
		const RANDOM_ARRAY_SIZE = Math.floor(Math.random() * 9) + 5;
		const MIN_DATA_VALUE = 1;
		const MAX_DATA_VALUE = 14;
		let values = '';
		for (let i = 0; i < RANDOM_ARRAY_SIZE; i++) {
			values += (
				Math.floor(Math.random() * (MAX_DATA_VALUE - MIN_DATA_VALUE)) + MIN_DATA_VALUE
			).toString();
			if (i < RANDOM_ARRAY_SIZE - 1) {
				values += ',';
			}
		}

		this.listField.value = values;
	}

	sortCallback() {
		const list = this.listField.value.split(',').filter(x => x !== '');
		this.implementAction(this.clear.bind(this), true);
		this.implementAction(this.sort.bind(this), list);
	}

	clearCallback() {
		this.implementAction(this.clear.bind(this));
	}

	toggleLastSwap() {
		this.implementAction(this.clear.bind(this));
		lastSwapEnabled = !lastSwapEnabled;
	}

	clear(keepInput) {
		this.commands = [];

		for (let i = 0; i < this.arrayID.length; i++) {
			this.cmd(act.delete, this.arrayID[i]);
		}

		this.arrayData = [];
		this.arrayID = [];
		this.compCount = 0;
		this.swapCount = 0;
		this.displayData = [];
		if (!keepInput) this.listField.value = '';
		this.cmd(act.setText, this.infoLabelID, '');
		this.cmd(act.setText, this.comparisonCountID, 'Comparison Count: ' + this.compCount);
		this.cmd(act.setText, this.swapCountID, 'Swap Count: ' + this.swapCount);
		return this.commands;
	}

	sort(list) {
		this.commands = [];

		// User input validation
		if (!list.length) {
			this.shake(this.sortButton);
			this.cmd(act.setText, this.infoLabelID, 'Data must contain integers such as "3,1,2"');
			return this.commands;
		} else if (list.length > MAX_ARRAY_SIZE) {
			this.shake(this.sortButton);
			this.cmd(
				act.setText,
				this.infoLabelID,
				`Data cannot contain more than ${MAX_ARRAY_SIZE} numbers (you put ${list.length})`,
			);
			return this.commands;
		} else if (list.map(Number).filter(x => x > 999 || Number.isNaN(x)).length) {
			this.shake(this.sortButton);
			this.cmd(
				act.setText,
				this.infoLabelID,
				'Data cannot contain non-numeric values or numbers ',
			);
			return this.commands;
		}

		this.arrayID = [];
		this.arrayData = list
			.map(Number)
			.filter(x => !Number.isNaN(x))
			.slice(0, MAX_ARRAY_SIZE);
		const length = this.arrayData.length;
		const elemCounts = new Map();
		const letterMap = new Map();

		for (let i = 0; i < length; i++) {
			const count = elemCounts.has(this.arrayData[i]) ? elemCounts.get(this.arrayData[i]) : 0;
			if (count > 0) {
				letterMap.set(this.arrayData[i], 'a');
			}
			elemCounts.set(this.arrayData[i], count + 1);
		}

		for (let i = 0; i < length; i++) {
			this.arrayID[i] = this.nextIndex++;
			const xpos = i * ARRAY_ELEM_WIDTH + ARRAY_START_X;
			const ypos = ARRAY_START_Y;

			let displayData = this.arrayData[i].toString();
			if (letterMap.has(this.arrayData[i])) {
				const currChar = letterMap.get(this.arrayData[i]);
				displayData += currChar;
				letterMap.set(this.arrayData[i], String.fromCharCode(currChar.charCodeAt(0) + 1));
			}
			this.displayData[i] = displayData;
			this.cmd(
				act.createRectangle,
				this.arrayID[i],
				displayData,
				ARRAY_ELEM_WIDTH,
				ARRAY_ELEM_HEIGHT,
				xpos,
				ypos,
			);
		}
		this.cmd(
			act.createHighlightCircle,
			this.iPointerID,
			'#0000FF',
			ARRAY_START_X,
			ARRAY_START_Y,
		);
		this.cmd(act.step, 4, false);
		this.cmd(act.step, 6, false);
		this.cmd(act.step, 7, false);
		this.cmd(act.setHighlight, this.iPointerID, 1);
		this.cmd(
			act.createHighlightCircle,
			this.jPointerID,
			'#0000FF',
			ARRAY_START_X + ARRAY_ELEM_WIDTH,
			ARRAY_START_Y,
		);
		this.cmd(act.setHighlight, this.jPointerID, 1);
		this.cmd(act.step, 8, false);

		let sorted = true;
		let end = this.arrayData.length - 1;
		let lastSwapped = 0;
		this.cmd(act.step, null, false);
		do {
			this.cmd(act.step, 9, false);
			sorted = true;
			this.cmd(act.step, 10, false);
			for (let i = 0; i < end; i++) {
				this.movePointers(i, i + 1);
				this.cmd(
					act.setText,
					this.comparisonCountID,
					'Comparison Count: ' + ++this.compCount,
				);
				this.cmd(act.step, 11, false);
				if (this.arrayData[i] > this.arrayData[i + 1]) {
					this.swap(i, i + 1);
					sorted = false;
					lastSwapped = i;
				}
				this.cmd(act.step, 10, false);
			}
			if (lastSwapEnabled) {
				end = lastSwapped;
			} else {
				end--;
			}
			this.cmd(act.step, 23, false);
			if (!sorted) {
				for (let i = end + 1; i < this.arrayData.length; i++) {
					this.cmd(act.setBackgroundColor, this.arrayID[i], '#2ECC71');
				}
				this.cmd(act.step, 8, false);
			}
			this.cmd(act.step, null, false);
		} while (!sorted);

		this.cmd(act.delete, this.iPointerID);
		this.cmd(act.delete, this.jPointerID);
		this.cmd(act.step, 24, false);

		for (let i = 0; i < this.arrayData.length; i++) {
			this.cmd(act.setBackgroundColor, this.arrayID[i], '#2ECC71');
		}
		this.cmd(act.step, null, false);

		return this.commands;
	}

	movePointers(i, j) {
		const iXPos = i * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		this.cmd(act.move, this.iPointerID, iXPos, ARRAY_START_Y);
		const jXPos = j * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		this.cmd(act.move, this.jPointerID, jXPos, ARRAY_START_Y);
		this.cmd(act.step, null, false);
	}

	swap(i, j) {
		// Change pointer colors to red
		this.cmd(act.setForegroundColor, this.iPointerID, '#FF0000');
		this.cmd(act.setForegroundColor, this.jPointerID, '#FF0000');
		this.cmd(act.step, 14, false);
		// Create temporary labels and remove text in array
		const iLabelID = this.nextIndex++;
		const iXPos = i * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		this.cmd(act.createLabel, iLabelID, this.displayData[i], iXPos, ARRAY_START_Y);
		const jLabelID = this.nextIndex++;
		const jXPos = j * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		this.cmd(act.createLabel, jLabelID, this.displayData[j], jXPos, ARRAY_START_Y);
		this.cmd(act.setText, this.arrayID[i], '');
		this.cmd(act.setText, this.arrayID[j], '');
		this.cmd(act.step, 15, false);
		// Move labels
		this.cmd(act.move, iLabelID, jXPos, ARRAY_START_Y);
		this.cmd(act.move, jLabelID, iXPos, ARRAY_START_Y);
		this.cmd(act.setText, this.swapCountID, 'Swap Count: ' + ++this.swapCount);
		this.cmd(act.step, 16, false);
		// Set text in array and delete temporary labels
		this.cmd(act.setText, this.arrayID[i], this.displayData[j]);
		this.cmd(act.setText, this.arrayID[j], this.displayData[i]);
		this.cmd(act.delete, iLabelID);
		this.cmd(act.delete, jLabelID);
		// Swap data in backend array
		let temp = this.arrayData[i];
		this.arrayData[i] = this.arrayData[j];
		this.arrayData[j] = temp;
		// Swap data in display array
		temp = this.displayData[i];
		this.displayData[i] = this.displayData[j];
		this.displayData[j] = temp;
		// Reset pointer colors back to blue
		this.cmd(act.setForegroundColor, this.iPointerID, '#0000FF');
		this.cmd(act.setForegroundColor, this.jPointerID, '#0000FF');
		this.cmd(act.step, 17, false);
	}

	disableUI() {
		for (let i = 0; i < this.controls.length; i++) {
			this.controls[i].disabled = true;
		}
	}

	enableUI() {
		for (let i = 0; i < this.controls.length; i++) {
			this.controls[i].disabled = false;
		}
	}
}
