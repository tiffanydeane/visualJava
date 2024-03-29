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
// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
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
	
} from './Algorithm';
import { act } from '../anim/AnimationMain';

const INFO_MSG_X = 25;
const INFO_MSG_Y = 15;

const LINKED_LIST_START_X = 100;
const LINKED_LIST_START_Y = 200;
const LINKED_LIST_ELEM_WIDTH = 70;
const LINKED_LIST_ELEM_HEIGHT = 30;

const LINKED_LIST_INSERT_X = 200;
const LINKED_LIST_INSERT_Y = 50;

const LINKED_LIST_ELEMS_PER_LINE = 8;
const LINKED_LIST_ELEM_SPACING = 100;
const LINKED_LIST_LINE_SPACING = 100;

const PUSH_LABEL_X = 50;
const PUSH_LABEL_Y = 30;
const PUSH_ELEMENT_X = 120;
const PUSH_ELEMENT_Y = 30;

const HEAD_POS_X = 180;
const HEAD_POS_Y = 100;
const HEAD_LABEL_X = 130;
const HEAD_LABEL_Y = 100;

const TAIL_POS_X = 180;
const TAIL_POS_Y = 500;
const TAIL_LABEL_X = 130;
const TAIL_LABEL_Y = 500;

const HEAD_ELEM_WIDTH = 30;
const HEAD_ELEM_HEIGHT = 30;

const SIZE = 32;

export default class LinkedList extends Algorithm {
	constructor(am, w, h) {
		super(am, w, h);
		this.addControls();
		this.nextIndex = 0;
		this.setup();
		this.initialIndex = this.nextIndex;
	}

	addControls() {
		this.controls = [];

		const addVerticalGroup = addGroupToAlgorithmBar(false);
		const addTopHorizontalGroup = addGroupToAlgorithmBar(true, addVerticalGroup);
		const addBottomHorizontalGroup = addGroupToAlgorithmBar(true, addVerticalGroup);

		addLabelToAlgorithmBar('Add', addTopHorizontalGroup);

		// Add's value text field
		this.addValueField = addControlToAlgorithmBar('Text', '', addTopHorizontalGroup);
		this.addValueField.style.textAlign = 'center';
		this.addValueField.onkeydown = this.returnSubmit(
			this.addValueField,
			() => this.addIndexCallback(),
			4,
			true,
		);
		this.controls.push(this.addValueField);

		// Add to front button
		this.addFrontButton = addControlToAlgorithmBar(
			'Button',
			'to front',
			addTopHorizontalGroup,
		);
		this.addFrontButton.onclick = this.addFrontCallback.bind(this);
		this.controls.push(this.addFrontButton);

		// Add to back button
		this.addBackButton = addControlToAlgorithmBar(
			'Button',
			'to back',
			addTopHorizontalGroup,
		);
		this.addBackButton.onclick = () => this.addBackCallback();
		this.controls.push(this.addBackButton);

		addLabelToAlgorithmBar('or', addTopHorizontalGroup);

		// Add at index button
		this.addIndexButton = addControlToAlgorithmBar(
			'Button',
			'at index',
			addTopHorizontalGroup,
		);
		this.addIndexButton.onclick = this.addIndexCallback.bind(this);
		this.controls.push(this.addIndexButton);

		// Add's index text field
		this.addIndexField = addControlToAlgorithmBar('Text', '', addTopHorizontalGroup);
		this.addIndexField.style.textAlign = 'center';
		this.addIndexField.onkeydown = this.returnSubmit(
			this.addIndexField,
			() => this.addIndexCallback(),
			4,
			true,
		);
		this.controls.push(this.addIndexField);

		const removeVerticalGroup = addGroupToAlgorithmBar(false);
		const removeTopHorizontalGroup = addGroupToAlgorithmBar(true, addVerticalGroup);
		const removeBottomHorizontalGroup = addGroupToAlgorithmBar(true, addVerticalGroup);

		addLabelToAlgorithmBar('Remove', removeTopHorizontalGroup);

		// Remove from front button
		this.removeFrontButton = addControlToAlgorithmBar(
			'Button',
			'from front',
			removeTopHorizontalGroup,
		);
		this.removeFrontButton.onclick = () => this.removeFrontCallback();
		this.controls.push(this.removeFrontButton);

		// Remove from back button
		this.removeBackButton = addControlToAlgorithmBar(
			'Button',
			'from back',
			removeTopHorizontalGroup,
		);
		this.removeBackButton.onclick = () => this.removeBackCallback();
		this.controls.push(this.removeBackButton);

		addLabelToAlgorithmBar('or', removeTopHorizontalGroup);

		// Remove from index button
		this.removeIndexButton = addControlToAlgorithmBar(
			'Button',
			'from index',
			removeTopHorizontalGroup,
		);
		this.removeIndexButton.onclick = () => this.removeIndexCallback();
		this.controls.push(this.removeIndexButton);

		// Remove's index text field
		this.removeField = addControlToAlgorithmBar('Text', '', removeTopHorizontalGroup);
		this.removeField.style.textAlign = 'center';
		this.removeField.onkeydown = this.returnSubmit(
			this.removeField,
			() => this.removeIndexCallback(),
			4,
			true,
		);
		this.controls.push(this.removeField);
		
				
		
				

		// Get's index text field
		// this.getField = addControlToAlgorithmBar("Text", "");
		// this.getField.onkeydown = this.returnSubmit(this.getField, () => this.getCallback(), 4, true);
		// this.controls.push(this.getField);

		// Get button
		// this.getButton = addControlToAlgorithmBar("Button", "Get");
		// this.getButton.onclick = () => this.getCallback();
		// this.controls.push(this.getButton);

		addDivisorToAlgorithmBar();

		// this.tailCheckbox = addCheckboxToAlgorithmBar('Tail pointer', false);
		// this.tailCheckbox.onclick = this.toggleTailPointer.bind(this);
		// this.controls.push(this.tailCheckbox);


		const verticalGroup2 = addGroupToAlgorithmBar(false);

		// Random data button
		this.randomButton = addControlToAlgorithmBar('Button', 'Random', verticalGroup2);
		this.randomButton.onclick = this.randomCallback.bind(this);
		this.controls.push(this.randomButton);

		// Clear button
		this.clearButton = addControlToAlgorithmBar('Button', 'Clear', verticalGroup2);
		this.clearButton.onclick = () => this.clearCallback();
		this.controls.push(this.clearButton);
	}

