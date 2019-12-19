/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { InputMouseToScene } from './threejs-input-mouse2scene/src/InputMouseToScene';
import { Selection } from './threejs-raycast-selection/src/Selection';
import { CollisionEngine } from './threejs-aabb-collision-engine/CollisionEngine';
import { Scene, Group } from 'three';

export class Object3dInteraction {

	constructor(scene3d) {
		this.scene3d = scene3d;
		this._setCollisionEngine();
		this.selection = new Selection(scene3d.camera);
		this._setControls();
	}

	update() {
		this.controls.update();
	}

	_setControls() {
		this.controls = new OrbitControls(this.scene3d.camera, this.scene3d.renderer.domElement);
		this.inputMouse = new InputMouseToScene(this.scene3d.container, this.scene3d.camera);
		this.inputMouse.subscribe('m2sMouseDown', (params) => {
			this._mouseDown(params);
		});
		this.inputMouse.subscribe('m2sMouseUp', (params) => {
			this._mouseUp(params);
		});
		this.inputMouse.subscribe('m2sMouseMove', (params) => {
			this._mouseMove(params);
		});
		this.controls.update();
		this.oldMousePos = null;
	}

	_setCollisionEngine() {
		let collisionEngineParams = {
			camera: this.scene3d.camera,
			trackAfterCollision: true,
			snapToBounds: true,
			snapDistance: 1,
			resetCallback: () => {
				this._onEngineReset();
			}
		};
		this.collisionEngine = new CollisionEngine(collisionEngineParams);
	}

	_mouseDown(params) {
		this.selectedCube = this._getRootParent(this.selection.selectElement(params.mouseNormalized, this.collisionEngine.getMeshColliders()));
		if (this.selectedCube) {
			this.controls.enabled = false;
		}
	}

	_mouseUp(params) {
		this.selectedCube = null;
		this.controls.enabled = true;
		this.collisionEngine.reset();
		this.oldMousePos = null;
	}

	_mouseMove(params) {
		if (this.selectedCube) {
			if (!this.oldMousePos) {
				this.oldMousePos = params.mousePosInScene;
			}
			let deltaMove = {
				x: this.oldMousePos.x - params.mousePosInScene.x,
				y: this.oldMousePos.y - params.mousePosInScene.y
			};
			this.collisionEngine.translate(this.selectedCube, 0, deltaMove.x);
			this.collisionEngine.translate(this.selectedCube, 1, deltaMove.y);
			this.oldMousePos = params.mousePosInScene;
		}
	}

	_getRootParent(selectedObject) {
		if (selectedObject && selectedObject.parent && !(selectedObject.parent instanceof Scene)) {
			let parent = selectedObject.parent;
			let root = false;
			while (!root && parent instanceof Group) {
				if (parent.parent instanceof Group) {
					parent = parent.parent;
				} else {
					root = true;
				}
			}
			return parent;
		}
		return selectedObject;
	}
}