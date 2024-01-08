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
	addRadioButtonGroupToAlgorithmBar,
	highlight,
	sleep
} from './Algorithm.js';
import { act } from '../anim/AnimationMain';

const CODE_START_X = 25;
const CODE_START_Y = 35;
const CODE_LINE_HEIGHT = 14;
const QUEUE_START_X = 35;
const QUEUE_START_Y = 250;
const QUEUE_SPACING = 40;

const PRE_CODE = [
	['procedure preOrder(Node node)'],
	['  if node is not null:'],
	['    look at data in the node'],
	['    recurse left'],
	['    recurse right'],
	['end procedure'],
];
const IN_CODE = [
	['procedure inOrder(Node node)'],
	['  if node is not null:'],
	['    recurse left'],
	['    look at data in the node'],
	['    recurse right'],
	['end procedure'],
];
const POST_CODE = [
	['procedure postOrder(Node node)'],
	['  if node is not null:'],
	['    recurse left'],
	['    recurse right'],
	['    look at data in the node'],
	['end procedure'],
];
const LEVEL_CODE = [
	['procedure levelOrder()'],
	['  create Queue q'],
	['  add root to q'],
	['  while q is not empty'],
	['    Node curr ← remove from q'],
	['    record data from curr'],
	['    if curr.left is not null:'],
	['      add curr.left to q'],
	['    if curr.right is not null:'],
	['      add curr.right to q'],
	['end procedure'],
];
const ADD_CODE = [
	['procedure add(data)'],
	['  root ← addH(data, root) '],
	['end procedure'],
	[''],
	['procedure addH(data, curr)'],
	['  if curr == null'],
	['    size++'],
	['    return new Node(data)'],
	['  else if data < curr.data'],
	['    curr.left ← addH(data, curr.left)'],
	['  else if data > curr.data'],
	['    curr.right ← addH(data, curr.right)'],
	['  return curr'],
];
const REMOVE_CODE_SUCC = [
	['procedure remove(data)'],
	['  root ← removeH(data, root)'],
	['end procedure'],
	[''],
	['procedure remove(data, curr)'],
	['  if curr == null'],
	['    return null'],
	['  else if data < curr.data'],
	['    curr.left ← removeH(data, curr.left)'],
	['  else if data > curr.data'],
	['    curr.right ← removeH(data, curr.right)'],
	['  else'],
	['    size--'],
	['    if curr.left == null && curr.right == null'],
	['      return null'],
	['    else if curr.left == null'],
	['      return curr.right'],
	['    else if curr.right == null'],
	['      return curr.left'],
	['    else'],
	['      curr.right ← removeSuccessor(curr.right)'],
	['      curr.data ← successor data'],
	['  return curr'],
	[''],
	['procedure removeSuccessor(curr)'],
	['  if curr.left == null'],
	['    return curr.right'],
	['  else'],
	['    curr.left ← removeSuccessor(curr.left)'],
	['    return curr'],
	['end procedure'],
];
const REMOVE_CODE_PRED = [
	['procedure remove(data)'],
	['  root ← removeH(data, root)'],
	['end procedure'],
	[''],
	['procedure remove(data, curr)'],
	['  if curr == null'],
	['    return null'],
	['  else if data < curr.data'],
	['    curr.left ← removeH(data, curr.left)'],
	['  else if data > curr.data'],
	['    curr.right ← removeH(data, curr.right)'],
	['  else'],
	['    size--'],
	['    if curr.left == null && curr.right == null'],
	['      return null'],
	['    else if curr.left == null'],
	['      return curr.right'],
	['    else if curr.right == null'],
	['      return curr.left'],
	['    else'],
	['      curr.left ← removePredecessor(curr.left)'],
	['      curr.data ← predecessor data'],
	['  return curr'],
	[''],
	['procedure removePredecessor(curr)'],
	['  if curr.right == null'],
	['    return curr.left'],
	['  else'],
	['    curr.right ← removePredecessor(curr.right)'],
	['    return curr'],
	['end procedure'],
];
const FIND_CODE = [
	['procedure find(data)'],
	['  return findH(data, root)'],
	['end procedure'],
	[''],
	['procedure findH(data, curr)'],
	['  if curr == null'],
	['    return null'],
	['  else if data < curr.data'],
	['    return findH(curr.left)'],
	['  else if data > curr.data'],
	['    return findH(curr.right)'],
	['  else'],
	['    return curr.data'],
	['  end procedure'],
];

export default class BST extends Algorithm {
	constructor(am, w, h) {
		super(am, w, h);

		this.first_print_pos_y = h - 2 * BST.PRINT_VERTICAL_GAP;
		this.print_max = w - 10;
		this.startingX = w / 2;
		this.addControls();
		this.nextIndex = 1;
		this.commands = [];
		this.edges = [];
		this.toClear = [];
		this.cmd(act.createLabel, 0, '', BST.EXPLANITORY_TEXT_X, BST.EXPLANITORY_TEXT_Y, 0);
		this.animationManager.startNewAnimation(this.commands);
		this.animationManager.skipForward();
		this.animationManager.clearHistory();
		this.x = 0;
	}