	// toggleTailPointer() {
	// 	this.tailEnabled = !this.tailEnabled;
	// 	this.implementAction(this.clearAll.bind(this));
	// 	if (this.tailEnabled) {
	// 		this.animationManager.setAllLayers([0, 1]);
	// 	} else {
	// 		this.animationManager.setAllLayers([0]);
	// 	}
	// }

	enableUI() {
		for (let i = 0; i < this.controls.length; i++) {
			this.controls[i].disabled = false;
		}
	}

	disableUI() {
		for (let i = 0; i < this.controls.length; i++) {
			this.controls[i].disabled = true;
		}
	}

	setup() {
		this.linkedListElemID = new Array(SIZE);

		this.topID = this.nextIndex++;
		this.topLabelID = this.nextIndex++;
		this.infoLabelID = this.nextIndex++;
		this.cmd(act.createLabel, this.infoLabelID, '', INFO_MSG_X, INFO_MSG_Y, 0);

		this.arrayData = new Array(SIZE);
		this.size = 0;
		// this.top = 0;
		this.leftoverLabelID = this.nextIndex++;

		this.cmd(act.createLabel, this.leftoverLabelID, '', PUSH_LABEL_X, PUSH_LABEL_Y);

		this.cmd(act.createLabel, this.topLabelID, 'Head', HEAD_LABEL_X, HEAD_LABEL_Y);
		this.cmd(
			act.createRectangle,
			this.topID,
			'',
			HEAD_ELEM_WIDTH,
			HEAD_ELEM_HEIGHT,
			HEAD_POS_X,
			HEAD_POS_Y,
		);
		this.cmd(act.setNull, this.topID, 1);

		this.tailID = this.nextIndex++;
		this.tailLabelID = this.nextIndex++;

		this.cmd(act.createLabel, this.tailLabelID, 'Tail', TAIL_LABEL_X, TAIL_LABEL_Y);
		this.cmd(
			act.createRectangle,
			this.tailID,
			'',
			HEAD_ELEM_WIDTH,
			HEAD_ELEM_HEIGHT,
			TAIL_POS_X,
			TAIL_POS_Y,
		);
		this.cmd(act.setNull, this.tailID, 1);

		this.cmd(act.setLayer, this.tailLabelID, 1);
		this.cmd(act.setLayer, this.tailID, 1);


			this.animationManager.setAllLayers([0]);


		this.animationManager.startNewAnimation(this.commands);
		this.animationManager.skipForward();
		this.animationManager.clearHistory();
	}

