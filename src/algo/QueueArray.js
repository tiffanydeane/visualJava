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

import Algorithm, { addControlToAlgorithmBar, addDivisorToAlgorithmBar, addGroupToAlgorithmBar, highlight, sleep } from './Algorithm.js';
import { act } from '../anim/AnimationMain';

const ARRAY_START_X = 100;
const ARRAY_START_Y = 240;
const ARRAY_ELEM_WIDTH = 50;
const ARRAY_ELEM_HEIGHT = 50;

const ARRAY_ELEMS_PER_LINE = 14;
const ARRAY_LINE_SPACING = 130;

const FRONT_POS_X = 180;
const FRONT_POS_Y = 100;
const FRONT_LABEL_X = 130;
const FRONT_LABEL_Y = 100;

const SIZE_POS_X = 280;
const SIZE_POS_Y = 100;
const SIZE_LABEL_X = 230;
const SIZE_LABEL_Y = 100;

const QUEUE_LABEL_X = 60;
const QUEUE_LABEL_Y = 30;
const QUEUE_ELEMENT_X = 130;
const QUEUE_ELEMENT_Y = 30;

const QUEUE_INDEX_X = 129;
const QUEUE_INDEX_Y = 50;
const QUEUE_INDEXVAL_X = 260;
const QUEUE_INDEXVAL_Y = 50;

const RESIZE_ARRAY_START_X = 100;
const RESIZE_ARRAY_START_Y = 345;
const QUEUE_RESIZE_LABEL_X = 60;
const QUEUE_RESIZE_LABEL_Y = 60;

const INDEX_COLOR = '#6ef0a9';

const FRONT_LABEL_OFFSET = -40;

const CODE_START_X = 350;
const CODE_START_Y = 25;

const SIZE = 7;
const MAX_SIZE = 30;

export default class QueueArray extends Algorithm {
	constructor(am, w, h) {
		super(am, w, h);

		this.addControls();
		this.nextIndex = 0;
		this.commands = [];
		this.setup();
		this.initialIndex = this.nextIndex;
	}

	addControls() {
		this.controls = [];
		const addTopHorizontalGroup = addGroupToAlgorithmBar(true);
		this.enqueueField = addControlToAlgorithmBar('Text', '', addTopHorizontalGroup);
		this.enqueueField.style.textAlign = 'center';
		this.enqueueField.onkeydown = this.returnSubmit(
			this.enqueueField,
			this.enqueueCallback.bind(this),
			4,
			true,
		);

		this.enqueueButton = addControlToAlgorithmBar('Button', 'Enqueue', addTopHorizontalGroup);
		this.enqueueButton.onclick = this.enqueueCallback.bind(this);
		this.controls.push(this.enqueueField);
		this.controls.push(this.enqueueButton);

		addDivisorToAlgorithmBar(addTopHorizontalGroup);

		this.dequeueButton = addControlToAlgorithmBar('Button', 'Dequeue', addTopHorizontalGroup);
		this.dequeueButton.onclick = this.dequeueCallback.bind(this);
		this.controls.push(this.dequeueButton);

		addDivisorToAlgorithmBar(addTopHorizontalGroup);

		this.randomButton = addControlToAlgorithmBar('Button', 'Random', addTopHorizontalGroup);
		this.randomButton.onclick = this.randomCallback.bind(this);
		this.controls.push(this.randomButton);

		addDivisorToAlgorithmBar(addTopHorizontalGroup);

		this.clearButton = addControlToAlgorithmBar('Button', 'Clear', addTopHorizontalGroup);
		this.clearButton.onclick = this.clearCallback.bind(this);
		this.controls.push(this.clearButton);
	}

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
		this.nextIndex = 0;

		this.arrayID = new Array(SIZE);
		this.arrayLabelID = new Array(SIZE);
		for (let i = 0; i < SIZE; i++) {
			this.arrayID[i] = this.nextIndex++;
			this.arrayLabelID[i] = this.nextIndex++;
		}
		this.frontID = this.nextIndex++;
		const frontLabelID = this.nextIndex++;
		this.sizeID = this.nextIndex++;
		const sizeLabelID = this.nextIndex++;
		this.frontPointerID = this.nextIndex++;