	addControls() {
		this.controls = [];

		const verticalGroup = addGroupToAlgorithmBar(false);
		const horizontalGroup = addGroupToAlgorithmBar(true, verticalGroup);

		this.insertField = addControlToAlgorithmBar('Text', '', horizontalGroup);
		this.insertField.style.textAlign = 'center';
		this.insertField.onkeydown = this.returnSubmit(
			this.insertField,
			this.insertCallback.bind(this),
			4,
			true,
		);
		this.controls.push(this.insertField);

		this.insertButton = addControlToAlgorithmBar('Button', 'Insert', horizontalGroup);
		this.insertButton.onclick = this.insertCallback.bind(this);
		this.controls.push(this.insertButton);


		this.deleteField = addControlToAlgorithmBar('Text', '', horizontalGroup);
		this.deleteField.style.textAlign = 'center';
		this.deleteField.onkeydown = this.returnSubmit(
			this.deleteField,
			this.deleteCallback.bind(this),
			4,
			true,
		);
		this.controls.push(this.deleteField);

		this.deleteButton = addControlToAlgorithmBar('Button', 'Delete', horizontalGroup);
		this.deleteButton.onclick = this.deleteCallback.bind(this);
		this.controls.push(this.deleteButton);


		this.findField = addControlToAlgorithmBar('Text', '', horizontalGroup);
		this.findField.style.textAlign = 'center';
		this.findField.onkeydown = this.returnSubmit(
			this.findField,
			this.findCallback.bind(this),
			4,
			true,
		);
		this.controls.push(this.findField);

		this.findButton = addControlToAlgorithmBar('Button', 'Find', horizontalGroup);
		this.findButton.onclick = this.findCallback.bind(this);
		this.controls.push(this.findButton);

		this.traversal = 'in';

		verticalGroup.parentElement.style.alignSelf = 'center';

		const verticalGroup2 = addGroupToAlgorithmBar(false);

		addDivisorToAlgorithmBar(horizontalGroup);

		// Random data button
		this.randomButton = addControlToAlgorithmBar('Button', 'Random', verticalGroup2);
		this.randomButton.onclick = this.randomCallback.bind(this);
		this.controls.push(this.randomButton);

		// Clear button
		this.clearButton = addControlToAlgorithmBar('Button', 'Clear', verticalGroup2);
		this.clearButton.onclick = () => this.clearCallback();
		this.controls.push(this.clearButton);

		this.predSucc = 'succ';
	}

	reset() {
		this.nextIndex = 1;
		this.treeRoot = null;
		this.edges = [];
		this.toClear = [];
		this.x = 0;
	}

	insertCallback() {
		const insertedValue = this.insertField.value;
		this.x = 0;
		// Get text value
		if (insertedValue !== '') {
			// set text value
			this.insertField.value = '';
			this.implementAction(this.add.bind(this), parseInt(insertedValue), false);
		} else {
			this.shake(this.insertButton);
		}
	}

	deleteCallback() {
		const deletedValue = this.deleteField.value;
		this.x = 0;
		if (deletedValue !== '' && this.treeRoot) {
			this.deleteField.value = '';
			this.implementAction(this.remove.bind(this), parseInt(deletedValue));
		} else {
			this.shake(this.deleteButton);
		}
	}

	findCallback() {
		const findValue = this.findField.value;
		this.x = 0;
		if (findValue !== '' && this.treeRoot) {
			this.findField.value = '';
			this.implementAction(this.findElement.bind(this), parseInt(findValue));
		} else {
			this.shake(this.findButton);
		}
	}

	traverseCallback() {
		this.implementAction(this.traverse.bind(this));
	}