	reset() {
		this.size = 0;
		this.nextIndex = this.initialIndex;

			this.animationManager.setAllLayers([0]);

	}

	setInfoText(text) {
		this.commands = [];
		this.cmd(act.setText, this.infoLabelID, text);
		return this.commands;
	}

	addIndexCallback() {
		if (this.addValueField.value !== '' && this.addIndexField.value !== '') {
			const addVal = parseInt(this.addValueField.value);
			const index = parseInt(this.addIndexField.value);
			if (index >= 0 && index <= this.size) {
				this.addValueField.value = '';
				this.addIndexField.value = '';
				this.implementAction(this.add.bind(this), addVal, index, 'index', false);
			} else {
				this.implementAction(
					this.setInfoText.bind(this),
					this.size === 0
						? 'Index must be 0 when the list is empty.'
						: `Index must be between 0 and ${this.size}.`,
				);
				this.shake(this.addIndexButton);
			}
		} else {
			this.implementAction(this.setInfoText.bind(this), 'Missing input data or index.');
			this.shake(this.addIndexButton);
		}
	}

	addFrontCallback() {
		if (this.addValueField.value !== '') {
			const addVal = parseInt(this.addValueField.value);
			this.addValueField.value = '';
			this.implementAction(this.add.bind(this), addVal, 0, 'front', false);
		} else {
			this.implementAction(this.setInfoText.bind(this), 'Missing input data.');
			this.shake(this.addFrontButton);
		}
	}

	addBackCallback() {
		if (this.addValueField.value !== '') {
			const addVal = parseInt(this.addValueField.value);
			this.addValueField.value = '';
			this.implementAction(this.add.bind(this), addVal, this.size, 'back', false);
		} else {
			this.implementAction(this.setInfoText.bind(this), 'Missing input data.');
			this.shake(this.addBackButton);
		}
	}

	removeIndexCallback() {
		if (this.removeField.value !== '') {
			const index = this.removeField.value;
			if (index >= 0 && index < this.size) {
				this.removeField.value = '';
				this.implementAction(this.remove.bind(this), index, 'index');
			} else {
				let errorMsg = 'Cannot remove from an empty list.';
				if (this.size === 1) {
					errorMsg = 'Index must be 0 when the list contains one element.';
				} else if (this.size > 1) {
					errorMsg = `Index must be between 0 and ${this.size - 1}.`;
				}
				this.implementAction(this.setInfoText.bind(this), errorMsg);
				this.shake(this.removeIndexButton);
			}
		} else {
			this.implementAction(this.setInfoText.bind(this), 'Missing input index.');
			this.shake(this.removeIndexButton);
		}
	}

	removeFrontCallback() {
		if (this.size > 0) {
			this.implementAction(this.remove.bind(this), 0, 'front');
		} else {
			this.implementAction(this.setInfoText.bind(this), 'Cannot remove from an empty list.');
			this.shake(this.removeFrontButton);
		}
	}

	removeBackCallback() {
		if (this.size > 0) {
			this.implementAction(this.remove.bind(this), this.size - 1, 'back');
		} else {
			this.implementAction(this.setInfoText.bind(this), 'Cannot remove from an empty list.');
			this.shake(this.removeBackButton);
		}
	}