		this.arrayData = new Array(SIZE);
		this.front = 0;
		this.size = 0;
		this.leftoverLabelID = this.nextIndex++;
		this.leftoverValID = this.nextIndex++;
		this.arraySize = SIZE;

		for (let i = 0; i < SIZE; i++) {
			const xpos = (i % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
			const ypos = Math.floor(i / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;
			this.cmd(
				act.createRectangle,
				this.arrayID[i],
				'',
				ARRAY_ELEM_WIDTH,
				ARRAY_ELEM_HEIGHT,
				xpos,
				ypos,
			);
			this.cmd(act.createLabel, this.arrayLabelID[i], i, xpos, ypos + ARRAY_ELEM_HEIGHT);
			this.cmd(act.setForegroundColor, this.arrayLabelID[i], INDEX_COLOR);
		}
		this.cmd(act.createLabel, frontLabelID, 'Front', FRONT_LABEL_X, FRONT_LABEL_Y);
		this.cmd(
			act.createRectangle,
			this.frontID,
			0,
			ARRAY_ELEM_WIDTH,
			ARRAY_ELEM_HEIGHT,
			FRONT_POS_X,
			FRONT_POS_Y,
		);

		this.cmd(act.createLabel, sizeLabelID, 'Size', SIZE_LABEL_X, SIZE_LABEL_Y);
		this.cmd(
			act.createRectangle,
			this.sizeID,
			0,
			ARRAY_ELEM_WIDTH,
			ARRAY_ELEM_HEIGHT,
			SIZE_POS_X,
			SIZE_POS_Y,
		);

		this.cmd(
			act.createLabel,
			this.frontPointerID,
			'Front',
			ARRAY_START_X,
			ARRAY_START_Y + FRONT_LABEL_OFFSET,
		);

		this.cmd(act.createLabel, this.leftoverLabelID, '', QUEUE_LABEL_X, QUEUE_LABEL_Y);
		this.cmd(act.createLabel, this.leftoverValID, '', QUEUE_ELEMENT_X, QUEUE_ELEMENT_Y);

		this.highlight1ID = this.nextIndex++;

		this.enqueueCode = [
			['procedure enqueue(data)'],
			['  if size == array.length'],
			['    T[] newArray ← new array[2 * size]'],
			['    for i ← 0 to size - 1, i++:'],
			['      newArray[i] ← array[(front + i) % array.length]'],
			['    array ← newArray'],
			['    front ← 0'],
			['  array[(front + size) % array.length] ← data'],
			['  size++'],
			['end procedure'],
		];

		this.dequeueCode = [
			['procedure dequeue()'],
			['  T data ← array[front]'],
			['  array[front] ← null'],
			['  front ← (front + 1) % array.length'],
			['  size--'],
			['end procedure'],
		];

		this.enqueueCodeID = this.addCodeToCanvasBase(this.enqueueCode, CODE_START_X, CODE_START_Y);
		this.dequeueCodeID = this.addCodeToCanvasBase(
			this.dequeueCode,
			CODE_START_X + 465,
			CODE_START_Y,
		);

		this.animationManager.startNewAnimation(this.commands);
		this.animationManager.skipForward();
		this.animationManager.clearHistory();
	}

	reset() {
		this.top = 0;
		this.front = 0;
		this.size = 0;

		this.arrayID = new Array(SIZE);
		this.arrayLabelID = new Array(SIZE);
		this.arrayData = new Array(SIZE);

		for (let i = 0; i < SIZE; i++) {
			this.arrayID[i] = this.nextIndex++;
			this.arrayLabelID[i] = this.nextIndex++;
		}

		this.nextIndex = this.nextIndex + 8;
		this.arraySize = SIZE;
	}

	enqueueCallback() {
		if (this.size < this.arraySize && this.enqueueField.value !== '') {
			const pushVal = this.enqueueField.value;
			this.enqueueField.value = '';
			this.implementAction(this.enqueue.bind(this), pushVal, false);
			// highlight(14, 500);
			// sleep(500).then(() => {highlight(15, 500)});
			// sleep(500*2).then(() => {highlight(18, 500)});
			// sleep(500*3).then(() => {highlight(19, 500)});
		} else if (
			this.size === this.arraySize &&
			this.enqueueField.value !== '' &&
			this.size * 2 < MAX_SIZE
		) {
			const pushVal = this.enqueueField.value;
			this.enqueueField.value = '';
			this.implementAction(this.resize.bind(this), pushVal);
			// highlight(14, 500);
			// sleep(500).then(() => {highlight(15, 500)});
			// sleep(500*2).then(() => {highlight(16, 500)});
			// sleep(500*3).then(() => {highlight(33, 500)});
			// sleep(500*4).then(() => {highlight(34, 500)});
			// sleep(500*5).then(() => {highlight(36, 500)});
			// let x = -2;
			// for (let i = 0; i < this.size; i++) {
			// 	sleep(500*(6+(2*i))).then(() => {highlight(37, 500)});
			// 	sleep(500*(7+(2*i))).then(() => {highlight(36, 500)});
			// 	x += 2;
			// }
			// sleep(500*(8 + x)).then(() => {highlight(40, 500)});
			// sleep(500*(9 + x)).then(() => {highlight(41, 500)});
			// sleep(500*(10 + x)).then(() => {highlight(18, 500)});
			// sleep(500*(11+ x)).then(() => {highlight(19, 500)});
		} else {
			this.shake(this.enqueueButton);
		}
	}

	dequeueCallback() {
		if (this.size !== 0) {
			this.implementAction(this.dequeue.bind(this));
		} else {
			this.shake(this.dequeueButton);
		}
	}

	randomCallback() {
		const LOWER_BOUND = 0;
		const UPPER_BOUND = 16;
		const MAX_SIZE = SIZE - 1;
		const MIN_SIZE = 3;
		const randomSize = Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1)) + MIN_SIZE;
		const randomFront = Math.floor(Math.random() * MAX_SIZE);
		const set = new Set();