	randomCallback() {
		const LOWER_BOUND = 0;
		const UPPER_BOUND = 16;
		const MAX_SIZE = 12;
		const MIN_SIZE = 2;
		const randomSize = Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1)) + MIN_SIZE;

		this.implementAction(this.clear.bind(this));

		for (let i = 0; i < randomSize; i++) {
			this.implementAction(
				this.add.bind(this),
				Math.floor(Math.random() * (UPPER_BOUND - LOWER_BOUND + 1)) + LOWER_BOUND,
			true);
			this.clearOldObjects();
			this.animationManager.skipForward();
			this.animationManager.clearHistory();
		}
	}

	clearCallback() {
		this.implementAction(this.clear.bind(this));
	}

	sizeChanged(newWidth) {
		this.startingX = newWidth / 2;
	}

	printTree() {
		this.commands = [];

		if (this.treeRoot != null) {
			this.highlightID = this.nextIndex++;
			const firstLabel = this.nextIndex;
			this.cmd(
				act.createHighlightCircle,
				this.highlightID,
				BST.HIGHLIGHT_COLOR,
				this.treeRoot.x,
				this.treeRoot.y,
			);
			this.xPosOfNextLabel = BST.FIRST_PRINT_POS_X;
			this.yPosOfNextLabel = this.first_print_pos_y;
			this.printTreeRec(this.treeRoot);
			this.cmd(act.delete, this.highlightID);
			this.cmd(act.step, null, false);
			for (let i = firstLabel; i < this.nextIndex; i++) this.cmd(act.delete, i);
			this.nextIndex = this.highlightID; /// Reuse objects.  Not necessary.
		}
		return this.commands;
	}

	preOrderRec(tree, passedCodeID) {
		this.codeID = passedCodeID;
		this.cmd(act.step, null, false);

		const nextLabelID = this.nextIndex++;

		this.unhighlight(3, 0);
		this.unhighlight(4, 0);
		this.highlight(2, 0);

		this.cmd(act.createLabel, nextLabelID, tree.data, tree.x, tree.y);
		this.cmd(act.setForegroundColor, nextLabelID, BST.PRINT_COLOR);
		this.cmd(act.move, nextLabelID, this.xPosOfNextLabel, this.yPosOfNextLabel);
		this.cmd(act.step, null, false);

		this.xPosOfNextLabel += BST.PRINT_HORIZONTAL_GAP;
		if (this.xPosOfNextLabel > this.print_max) {
			this.xPosOfNextLabel = BST.FIRST_PRINT_POS_X;
			this.yPosOfNextLabel += BST.PRINT_VERTICAL_GAP;
		}
		this.unhighlight(2, 0);

		if (tree.left != null) {
			this.highlight(3, 0);
			this.cmd(act.move, this.highlightID, tree.left.x, tree.left.y);
			this.preOrderRec(tree.left, passedCodeID);

			this.cmd(act.move, this.highlightID, tree.x, tree.y);
			this.cmd(act.step, null, false);
		}
		this.unhighlight(3, 0);

		if (tree.right != null) {
			this.highlight(4, 0);
			this.cmd(act.move, this.highlightID, tree.right.x, tree.right.y);
			this.preOrderRec(tree.right, passedCodeID);
			this.cmd(act.move, this.highlightID, tree.x, tree.y);
			this.cmd(act.step, null, false);
		}
		this.unhighlight(4, 0);

		return;
	}

	levelOrder(tree, passedCodeID) {
		this.codeID = passedCodeID;
		const queue = [tree];
		const queueLabelId = this.nextIndex++;

		const queueID = [this.nextIndex];
		this.cmd(
			act.createLabel,
			queueLabelId,
			'Queue: ',
			QUEUE_START_X - 5,
			QUEUE_START_Y - 25,
			0,
		);
		this.cmd(act.step, null, false);
		this.cmd(act.createLabel, this.nextIndex, tree.data, tree.x, tree.y);
		this.cmd(act.setForegroundColor, this.nextIndex, BST.PRINT_COLOR);
		this.cmd(act.move, this.nextIndex++, QUEUE_START_X, QUEUE_START_Y, 0);
		this.highlight(2, 0);
		this.cmd(act.step, null, false);
		this.unhighlight(2, 0);

		this.highlight(3, 0);
		this.cmd(act.step, null, false);

		while (queue.length !== 0) {
			const curr = queue.shift();

			this.cmd(act.move, this.highlightID, curr.x, curr.y);
			this.unhighlight(3, 0);

			const currId = queueID.shift();
			this.cmd(act.move, currId, this.xPosOfNextLabel, this.yPosOfNextLabel);
			this.highlight(4, 0);
			this.highlight(5, 0);
			for (let i = 0; i < queueID.length; i++) {
				this.cmd(act.move, queueID[i], QUEUE_START_X + i * QUEUE_SPACING, QUEUE_START_Y);
			}
			this.cmd(act.step, null, false);
			this.unhighlight(4, 0);
			this.unhighlight(5, 0);

			this.xPosOfNextLabel += BST.PRINT_HORIZONTAL_GAP;
			if (this.xPosOfNextLabel > this.print_max) {
				this.xPosOfNextLabel = BST.FIRST_PRINT_POS_X;
				this.yPosOfNextLabel += BST.PRINT_VERTICAL_GAP;
			}

			this.highlight(6, 0);
			if (curr.left != null) {
				this.cmd(act.step, null, false);
				this.unhighlight(6, 0);
				this.highlight(7, 0);
				queue.push(curr.left);
				queueID.push(this.nextIndex);
				this.cmd(act.createLabel, this.nextIndex, curr.left.data, curr.left.x, curr.left.y);
				this.cmd(act.setForegroundColor, this.nextIndex, BST.PRINT_COLOR);
				this.cmd(
					act.move,
					this.nextIndex++,
					QUEUE_START_X + (queue.length - 1) * QUEUE_SPACING,
					QUEUE_START_Y,
				);
				this.cmd(act.step, null, false);
				this.unhighlight(7, 0);
			} else {
				this.cmd(act.step, null, false);
				this.unhighlight(6, 0);
			}

			this.highlight(8, 0);
			if (curr.right != null) {
				this.cmd(act.step, null, false);
				this.unhighlight(8, 0);
				this.highlight(9, 0);
				queue.push(curr.right);
				queueID.push(this.nextIndex);
				this.cmd(
					act.createLabel,
					this.nextIndex,
					curr.right.data,
					curr.right.x,
					curr.right.y,
				);
				this.cmd(act.setForegroundColor, this.nextIndex, BST.PRINT_COLOR);
				this.cmd(
					act.move,
					this.nextIndex++,
					QUEUE_START_X + (queue.length - 1) * QUEUE_SPACING,
					QUEUE_START_Y,
				);
				this.cmd(act.step, null, false);
				this.unhighlight(9, 0);
			} else {
				this.cmd(act.step, null, false);
				this.unhighlight(8, 0);
			}
			this.highlight(3, 0);
			this.cmd(act.step, null, false);
		}
		this.unhighlight(3, 0);
	}

	traverse() {
		this.commands = [];
		this.clearOldObjects();

		if (this.treeRoot == null) {
			return this.commands;
		}

		this.cmd(act.setText, 0, '');
		this.highlightID = this.nextIndex++;
		const firstLabel = this.nextIndex;
		this.cmd(
			act.createHighlightCircle,
			this.highlightID,
			BST.HIGHLIGHT_COLOR,
			this.treeRoot.x,
			this.treeRoot.y,
		);
		this.xPosOfNextLabel = BST.FIRST_PRINT_POS_X;
		this.yPosOfNextLabel = this.first_print_pos_y;

		if (this.traversal === 'pre') {
			this.codeID = this.addCodeToCanvasBase(
				PRE_CODE,
				CODE_START_X,
				CODE_START_Y,
				CODE_LINE_HEIGHT,
			);
			this.preOrderRec(this.treeRoot, this.codeID);
		} else if (this.traversal === 'in') {
			this.codeID = this.addCodeToCanvasBase(
				IN_CODE,
				CODE_START_X,
				CODE_START_Y,
				CODE_LINE_HEIGHT,
			);
			this.printTreeRec(this.treeRoot, this.codeID);
		} else if (this.traversal === 'post') {
			this.codeID = this.addCodeToCanvasBase(
				POST_CODE,
				CODE_START_X,
				CODE_START_Y,
				CODE_LINE_HEIGHT,
			);
			this.postOrderRec(this.treeRoot, this.codeID);
		} else if (this.traversal === 'level') {
			this.codeID = this.addCodeToCanvasBase(
				LEVEL_CODE,
				CODE_START_X,
				CODE_START_Y,
				CODE_LINE_HEIGHT,
			);
			this.levelOrder(this.treeRoot, this.codeID);
		}

		this.cmd(act.delete, this.highlightID);
		this.cmd(act.step, null, false);

		for (let i = firstLabel; i < this.nextIndex; i++) this.toClear.push(i);
		// this.nextIndex = this.highlightID; /// Reuse objects.  Not necessary.

		return this.commands;
	}

	postOrderRec(tree, passedCodeID) {
		this.codeID = passedCodeID;
		this.cmd(act.step, null, false);
		if (tree.left != null) {
			this.unhighlight(3, 0);
			this.highlight(2, 0);
			this.cmd(act.move, this.highlightID, tree.left.x, tree.left.y);
			this.postOrderRec(tree.left, passedCodeID);
			this.cmd(act.move, this.highlightID, tree.x, tree.y);
			this.cmd(act.step, null, false);
		}
		this.unhighlight(2, 0);

		if (tree.right != null) {
			this.unhighlight(2, 0);
			this.highlight(3, 0);
			this.cmd(act.move, this.highlightID, tree.right.x, tree.right.y);
			this.postOrderRec(tree.right, passedCodeID);
			this.cmd(act.move, this.highlightID, tree.x, tree.y);
			this.cmd(act.step, null, false);
		}
		this.unhighlight(3, 0);

		this.highlight(4, 0);
		const nextLabelID = this.nextIndex++;
		this.cmd(act.createLabel, nextLabelID, tree.data, tree.x, tree.y);
		this.cmd(act.setForegroundColor, nextLabelID, BST.PRINT_COLOR);
		this.cmd(act.move, nextLabelID, this.xPosOfNextLabel, this.yPosOfNextLabel);
		this.cmd(act.step, null, false);

		this.xPosOfNextLabel += BST.PRINT_HORIZONTAL_GAP;
		if (this.xPosOfNextLabel > this.print_max) {
			this.xPosOfNextLabel = BST.FIRST_PRINT_POS_X;
			this.yPosOfNextLabel += BST.PRINT_VERTICAL_GAP;
		}
		this.unhighlight(4, 0);

		return;
	}

	printTreeRec(tree, passedCodeID) {
		this.codeID = passedCodeID;

		this.cmd(act.step, null, false);
		if (tree.left != null) {
			this.unhighlight(3, 0);
			this.unhighlight(4, 0);
			this.highlight(2, 0);
			this.cmd(act.move, this.highlightID, tree.left.x, tree.left.y);
			this.printTreeRec(tree.left, passedCodeID);
			this.cmd(act.move, this.highlightID, tree.x, tree.y);
			this.cmd(act.step, null, false);
		}
		this.unhighlight(2, 0);

		this.unhighlight(4, 0);
		this.highlight(3, 0);
		const nextLabelID = this.nextIndex++;
		this.cmd(act.createLabel, nextLabelID, tree.data, tree.x, tree.y);
		this.cmd(act.setForegroundColor, nextLabelID, BST.PRINT_COLOR);
		this.cmd(act.move, nextLabelID, this.xPosOfNextLabel, this.yPosOfNextLabel);
		this.cmd(act.step, null, false);

		this.xPosOfNextLabel += BST.PRINT_HORIZONTAL_GAP;
		if (this.xPosOfNextLabel > this.print_max) {
			this.xPosOfNextLabel = BST.FIRST_PRINT_POS_X;
			this.yPosOfNextLabel += BST.PRINT_VERTICAL_GAP;
		}
		this.unhighlight(3, 0);

		if (tree.right != null) {
			this.unhighlight(2, 0);
			this.unhighlight(3, 0);
			this.highlight(4, 0);
			this.cmd(act.move, this.highlightID, tree.right.x, tree.right.y);
			this.printTreeRec(tree.right, passedCodeID);
			this.cmd(act.move, this.highlightID, tree.x, tree.y);
			this.cmd(act.step, null, false);
		}
		this.unhighlight(4, 0);

		return;
	}

	findElement(findValue) {
		this.commands = [];
		this.clearOldObjects();

		const firstLabel = this.nextIndex;
		this.codeID = this.addCodeToCanvasBase(FIND_CODE, CODE_START_X + 30, CODE_START_Y + 80);
		for (let i = firstLabel; i < this.nextIndex; i++) this.toClear.push(i);

		this.highlightID = this.nextIndex++;

		this.highlight(0, 0);
		this.highlight(1, 0);
		this.highlight(4, 0);
		this.cmd(act.step, null, false);

		this.doFind(this.treeRoot, findValue);

		this.unhighlight(0, 0);
		this.unhighlight(1, 0);
		this.unhighlight(4, 0);

		return this.commands;
	}

	doFind(tree, value) {
		this.cmd(act.setText, 0, 'Searching for ' + value);
		this.cmd(act.step, 97, false);
		this.cmd(act.step, 99, false);
		if (tree != null) {
			this.cmd(act.setHighlight, tree.graphicID, 1);
			if (tree.data === value) {
				this.highlight(11, 0);
				this.highlight(12, 0);
				this.cmd(
					act.setText,
					0,
					'Searching for ' + value + ' : ' + value + ' = ' + value + ' (Element found!)',
				);
				this.cmd(act.step, 100, false);

				this.unhighlight(11, 0);
				this.unhighlight(12, 0);
				this.cmd(act.setText, 0, 'Found: ' + value);
				this.cmd(act.setHighlight, tree.graphicID, 0);
			} 
			else {
				this.cmd(act.step, 103, false);
				if (tree.data > value) {
					this.highlight(7, 0);
					this.highlight(8, 0);
					this.cmd(
						act.setText,
						0,
						'Searching for ' +
							value +
							' : ' +
							value +
							' < ' +
							tree.data +
							' (look to left subtree)',
					);
					this.cmd(act.step, 107, false);

					this.cmd(act.setHighlight, tree.graphicID, 0);
					if (tree.left != null) {
						this.cmd(
							act.createHighlightCircle,
							this.highlightID,
							BST.HIGHLIGHT_COLOR,
							tree.x,
							tree.y,
						);
						this.cmd(act.move, this.highlightID, tree.left.x, tree.left.y);
						this.cmd(act.step, null, false);
						this.cmd(act.delete, this.highlightID);
					}
					this.unhighlight(7, 0);
					this.unhighlight(8, 0);
					this.doFind(tree.left, value);
				} else {
					this.highlight(9, 0);
					this.highlight(10, 0);
					this.cmd(
						act.setText,
						0,
						' Searching for ' +
							value +
							' : ' +
							value +
							' > ' +
							tree.data +
							' (look to right subtree)',
					);
					this.cmd(act.step, 104, false);
					this.cmd(act.setHighlight, tree.graphicID, 0);
					if (tree.right != null) {
						this.cmd(
							act.createHighlightCircle,
							this.highlightID,
							BST.HIGHLIGHT_COLOR,
							tree.x,
							tree.y,
						);
						this.cmd(act.move, this.highlightID, tree.right.x, tree.right.y);
						this.cmd(act.step, null, false);
						this.cmd(act.delete, this.highlightID);
					}
					this.unhighlight(9, 0);
					this.unhighlight(10, 0);
					this.doFind(tree.right, value);
				}
			}
		} else {
			this.highlight(5, 0);
			this.highlight(6, 0);
			this.cmd(act.setText, 0, 'Searching for ' + value + ' :  (Element not found)');
			this.cmd(act.step, 100, false);

			this.unhighlight(5, 0);
			this.unhighlight(6, 0);
			this.cmd(act.setText, 0, 'Searching for ' + value + ' :  (Element not found)');
		}
	}

	remakeTree(curr) {
		if (curr == null) return;
		if (curr.left != null) {
			this.cmd(act.connect, curr.graphicID, curr.left.graphicID, BST.LINK_COLOR);
			this.remakeTree(curr.left);
		}
		if (curr.right != null) {
			this.cmd(act.connect, curr.graphicID, curr.right.graphicID, BST.LINK_COLOR);
			this.remakeTree(curr.right);
		}
	}

	clearOldObjects() {
		this.toClear.forEach(i => this.cmd(act.delete, i));
		this.toClear = [];
	}

	add(data, rand) {
		this.commands = [];
		this.clearOldObjects();

		const firstLabel = this.nextIndex;
		this.codeID = this.addCodeToCanvasBase(ADD_CODE, CODE_START_X + 30, CODE_START_Y + 80);
		for (let i = firstLabel; i < this.nextIndex; i++) this.toClear.push(i);

		this.highlight(0, 0);
		this.highlight(1, 0);
		this.highlight(4, 0);
		this.cmd(act.step, 20, rand);
		this.cmd(act.setText, 0, 'Inserting ' + data);
		this.cmd(act.step, 21, rand);
		this.treeRoot = this.addH(data, this.treeRoot, rand);

		this.resizeTree();
		this.cmd(act.step, 21, rand);

		this.unhighlight(0, 0);
		this.unhighlight(1, 0);
		this.unhighlight(4, 0);
		this.unhighlight(5, 0);
		this.unhighlight(6, 0);
		this.unhighlight(7, 0);
		this.unhighlight(12, 0);
		
		return this.commands;
	}

	addH(data, curr, rand) {
		this.cmd(act.step, 25, rand);
		this.cmd(act.step, 28, rand);
		if (curr == null) {
			this.highlight(5, 0);
			this.highlight(6, 0);
			this.highlight(7, 0);
			this.cmd(act.setText, 0, 'Null found, inserting new node');
			const treeNodeID = this.nextIndex++;
			this.cmd(act.createCircle, treeNodeID, data, 30, BST.STARTING_Y);
			this.cmd(act.setForegroundColor, treeNodeID, BST.FOREGROUND_COLOR);
			this.cmd(act.setBackgroundColor, treeNodeID, BST.BACKGROUND_COLOR);
			this.cmd(act.step, 29, rand);

			this.cmd(act.setText, 0, '');
			this.cmd(act.step, 30, rand);
			return new BSTNode(data, treeNodeID, 0, 0);
		}
		this.cmd(act.setHighlight, curr.graphicID, 1);
		this.cmd(act.step, 34, rand);
		
		if (data < curr.data) {
			this.highlight(8, 0);
			this.highlight(9, 0);
			this.cmd(act.setText, 0, `${data} < ${curr.data}. Looking at left subtree`);
			this.cmd(act.step, 35, rand);

			this.unhighlight(8, 0);
			this.unhighlight(9, 0);
			curr.left = this.addH(data, curr.left, rand);
			curr.left.parent = curr;
			this.resizeTree();
			const connected = this.connectSmart(curr.graphicID, curr.left.graphicID);
			connected && this.cmd(act.step, null, false);
		} else if (data > curr.data) {
			this.cmd(act.step, 36, rand);
			this.highlight(10, 0);
			this.highlight(11, 0);
			this.cmd(act.setText, 0, `${data} > ${curr.data}. Looking at right subtree`);
			this.cmd(act.step, 37, rand);
			this.unhighlight(10, 0);
			this.unhighlight(11, 0);
			curr.right = this.addH(data, curr.right, rand);
			curr.right.parent = curr;
			this.resizeTree();
			const connected = this.connectSmart(curr.graphicID, curr.right.graphicID);
			connected && this.cmd(act.step, null, false);
		} else {
			this.cmd(act.step, 36, rand);
			this.highlight(12, 0);
			this.cmd(act.setText, 0, `${data} == ${curr.data}. Ignoring duplicate!`);
			this.cmd(act.step, null, false);
		}
		this.unhighlight(4, 0);
		this.unhighlight(5, 0);
		this.unhighlight(6, 0);
		this.unhighlight(7, 0);
		this.highlight(12, 0);
		this.cmd(act.setHighlight, curr.graphicID, 0);
		this.cmd(act.setText, 0, '');
		this.cmd(act.step, 39, rand);
		return curr;
	}

	connectSmart(id1, id2) {
		if (!this.edges.some(e => e[0] === id1 && e[1] === id2)) {
			this.cmd(act.connect, id1, id2, BST.LINK_COLOR);
			this.edges.push([id1, id2]);
			return true;
		}
		return false;
	}

	deleteNode(curr) {
		this.cmd(act.delete, curr.graphicID);
	}

	remove(data) {
		this.commands = [];
		this.clearOldObjects();

		const firstLabel = this.nextIndex;
		this.codeID =
			this.predSucc === 'succ'
				? this.addCodeToCanvasBase(REMOVE_CODE_SUCC, CODE_START_X + 15, CODE_START_Y + 15)
				: this.addCodeToCanvasBase(REMOVE_CODE_PRED, CODE_START_X + 15, CODE_START_Y + 15);
		for (let i = firstLabel; i < this.nextIndex; i++) this.toClear.push(i);

		this.highlight(0, 0);
		this.highlight(1, 0);
		this.highlight(4, 0);
		this.cmd(act.setText, 0, `Deleting ${data}`);
		this.cmd(act.step, null, false);
		this.cmd(act.setText, 0, ' ');

		this.highlightID = this.nextIndex++;
		this.treeRoot = this.removeH(this.treeRoot, data);
		this.cmd(act.setText, 0, '');
		this.resizeTree();

		this.unhighlight(0, 0);
		this.unhighlight(1, 0);
		this.unhighlight(4, 0);
		this.unhighlight(22, 0);
		return this.commands;
	}

	removeH(curr, data) {
		this.cmd(act.step, 44, false);
		this.cmd(act.step, 46, false);
		if (curr == null) {
			this.highlight(5, 0);
			this.highlight(6, 0);
			this.cmd(act.setText, 0, `${data} not found in the tree`);
			this.cmd(act.step, 47, false);
			return;
		}
		this.cmd(act.setHighlight, curr.graphicID, 1);
		this.cmd(act.step, 51, false);
		if (data < curr.data) {
			this.highlight(7, 0);
			this.highlight(8, 0);
			this.cmd(act.setText, 0, `${data} < ${curr.data}. Looking left`);
			this.cmd(act.step, 52, false);

			this.unhighlight(7, 0);
			this.unhighlight(8, 0);

			curr.left = this.removeH(curr.left, data);
			this.cmd(act.step, 53, false);
			if (curr.left != null) {
				curr.left.parent = curr;
				this.connectSmart(curr.graphicID, curr.left.graphicID);
				this.resizeTree();
			}
		} else if (data > curr.data) {
			this.cmd(act.step, 54, false);
			this.highlight(9, 0);
			this.highlight(10, 0);
			this.cmd(act.setText, 0, `${data} > ${curr.data}. Looking right`);
			this.cmd(act.step, 55, false);

			this.unhighlight(9, 0);
			this.unhighlight(10, 0);
			curr.right = this.removeH(curr.right, data);
			this.cmd(act.step, 56, false);
			if (curr.right != null) {
				curr.right.parent = curr;
				this.connectSmart(curr.graphicID, curr.right.graphicID);
				this.resizeTree();
			}
		} else {
			this.cmd(act.step, 54, false);
			this.cmd(act.setText, 0, `Found node with data ${data}`);
			this.highlight(11, 0);
			this.highlight(12, 0);
			this.cmd(act.step, 63, false);

			this.unhighlight(12, 0);
			if (curr.left == null && curr.right == null) {
				this.highlight(13, 0);
				this.highlight(14, 0);
				this.cmd(act.setText, 0, 'Element to delete is a leaf node');
				this.cmd(act.step, 64, false);

				this.deleteNode(curr);
				this.cmd(act.step, 65, false);

				this.unhighlight(11, 0);
				this.unhighlight(13, 0);
				this.unhighlight(14, 0);
				return null;
			} else if (curr.left == null) {
				this.highlight(15, 0);
				this.highlight(16, 0);
				this.cmd(act.setText, 0, `One-child case, replace with right child`);
				this.cmd(act.step, 64, false);

				this.deleteNode(curr);
				this.cmd(act.step, 65, false);

				this.unhighlight(11, 0);
				this.unhighlight(15, 0);
				this.unhighlight(16, 0);
				return curr.right;
			} else if (curr.right == null) {
				this.cmd(act.step, 66, false);
				this.highlight(17, 0);
				this.highlight(18, 0);
				this.cmd(act.setText, 0, `One-child case, replace with left child`);
				this.cmd(act.step, 67, false);

				this.deleteNode(curr);
				this.cmd(act.step, 68, false);

				this.unhighlight(11, 0);
				this.unhighlight(17, 0);
				this.unhighlight(18, 0);
				return curr.left;
			} else {
				this.highlight(19, 0);
				this.highlight(20, 0);
				this.cmd(act.step, 66, false);
				this.cmd(act.step, 72, false);
				const dummy = [];
				this.cmd(act.step, 74, false);
				this.cmd(act.step, 77, false);
				this.cmd(act.step, 78, false);
				if (this.predSucc === 'succ') {
					this.cmd(act.setText, 0, `Two-child case, replace data with successor`);
					this.cmd(act.step, null, false);
					curr.right = this.removeSucc(curr.right, dummy);
					curr.right && this.connectSmart(curr.graphicID, curr.right.graphicID);
				} else {
					this.cmd(act.setText, 0, `Two-child case, replace data with predecessor`);
					this.cmd(act.step, null, false);
					curr.left = this.removePred(curr.left, dummy);
					curr.left && this.connectSmart(curr.graphicID, curr.left.graphicID);
				}
				this.resizeTree();
				this.unhighlight(19, 0);
				this.unhighlight(20, 0);
				this.unhighlight(24, 0);
				this.unhighlight(29, 0);
				this.highlight(21, 0);
				this.cmd(act.step, 90, false);
				curr.data = dummy[0];
				this.cmd(act.setText, curr.graphicID, curr.data);
				this.cmd(act.step, 92, false);
			}
		}
		this.unhighlight(5, 0);
		this.unhighlight(6, 0);
		this.unhighlight(11, 0);
		this.unhighlight(21, 0);
		this.unhighlight(24, 0);
		this.highlight(22, 0);
		this.cmd(act.setHighlight, curr.graphicID, 0);
		this.cmd(act.setText, 0, '');
		return curr;
	}

	removeSucc(curr, dummy) {
		this.unhighlight(27, 0);
		this.unhighlight(28, 0);
		this.highlight(24, 0);
		this.cmd(act.setHighlight, curr.graphicID, 1, '#0000ff');
		this.cmd(act.step, null, false);

		if (curr.left == null) {
			this.highlight(25, 0);
			this.cmd(act.setText, 0, 'No left child, replace with right child');
			this.cmd(act.step, 84, false);

			dummy.push(curr.data);
			this.highlight(26, 0);
			this.deleteNode(curr);
			this.cmd(act.step, 85, false);

			this.unhighlight(25, 0);
			this.unhighlight(26, 0);
			this.cmd(act.setText, 0, '');
			return curr.right;
		}
		this.highlight(27, 0);
		this.highlight(28, 0);
		this.cmd(act.setText, 0, 'Left child exists, look left');
		this.cmd(act.step, 79, false);
		this.cmd(act.step, 80, false);
		this.cmd(act.step, 78, false);

		curr.left = this.removeSucc(curr.left, dummy);
		if (curr.left != null) {
			curr.left.parent = curr;
			this.connectSmart(curr.graphicID, curr.left.graphicID);
			this.cmd(act.step, 84, false);
			this.cmd(act.step, 86, false);
			this.cmd(act.step, 87, false);
			this.resizeTree();
		}
		this.highlight(29, 0);
		this.cmd(act.setHighlight, curr.graphicID, 0, '#0000ff');
		return curr;
	}

	removePred(curr, dummy) {
		this.unhighlight(27, 0);
		this.unhighlight(28, 0);
		this.highlight(24, 0);
		this.cmd(act.setHighlight, curr.graphicID, 1, '#0000ff');
		this.cmd(act.step, null, false);

		if (curr.right == null) {
			this.highlight(25, 0);
			this.cmd(act.setText, 0, 'No right child, replace with right child');
			this.cmd(act.step, null, false);

			dummy.push(curr.data);
			this.highlight(26, 0);
			this.deleteNode(curr);
			this.cmd(act.step, null, false);

			this.unhighlight(25, 0);
			this.unhighlight(26, 0);
			this.cmd(act.setText, 0, '');
			return curr.left;
		}
		this.highlight(27, 0);
		this.highlight(28, 0);
		this.cmd(act.setText, 0, 'Right child exists, look right');
		this.cmd(act.step, null, false);

		curr.right = this.removePred(curr.right, dummy);
		if (curr.right != null) {
			curr.right.parent = curr;
			this.connectSmart(curr.graphicID, curr.right.graphicID);
			this.resizeTree();
		}
		this.highlight(29, 0);
		this.cmd(act.setHighlight, curr.graphicID, 0, '#0000ff');
		return curr;
	}

	resizeTree() {
		if (this.treeRoot == null) {
			return;
		}
		let startingPoint = this.startingX;
		this.resizeWidths(this.treeRoot);
		if (this.treeRoot != null) {
			if (this.treeRoot.leftWidth > startingPoint) {
				startingPoint = this.treeRoot.leftWidth;
			} else if (this.treeRoot.rightWidth > startingPoint) {
				startingPoint = Math.max(
					this.treeRoot.leftWidth,
					2 * startingPoint - this.treeRoot.rightWidth,
				);
			}
			this.setNewPositions(this.treeRoot, startingPoint, BST.STARTING_Y, 0);
			this.animateNewPositions(this.treeRoot);
			this.cmd(act.step, null, false);
		}
	}

	setNewPositions(tree, xPosition, yPosition, side) {
		if (tree != null) {
			tree.y = yPosition;
			if (side === -1) {
				xPosition = xPosition - tree.rightWidth;
			} else if (side === 1) {
				xPosition = xPosition + tree.leftWidth;
			}
			tree.x = xPosition;
			this.setNewPositions(tree.left, xPosition, yPosition + BST.HEIGHT_DELTA, -1);
			this.setNewPositions(tree.right, xPosition, yPosition + BST.HEIGHT_DELTA, 1);
		}
	}

	animateNewPositions(tree) {
		if (tree != null) {
			this.cmd(act.move, tree.graphicID, tree.x, tree.y);
			this.animateNewPositions(tree.left);
			this.animateNewPositions(tree.right);
		}
	}

	resizeWidths(tree) {
		if (tree == null) {
			return 0;
		}
		tree.leftWidth = Math.max(this.resizeWidths(tree.left), BST.WIDTH_DELTA / 2);
		tree.rightWidth = Math.max(this.resizeWidths(tree.right), BST.WIDTH_DELTA / 2);
		return tree.leftWidth + tree.rightWidth;
	}

	clear() {
		this.insertField.value = '';
		this.deleteField.value = '';
		this.findField.value = '';
		this.commands = [];
		this.clearOldObjects();
		this.x = 0;

		this.recClear(this.treeRoot);
		this.treeRoot = null;
		return this.commands;
	}

	recClear(curr) {
		if (curr != null) {
			this.cmd(act.delete, curr.graphicID);
			this.recClear(curr.left);
			this.recClear(curr.right);
		}
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

class BSTNode {
	constructor(val, id, initialX, initialY) {
		this.data = val;
		this.x = initialX;
		this.y = initialY;

		this.graphicID = id;
		this.left = null;
		this.right = null;
		this.parent = null;
	}
}

// BST.HIGHLIGHT_LABEL_COLOR = '#FF0000';
// BST.HIGHLIGHT_LINK_COLOR = '#FF0000';

BST.HIGHLIGHT_COLOR = '#007400';
BST.HEIGHT_LABEL_COLOR = '#007400';

BST.LINK_COLOR = '#FFFFFF';
BST.HIGHLIGHT_CIRCLE_COLOR = '#007400';
BST.FOREGROUND_COLOR = '#000000';
BST.BACKGROUND_COLOR = '#FFFFFF';
BST.PRINT_COLOR = '#007400';

BST.WIDTH_DELTA = 50;
BST.HEIGHT_DELTA = 50;
BST.STARTING_Y = 50;

BST.FIRST_PRINT_POS_X = 50;
BST.PRINT_VERTICAL_GAP = 20;
BST.PRINT_HORIZONTAL_GAP = 50;
BST.EXPLANITORY_TEXT_X = 10;
BST.EXPLANITORY_TEXT_Y = 10;