	randomCallback() {
		const LOWER_BOUND = 0;
		const UPPER_BOUND = 16;
		const MAX_SIZE = 8;
		const MIN_SIZE = 4;
		const randomSize = Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1)) + MIN_SIZE;
		const set = new Set();

		this.implementAction(this.clearAll.bind(this));

		for (let i = 0; i < randomSize; i++) {
			const val = Math.floor(Math.random() * (UPPER_BOUND - LOWER_BOUND + 1)) + LOWER_BOUND;
			if (set.has(val)) {
				i--;
			} else {
				set.add(val);
				this.implementAction(this.add.bind(this), val, 0, 'random', true);
			}
			this.animationManager.skipForward();
			this.animationManager.clearHistory();
		}
	}

	clearCallback() {
		this.implementAction(this.clearAll.bind(this));
	}

	traverse(startIndex, endIndex) {
		for (let i = startIndex; i <= endIndex; i++) {
			this.cmd(act.step, null, false);
			this.cmd(act.setHighlight, this.linkedListElemID[i], 1);
			if (i > 0) {
				this.cmd(act.setHighlight, this.linkedListElemID[i - 1], 0);
			}
		}
		this.cmd(act.step, null, false);
	}

	add(elemToAdd, index, where, rand) {
		this.commands = [];
		this.setInfoText('');

		const labPushID = this.nextIndex++;
		const labPushValID = this.nextIndex++;

		for (let i = this.size - 1; i >= index; i--) {
			this.arrayData[i + 1] = this.arrayData[i];
			this.linkedListElemID[i + 1] = this.linkedListElemID[i];
		}
		this.arrayData[index] = elemToAdd;
		this.linkedListElemID[index] = this.nextIndex++;

		this.cmd(act.setText, this.leftoverLabelID, '');

		// this.traverse(0, index - 1);
		
		if (where === 'front') {
		this.cmd(act.step, 17, rand);
		this.cmd(
			act.createLinkedListNode,
			this.linkedListElemID[index],
			'',
			LINKED_LIST_ELEM_WIDTH,
			LINKED_LIST_ELEM_HEIGHT,
			LINKED_LIST_INSERT_X,
			LINKED_LIST_INSERT_Y,
			0.25,
			0,
			1,
		);

		this.cmd(act.createLabel, labPushID, 'Adding Value: ', PUSH_LABEL_X, PUSH_LABEL_Y);
		this.cmd(act.createLabel, labPushValID, elemToAdd, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);

		this.cmd(act.step, 18, rand);

		this.cmd(act.move, labPushValID, LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y);

		this.cmd(act.step, 19, rand);
		this.cmd(act.setText, this.linkedListElemID[index], elemToAdd);
		this.cmd(act.delete, labPushValID);

		if (index === this.size) {
			this.cmd(act.setNull, this.linkedListElemID[index], 1);
			this.cmd(act.disconnect, this.tailID, this.linkedListElemID[index - 1]);
			this.cmd(act.connect, this.tailID, this.linkedListElemID[index]);
		}

		if (this.size !== 0) {
			if (index === 0) {
				this.cmd(act.disconnect, this.topID, this.linkedListElemID[index + 1]);
				this.cmd(act.connect, this.topID, this.linkedListElemID[index]);

				this.cmd(
					act.connect,
					this.linkedListElemID[index],
					this.linkedListElemID[index + 1],
				);
			} else if (index === this.size) {
				this.cmd(act.setNull, this.linkedListElemID[index - 1], 0);
				this.cmd(
					act.connect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index],
				);
			} else {
				this.cmd(
					act.disconnect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index + 1],
				);
				this.cmd(
					act.connect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index],
				);
				this.cmd(
					act.connect,
					this.linkedListElemID[index],
					this.linkedListElemID[index + 1],
				);
			}
		} else {
			this.cmd(act.connect, this.topID, this.linkedListElemID[0]);
			this.cmd(act.connect, this.tailID, this.linkedListElemID[0]);
		}
		this.cmd(act.step, 20, rand);
	} else if (where === 'back') {

		this.cmd(act.step, 24, rand);
		this.cmd(
			act.createLinkedListNode,
			this.linkedListElemID[index],
			'',
			LINKED_LIST_ELEM_WIDTH,
			LINKED_LIST_ELEM_HEIGHT,
			LINKED_LIST_INSERT_X,
			LINKED_LIST_INSERT_Y,
			0.25,
			0,
			1,
		);

		this.cmd(act.createLabel, labPushID, 'Adding Value: ', PUSH_LABEL_X, PUSH_LABEL_Y);
		this.cmd(act.createLabel, labPushValID, elemToAdd, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
		this.cmd(act.step, 25, rand);
		this.cmd(act.step, 27, rand);

		if (this.size === 0) {
			this.cmd(act.step, 28, rand);

			this.cmd(act.move, labPushValID, LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y);

			this.cmd(act.step, 29, rand);
			this.cmd(act.setText, this.linkedListElemID[index], elemToAdd);
			this.cmd(act.delete, labPushValID);
		} else {
			this.cmd(act.step, 32, rand);

			this.cmd(act.move, labPushValID, LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y);

			this.cmd(act.step, 33, rand);
			this.cmd(act.setText, this.linkedListElemID[index], elemToAdd);
			this.cmd(act.delete, labPushValID);
		}

		if (index === this.size) {
			this.cmd(act.setNull, this.linkedListElemID[index], 1);
			this.cmd(act.disconnect, this.tailID, this.linkedListElemID[index - 1]);
			this.cmd(act.connect, this.tailID, this.linkedListElemID[index]);
		}

		for (let i = 0; i <= index - 1; i++) {
			this.cmd(act.setHighlight, this.linkedListElemID[i], 1);
			if (i > 0) {
				this.cmd(act.setHighlight, this.linkedListElemID[i - 1], 0);
			}
			this.cmd(act.step, 34, rand);
			this.cmd(act.step, 33, rand);
		}
		this.cmd(act.step, null, rand);

		if (this.size !== 0) {
			if (index === 0) {
				this.cmd(act.disconnect, this.topID, this.linkedListElemID[index + 1]);
				this.cmd(act.connect, this.topID, this.linkedListElemID[index]);

				this.cmd(
					act.connect,
					this.linkedListElemID[index],
					this.linkedListElemID[index + 1],
				);
			} else if (index === this.size) {
				this.cmd(act.setNull, this.linkedListElemID[index - 1], 0);
				this.cmd(
					act.connect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index],
				);
			} else {
				this.cmd(
					act.disconnect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index + 1],
				);
				this.cmd(
					act.connect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index],
				);
				this.cmd(
					act.connect,
					this.linkedListElemID[index],
					this.linkedListElemID[index + 1],
				);
			}
			this.cmd(act.step, 37, rand);
		} else {
			this.cmd(act.connect, this.topID, this.linkedListElemID[0]);
			this.cmd(act.connect, this.tailID, this.linkedListElemID[0]);
		}
	} else {

		this.cmd(act.step, 41, rand);
		this.cmd(act.step, 46, rand);
		if (index === 0) {
			this.cmd(act.step, 47, rand);
			this.cmd(act.step, 17, rand);
			this.cmd(
				act.createLinkedListNode,
				this.linkedListElemID[index],
				'',
				LINKED_LIST_ELEM_WIDTH,
				LINKED_LIST_ELEM_HEIGHT,
				LINKED_LIST_INSERT_X,
				LINKED_LIST_INSERT_Y,
				0.25,
				0,
				1,
			);
	
			this.cmd(act.createLabel, labPushID, 'Adding Value: ', PUSH_LABEL_X, PUSH_LABEL_Y);
			this.cmd(act.createLabel, labPushValID, elemToAdd, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
	
			this.cmd(act.step, 18, rand);
	
			this.cmd(act.move, labPushValID, LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y);
	
			this.cmd(act.step, 19, rand);
			this.cmd(act.setText, this.linkedListElemID[index], elemToAdd);
			this.cmd(act.delete, labPushValID);
			this.cmd(act.step, 20, rand);
		} else {
			this.cmd(act.step, 48, rand);
			this.cmd(
				act.createLinkedListNode,
				this.linkedListElemID[index],
				'',
				LINKED_LIST_ELEM_WIDTH,
				LINKED_LIST_ELEM_HEIGHT,
				LINKED_LIST_INSERT_X,
				LINKED_LIST_INSERT_Y,
				0.25,
				0,
				1,
			);
	
			this.cmd(act.createLabel, labPushID, 'Adding Value: ', PUSH_LABEL_X, PUSH_LABEL_Y);
			this.cmd(act.createLabel, labPushValID, elemToAdd, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
	
			this.cmd(act.step, 49, rand);
	
			this.cmd(act.move, labPushValID, LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y);
	
			this.cmd(act.step, null, rand);
			this.cmd(act.setText, this.linkedListElemID[index], elemToAdd);
			this.cmd(act.delete, labPushValID);
		}

		if (index === this.size) {
			this.cmd(act.setNull, this.linkedListElemID[index], 1);
			this.cmd(act.disconnect, this.tailID, this.linkedListElemID[index - 1]);
			this.cmd(act.connect, this.tailID, this.linkedListElemID[index]);
		}

		for (let i = 0; i <= index - 1; i++) {
			this.cmd(act.step, 50, rand);
			this.cmd(act.setHighlight, this.linkedListElemID[i], 1);
			if (i > 0) {
				this.cmd(act.setHighlight, this.linkedListElemID[i - 1], 0);
			}
			this.cmd(act.step, 63, rand);
			this.cmd(act.step, 49, rand);
		}
		this.cmd(act.step, null, rand);

		if (this.size !== 0) {
			if (index === 0) {
				this.cmd(act.disconnect, this.topID, this.linkedListElemID[index + 1]);
				this.cmd(act.connect, this.topID, this.linkedListElemID[index]);

				this.cmd(
					act.connect,
					this.linkedListElemID[index],
					this.linkedListElemID[index + 1],
				);
			} else if (index === this.size) {
				this.cmd(act.step, 50, rand);
				this.cmd(act.step, 52, rand);
				this.cmd(act.step, 56, rand);
				this.cmd(act.setNull, this.linkedListElemID[index - 1], 0);
				this.cmd(
					act.connect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index],
				);
				this.cmd(act.step, 60, rand);
				this.cmd(act.step, 61, rand);
			} else {
				this.cmd(act.step, 50, rand);
				this.cmd(act.step, 52, rand);
				this.cmd(
					act.disconnect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index + 1],
				);
				this.cmd(act.step, 56, rand);
				this.cmd(
					act.connect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index],
				);
				this.cmd(
					act.connect,
					this.linkedListElemID[index],
					this.linkedListElemID[index + 1],
				);	
				this.cmd(act.step, 60, rand);
				this.cmd(act.step, 61, rand);
			}
		} else {
			this.cmd(act.connect, this.topID, this.linkedListElemID[0]);
			this.cmd(act.connect, this.tailID, this.linkedListElemID[0]);
		}
	}

		this.cmd(act.setHighlight, this.linkedListElemID[index - 1], 0);

		this.cmd(act.step, null, rand);
		this.size = this.size + 1;
		this.resetNodePositions();
		this.cmd(act.delete, labPushID);
		this.cmd(act.step, null, rand);

		return this.commands;
	}

	remove(index, where) {
		this.commands = [];
		this.setInfoText('');

		index = parseInt(index);
		const labPopID = this.nextIndex++;
		const labPopValID = this.nextIndex++;

		this.cmd(act.setText, this.leftoverLabelID, '');

		// this.traverse(0, index - 1);

		if (where === 'front') {
		this.cmd(act.step, 68, false);
		const nodePosX = LINKED_LIST_START_X + LINKED_LIST_ELEM_SPACING * index;
		const nodePosY = LINKED_LIST_START_Y;
		this.cmd(act.createLabel, labPopID, 'Removing Value: ', PUSH_LABEL_X, PUSH_LABEL_Y);
		this.cmd(act.createLabel, labPopValID, this.arrayData[index], nodePosX, nodePosY);
		this.cmd(act.move, labPopValID, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
		this.cmd(act.setTextColor, this.linkedListElemID[index], '#FF0000');
		this.cmd(act.step, 69, false);

		if (this.size !== 1) {
			if (index === 0) {
				this.cmd(act.disconnect, this.topID, this.linkedListElemID[index]);
				this.cmd(act.connect, this.topID, this.linkedListElemID[index + 1]);
				this.cmd(act.step, 70, false);
				this.cmd(act.disconnect, this.linkedListElemID[0], this.linkedListElemID[1]);
				this.cmd(act.setNull, this.linkedListElemID[0], 1);
			} 
		}} else if(where === 'back') {
		this.cmd(act.step, 73, false);	
		const nodePosX = LINKED_LIST_START_X + LINKED_LIST_ELEM_SPACING * index;
		const nodePosY = LINKED_LIST_START_Y;

		this.cmd(act.step, 74, false);
		this.cmd(act.step, 75, false);
		this.cmd(act.step, 77, false);

		if (this.size !== 1) {
			for (let i = 0; i <= index - 1; i++) {
				this.cmd(act.step, 78, false);
				this.cmd(act.setHighlight, this.linkedListElemID[i], 1);
				if (i > 0) {
					this.cmd(act.setHighlight, this.linkedListElemID[i - 1], 0);
				}
				this.cmd(act.step, 79, false);
				this.cmd(act.step, 77, false);
			}
			this.cmd(act.step, null, false);
			this.cmd(act.createLabel, labPopID, 'Removing Value: ', PUSH_LABEL_X, PUSH_LABEL_Y);
			this.cmd(act.createLabel, labPopValID, this.arrayData[index], nodePosX, nodePosY);
			this.cmd(act.move, labPopValID, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
			this.cmd(act.setTextColor, this.linkedListElemID[index], '#FF0000');
			if (index === 0) {
				this.cmd(act.disconnect, this.topID, this.linkedListElemID[index]);
				this.cmd(act.connect, this.topID, this.linkedListElemID[index + 1]);
				this.cmd(act.step, 82, false);
				this.cmd(act.disconnect, this.linkedListElemID[0], this.linkedListElemID[1]);
				this.cmd(act.setNull, this.linkedListElemID[0], 1);
			} else if (index === this.size - 1) {
				this.cmd(act.disconnect, this.tailID, this.linkedListElemID[index]);
				this.cmd(act.connect, this.tailID, this.linkedListElemID[index - 1]);
				this.cmd(act.step, 82, false);
				this.cmd(
					act.disconnect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index],
				);
				this.cmd(act.setNull, this.linkedListElemID[index - 1], 1);
				this.cmd(act.step, null, false);
			} 
		}} else {
		this.cmd(act.step, 87, false);	
		const nodePosX = LINKED_LIST_START_X + LINKED_LIST_ELEM_SPACING * index;
		const nodePosY = LINKED_LIST_START_Y;
		this.cmd(act.step, 90, false);
		
		if (this.size !== 1) {
			if (index === 0) {
				this.cmd(act.step, 91, false);
				this.cmd(act.createLabel, labPopID, 'Removing Value: ', PUSH_LABEL_X, PUSH_LABEL_Y);
				this.cmd(act.createLabel, labPopValID, this.arrayData[index], nodePosX, nodePosY);
				this.cmd(act.move, labPopValID, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
				this.cmd(act.setTextColor, this.linkedListElemID[index], '#FF0000');
				this.cmd(act.step, 68, false);
				this.cmd(act.step, 69, false);	
				this.cmd(act.disconnect, this.topID, this.linkedListElemID[index]);
				this.cmd(act.connect, this.topID, this.linkedListElemID[index + 1]);
				this.cmd(act.step, 70, false);
				this.cmd(act.disconnect, this.linkedListElemID[0], this.linkedListElemID[1]);
				this.cmd(act.setNull, this.linkedListElemID[0], 1);
			} else if (index === this.size - 1) {
				this.cmd(act.step, 95, false);
				this.cmd(act.step, 98, false);

				for (let i = 0; i <= index - 1; i++) {
					this.cmd(act.setHighlight, this.linkedListElemID[i], 1);
					if (i > 0) {
						this.cmd(act.setHighlight, this.linkedListElemID[i - 1], 0);
					}
					this.cmd(act.step, 99, false);
					this.cmd(act.step, 98, false);
				}
				this.cmd(act.step, null, false);

				this.cmd(act.createLabel, labPopID, 'Removing Value: ', PUSH_LABEL_X, PUSH_LABEL_Y);
				this.cmd(act.createLabel, labPopValID, this.arrayData[index], nodePosX, nodePosY);
				this.cmd(act.move, labPopValID, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
				this.cmd(act.setTextColor, this.linkedListElemID[index], '#FF0000');
				this.cmd(act.step, null, false);

				this.cmd(act.disconnect, this.tailID, this.linkedListElemID[index]);
				this.cmd(act.connect, this.tailID, this.linkedListElemID[index - 1]);
				this.cmd(act.step, 103, false);
				this.cmd(
					act.disconnect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index],
				);
				this.cmd(act.setNull, this.linkedListElemID[index - 1], 1);
				this.cmd(act.step, 105, false);
			} else {
				this.cmd(act.step, 95, false);
				this.cmd(act.step, 98, false);

				for (let i = 0; i <= index - 1; i++) {
					this.cmd(act.setHighlight, this.linkedListElemID[i], 1);
					if (i > 0) {
						this.cmd(act.setHighlight, this.linkedListElemID[i - 1], 0);
					}
					this.cmd(act.step, 99, false);
					this.cmd(act.step, 98, false);
				}
				this.cmd(act.step, null, false);
				this.cmd(act.createLabel, labPopID, 'Removing Value: ', PUSH_LABEL_X, PUSH_LABEL_Y);
				this.cmd(act.createLabel, labPopValID, this.arrayData[index], nodePosX, nodePosY);
				this.cmd(act.move, labPopValID, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
				this.cmd(act.setTextColor, this.linkedListElemID[index], '#FF0000');
				this.cmd(act.step, null, false);

				const xPos =
					(index % LINKED_LIST_ELEMS_PER_LINE) * LINKED_LIST_ELEM_SPACING +
					LINKED_LIST_START_X;
				const yPos = LINKED_LIST_START_Y - LINKED_LIST_ELEM_HEIGHT * 2;
				this.cmd(act.move, this.linkedListElemID[index], xPos, yPos);
				this.cmd(act.step, 103, false);
				this.cmd(
					act.disconnect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index],
				);
				this.cmd(
					act.connect,
					this.linkedListElemID[index - 1],
					this.linkedListElemID[index + 1],
				);
				this.cmd(act.step, 105, false);
				this.cmd(
					act.disconnect,
					this.linkedListElemID[index],
					this.linkedListElemID[index + 1],
				);
			}
		}}

		this.cmd(act.step, null, false);
		this.cmd(act.delete, this.linkedListElemID[index]);

		this.cmd(act.setHighlight, this.linkedListElemID[index - 1], 0);

		for (let i = index; i < this.size; i++) {
			this.arrayData[i] = this.arrayData[i + 1];
			this.linkedListElemID[i] = this.linkedListElemID[i + 1];
		}
		this.size = this.size - 1;
		this.resetNodePositions();

		this.cmd(act.delete, labPopValID);
		this.cmd(act.delete, labPopID);

		return this.commands;
	}

	resetNodePositions() {
		for (let i = 0; i < this.size; i++) {
			const nextX =
				(i % LINKED_LIST_ELEMS_PER_LINE) * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
			const nextY =
				Math.floor(i / LINKED_LIST_ELEMS_PER_LINE) * LINKED_LIST_LINE_SPACING +
				LINKED_LIST_START_Y;
			this.cmd(act.move, this.linkedListElemID[i], nextX, nextY);
		}
	}

	clearAll() {
		this.addValueField.value = '';
		this.addIndexField.value = '';
		this.removeField.value = '';
		this.commands = [];
		this.cmd(act.setText, this.infoLabelID, '');
		for (let i = 0; i < this.size; i++) {
			this.cmd(act.delete, this.linkedListElemID[i]);
		}
		this.size = 0;
		return this.commands;
	}
}