		this.implementAction(this.clearAll.bind(this, randomFront));

		for (let i = 0; i < randomSize; i++) {
			const val = Math.floor(Math.random() * (UPPER_BOUND - LOWER_BOUND + 1)) + LOWER_BOUND;
			if (set.has(val)) {
				i--;
			} else {
				set.add(val);
				this.implementAction(this.enqueue.bind(this), val, true);
			}
			this.animationManager.skipForward();
			this.animationManager.clearHistory();
		}
	}

	clearCallback() {
		this.implementAction(this.clearAll.bind(this));
	}

	enqueue(elemToEnqueue, rand) {
		this.commands = [];

		const labEnqueueID = this.nextIndex++;
		const labEnqueueValID = this.nextIndex++;
		const labIndexID = this.nextIndex++;
		const labIndexValID = this.nextIndex++;

		const newTail = (this.front + this.size) % this.arraySize;
		this.arrayData[newTail] = elemToEnqueue;
		this.highlight(0, 0, this.enqueueCodeID);
		this.cmd(act.setText, this.leftoverLabelID, '');
		this.cmd(act.setText, this.leftoverValID, '');
		this.cmd(act.step, 14, rand);
		this.cmd(act.step, 15, rand);

		this.highlight(7, 0, this.enqueueCodeID);
		this.cmd(act.createLabel, labEnqueueID, 'Enqueuing Value: ', QUEUE_LABEL_X, QUEUE_LABEL_Y);
		this.cmd(act.createLabel, labEnqueueValID, elemToEnqueue, QUEUE_ELEMENT_X, QUEUE_ELEMENT_Y);
		this.cmd(
			act.createLabel,
			labIndexID,
			'Enqueueing at (front + size) % array.length: ',
			QUEUE_INDEX_X,
			QUEUE_INDEX_Y,
		);
		this.cmd(act.createLabel, labIndexValID, newTail, QUEUE_INDEXVAL_X, QUEUE_INDEXVAL_Y);

		this.cmd(act.step, 18, rand);
		this.cmd(act.createHighlightCircle, this.highlight1ID, INDEX_COLOR, SIZE_POS_X, SIZE_POS_Y);
		this.cmd(act.step, null, rand);

		const xpos = (newTail % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		const ypos =
			Math.floor(newTail / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;

		this.cmd(act.move, this.highlight1ID, QUEUE_INDEXVAL_X, QUEUE_INDEXVAL_Y);
		this.cmd(act.step, null, rand);

		this.cmd(act.move, this.highlight1ID, xpos, ypos + ARRAY_ELEM_HEIGHT);
		this.cmd(act.move, labIndexValID, xpos, ypos + ARRAY_ELEM_HEIGHT);
		this.cmd(act.step, null, rand);

		this.cmd(act.move, labEnqueueValID, xpos, ypos);
		this.cmd(act.step, null, rand);

		this.cmd(act.setText, this.arrayID[newTail], elemToEnqueue);
		this.cmd(act.delete, labEnqueueValID);
		this.cmd(act.delete, labIndexValID);
		this.cmd(act.step, null, rand);

		this.cmd(act.delete, this.highlight1ID);

		this.unhighlight(7, 0, this.enqueueCodeID);
		this.highlight(8, 0, this.enqueueCodeID);
		this.cmd(act.setHighlight, this.sizeID, 1);
		this.cmd(act.step, 19, rand);

		this.size = this.size + 1;
		this.cmd(act.setText, this.sizeID, this.size);
		this.cmd(act.step, null, rand);

		this.unhighlight(8, 0, this.enqueueCodeID);
		this.unhighlight(0, 0, this.enqueueCodeID);
		this.cmd(act.setHighlight, this.sizeID, 0);
		this.cmd(act.delete, labEnqueueID);
		this.cmd(act.delete, labIndexID);

		this.nextIndex = this.nextIndex - 4;

		return this.commands;
	}

	dequeue() {
		this.commands = [];

		const labDequeueID = this.nextIndex++;
		const labDequeueValID = this.nextIndex++;

		this.highlight(0, 0, this.dequeueCodeID);
		this.cmd(act.setText, this.leftoverLabelID, '');
		this.cmd(act.setText, this.leftoverValID, '');
		this.cmd(act.step, 22, false);
		this.cmd(act.step, 23, false);
		this.cmd(act.step, 10, false);
		this.cmd(act.step, 11, false);

		this.highlight(1, 0, this.dequeueCodeID);
		this.cmd(act.createLabel, labDequeueID, 'Dequeued Value: ', QUEUE_LABEL_X, QUEUE_LABEL_Y);
		this.cmd(
			act.createHighlightCircle,
			this.highlight1ID,
			INDEX_COLOR,
			FRONT_POS_X,
			FRONT_POS_Y,
		);
		this.cmd(act.step, 26, false);

		const xpos = (this.front % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		const ypos =
			Math.floor(this.front / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;

		this.cmd(act.move, this.highlight1ID, xpos, ypos + ARRAY_ELEM_HEIGHT);
		this.cmd(act.step, 27, false);

		this.unhighlight(1, 0, this.dequeueCodeID);
		this.highlight(2, 0, this.dequeueCodeID);
		this.cmd(act.delete, this.highlight1ID);

		const dequeuedVal = this.arrayData[this.front];
		this.cmd(act.createLabel, labDequeueValID, dequeuedVal, xpos, ypos);
		this.cmd(act.setText, this.arrayID[this.front], '');
		this.cmd(act.move, labDequeueValID, QUEUE_ELEMENT_X, QUEUE_ELEMENT_Y);
		this.cmd(act.step, null, false);

		this.unhighlight(2, 0, this.dequeueCodeID);
		this.highlight(3, 0, this.dequeueCodeID);
		this.cmd(act.setHighlight, this.frontID, 1);
		this.cmd(act.setHighlight, this.frontPointerID, 1);
		this.cmd(act.step, 28, false);

		this.front = (this.front + 1) % this.arraySize;
		const frontxpos = (this.front % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		const frontypos =
			Math.floor(this.front / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +
			ARRAY_START_Y +
			FRONT_LABEL_OFFSET;
		this.cmd(act.move, this.frontPointerID, frontxpos, frontypos);
		this.cmd(act.setText, this.frontID, this.front);
		this.cmd(act.step, null, false);

		this.cmd(act.setHighlight, this.frontID, 0);
		this.cmd(act.setHighlight, this.frontPointerID, 0);
		this.unhighlight(3, 0, this.dequeueCodeID);
		this.cmd(act.setText, this.leftoverLabelID, 'Dequeued Value: ');
		this.cmd(act.setText, this.leftoverValID, dequeuedVal);

		this.cmd(act.delete, labDequeueID);
		this.cmd(act.delete, labDequeueValID);
		this.cmd(act.step, null, false);

		this.highlight(4, 0, this.dequeueCodeID);
		this.cmd(act.setHighlight, this.sizeID, 1);
		this.cmd(act.step, 29, false);

		this.size = this.size - 1;
		this.cmd(act.setText, this.sizeID, this.size);
		this.cmd(act.step, 30, false);

		this.unhighlight(4, 0, this.dequeueCodeID);
		this.unhighlight(0, 0, this.dequeueCodeID);
		this.cmd(act.setHighlight, this.sizeID, 0);

		this.nextIndex = this.nextIndex - 2;

		return this.commands;
	}

	resize(elemToEnqueue) {
		this.commands = [];

		const labEnqueueID = this.nextIndex++;
		const labEnqueueValID = this.nextIndex++;
		const labEnqueueResizeID = this.nextIndex++;

		this.arrayIDNew = new Array(this.size * 2);
		this.arrayLabelIDNew = new Array(this.size * 2);
		this.arrayDataNew = new Array(this.size * 2);

		for (let i = 0; i < this.size * 2; i++) {
			this.arrayIDNew[i] = this.nextIndex++;
			this.arrayLabelIDNew[i] = this.nextIndex++;
			if (i < this.size) {
				this.arrayDataNew[i] = this.arrayData[(this.front + i) % this.arraySize];
			}
		}

		this.arrayDataNew[this.size] = elemToEnqueue;

		this.cmd(act.step, 14, false);

		this.highlight(0, 0, this.enqueueCodeID);
		this.cmd(act.createLabel, labEnqueueID, 'Enqueuing Value: ', QUEUE_LABEL_X, QUEUE_LABEL_Y);
		this.cmd(act.createLabel, labEnqueueValID, elemToEnqueue, QUEUE_ELEMENT_X, QUEUE_ELEMENT_Y);
		this.cmd(act.step, 15, false);

		this.highlight(1, 0, this.enqueueCodeID);
		this.cmd(
			act.createLabel,
			labEnqueueResizeID,
			'(Resize Required)',
			QUEUE_RESIZE_LABEL_X,
			QUEUE_RESIZE_LABEL_Y,
		);
		this.cmd(act.step, null, false);

		//Create new array
		this.highlight(2, 0, this.enqueueCodeID);
		for (let i = 0; i < this.size * 2; i++) {
			const xpos = (i % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + RESIZE_ARRAY_START_X;
			const ypos =
				Math.floor(i / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + RESIZE_ARRAY_START_Y;
			this.cmd(
				act.createRectangle,
				this.arrayIDNew[i],
				'',
				ARRAY_ELEM_WIDTH,
				ARRAY_ELEM_HEIGHT,
				xpos,
				ypos,
			);
			this.cmd(act.createLabel, this.arrayLabelIDNew[i], i, xpos, ypos + ARRAY_ELEM_HEIGHT);
			this.cmd(act.setForegroundColor, this.arrayLabelIDNew[i], '#6ef0a9');
		}
		this.cmd(act.step, 16, false);

		this.highlight1ID = this.nextIndex++;
		this.arrayMoveID = new Array(this.size);

		//Move old elements to new array
		this.unhighlight(2, 0, this.enqueueCodeID);
		this.highlight(3, 0, this.enqueueCodeID);
		this.highlight(4, 0, this.enqueueCodeID);
		for (let i = 0; i < this.size; i++) {
			const xposinit =
				(((this.front + i) % this.arraySize) % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH +
				ARRAY_START_X;
			const yposinit =
				Math.floor(((this.front + i) % this.arraySize) / ARRAY_ELEMS_PER_LINE) *
					ARRAY_LINE_SPACING +
				ARRAY_START_Y;

			const xpos = (i % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + RESIZE_ARRAY_START_X;
			const ypos =
				Math.floor(i / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + RESIZE_ARRAY_START_Y;

			this.arrayMoveID[i] = this.nextIndex++;

			this.cmd(
				act.createLabel,
				this.arrayMoveID[i],
				this.arrayData[(this.front + i) % this.arraySize],
				xposinit,
				yposinit,
			);
			this.cmd(act.move, this.arrayMoveID[i], xpos, ypos);
			this.cmd(act.step, null, false);
		}
		this.cmd(act.step, 33, false);
		this.cmd(act.step, 34, false);
		this.cmd(act.step, 36, false);

		//Delete movement objects and set text
		for (let i = 0; i < this.size; i++) {
			this.cmd(act.delete, this.arrayMoveID[i]);
			this.cmd(act.setText, this.arrayIDNew[i], this.arrayDataNew[i]);
			this.cmd(act.step, 37, false);
			this.cmd(act.step, 36, false);
		}
		this.cmd(act.step, null, false);

		//Delete old array
		for (let i = 0; i < this.size; i++) {
			this.cmd(act.delete, this.arrayID[i]);
			this.cmd(act.delete, this.arrayLabelID[i]);
		}

		//Move new array
		this.arraySize = this.size * 2;
		this.unhighlight(3, 0, this.enqueueCodeID);
		this.unhighlight(4, 0, this.enqueueCodeID);
		this.highlight(5, 0, this.enqueueCodeID);
		for (let i = 0; i < this.size * 2; i++) {
			const xpos = (i % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
			const ypos = Math.floor(i / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;

			this.cmd(act.move, this.arrayIDNew[i], xpos, ypos);
			this.cmd(act.move, this.arrayLabelIDNew[i], xpos, ypos + ARRAY_ELEM_HEIGHT);
		}
		this.cmd(act.step, 40, false);

		this.front = 0;
		this.arrayID = this.arrayIDNew;
		this.arrayLabelID = this.arrayLabelIDNew;
		this.arrayData = this.arrayDataNew;

		this.unhighlight(5, 0, this.enqueueCodeID);
		this.highlight(6, 0, this.enqueueCodeID);

		this.cmd(act.setHighlight, this.frontID, 1);
		this.cmd(act.setHighlight, this.frontPointerID, 1);
		this.cmd(act.step, 41, false);

		this.cmd(act.setText, this.frontID, this.front);
		this.cmd(act.move, this.frontPointerID, ARRAY_START_X, ARRAY_START_Y + FRONT_LABEL_OFFSET);
		this.cmd(act.step, null, false);

		this.cmd(act.setHighlight, this.frontID, 0);
		this.cmd(act.setHighlight, this.frontPointerID, 0);

		//Delete '(resize required)' text, create circle at the "size" object, add enqueue text

		const newTail = (this.front + this.size) % this.arraySize;
		const labIndexID = this.nextIndex++;
		const labIndexValID = this.nextIndex++;

		this.cmd(act.delete, labEnqueueResizeID);

		//Just so the element travels over the array instead of underneath it
		this.cmd(act.delete, labEnqueueValID);
		const labEnqueueValIDNew = this.nextIndex++;
		this.cmd(
			act.createLabel,
			labEnqueueValIDNew,
			elemToEnqueue,
			QUEUE_ELEMENT_X,
			QUEUE_ELEMENT_Y,
		);

		this.unhighlight(6, 0, this.enqueueCodeID);
		this.unhighlight(1, 0, this.enqueueCodeID);
		this.highlight(7, 0, this.enqueueCodeID);
		this.cmd(
			act.createLabel,
			labIndexID,
			'Enqueueing at (front + size) % array.length: ',
			QUEUE_INDEX_X,
			QUEUE_INDEX_Y,
		);
		this.cmd(act.createLabel, labIndexValID, newTail, QUEUE_INDEXVAL_X, QUEUE_INDEXVAL_Y);
		this.cmd(act.createHighlightCircle, this.highlight1ID, INDEX_COLOR, SIZE_POS_X, SIZE_POS_Y);
		this.cmd(act.step, 18, false);

		//Enqueue 'elemToEnqueue'
		const xpos = (newTail % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		const ypos =
			Math.floor(newTail / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;

		this.cmd(act.move, this.highlight1ID, QUEUE_INDEXVAL_X, QUEUE_INDEXVAL_Y);
		this.cmd(act.step, null, false);

		this.cmd(act.move, this.highlight1ID, xpos, ypos + ARRAY_ELEM_HEIGHT);
		this.cmd(act.move, labIndexValID, xpos, ypos + ARRAY_ELEM_HEIGHT);
		this.cmd(act.step, null, false);

		this.cmd(act.move, labEnqueueValIDNew, xpos, ypos);
		this.cmd(act.step, null, false);

		this.cmd(act.setText, this.arrayID[newTail], elemToEnqueue);
		this.cmd(act.delete, labEnqueueValIDNew);
		this.cmd(act.delete, labIndexValID);
		this.cmd(act.step, null, false);

		this.cmd(act.delete, this.highlight1ID);

		this.cmd(act.setHighlight, this.sizeID, 1);
		this.unhighlight(7, 0, this.enqueueCodeID);
		this.highlight(8, 0, this.enqueueCodeID);
		this.cmd(act.step, 19, false);

		this.size++;

		this.cmd(act.setText, this.sizeID, this.size);
		this.cmd(act.step, null, false);

		this.unhighlight(8, 0, this.enqueueCodeID);
		this.unhighlight(0, 0, this.enqueueCodeID);
		this.cmd(act.setHighlight, this.sizeID, 0);
		this.cmd(act.delete, labEnqueueID);
		this.cmd(act.delete, labIndexID);

		this.nextIndex = this.nextIndex - this.size;

		return this.commands;
	}

	clearAll(front = 0) {
		this.enqueueField.value = '';
		this.commands = [];
		this.cmd(act.setText, this.leftoverLabelID, '');
		this.cmd(act.setText, this.leftoverValID, '');
		// if (this.codeID) {
		// 	this.removeCode(this.codeID);
		// }

		for (let i = 0; i < this.arraySize; i++) {
			this.cmd(act.setText, this.arrayID[i], '');
		}

		// Size
		this.size = 0;
		this.cmd(act.setText, this.sizeID, '0');

		// Front pointer
		this.front = front;
		const frontxpos = (this.front % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
		const frontypos =
			Math.floor(this.front / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING +
			ARRAY_START_Y +
			FRONT_LABEL_OFFSET;
		this.cmd(act.setText, this.frontID, front);
		this.cmd(act.setPosition, this.frontPointerID, frontxpos, frontypos);

		// Reset array graphic
		for (let i = SIZE; i < this.arraySize; i++) {
			this.cmd(act.delete, this.arrayID[i]);
			this.cmd(act.delete, this.arrayLabelID[i]);
		}
		this.arraySize = SIZE;

		return this.commands;
	}
}
