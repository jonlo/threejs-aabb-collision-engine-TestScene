/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { InputMouseToScene } from './threejs-input-mouse2scene/src/InputMouseToScene';
import { Selection } from './threejs-raycast-selection/src/Selection';
import { CollisionEngine } from './threejs-aabb-collision-engine/CollisionEngine';

export class Object3dInteraction {

	constructor(scene3d) {
		this.scene3d = scene3d;
		this._setCollisionEngine();
		this.selection = new Selection(scene3d.camera);
		this._setInputMouse();
		this._setControls();
	}

	update() {
		this.controls.update();
	}

	_setInputMouse() {
		this.inputMouse = new InputMouseToScene(this.scene3d.container, this.scene3d.camera, this.scene3d.scene);
		this.inputMouse.subscribe('m2sMouseDown', (params) => {
			this._mouseDown(params);
		});
		this.inputMouse.subscribe('m2sMouseUp', (params) => {
			this._mouseUp(params);
		});
		this.inputMouse.subscribe('m2sMouseMove', (params) => {
			this._mouseMove(params);
		});
	}

	_setControls() {
		this.controls = new OrbitControls(this.scene3d.camera, this.scene3d.renderer.domElement);
		//this.controls.enableRotate = false;

		this.controls.update();
		this.oldMousePos = null;
	}

	_setCollisionEngine() {
		let collisionEngineParams = {
			camera: this.scene3d.camera,
			trackAfterCollision: true,
			snapToBounds: false,
			snapDistance: 0.05,
			// resetCallback: () => {
			// 	this._onEngineReset();
			// }
		};
		this.collisionEngine = new CollisionEngine(collisionEngineParams);
	}

	_mouseDown(params) {
		this.selectedCube = this.selection.selectElement(params.mouseNormalized);
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
				x: (params.mousePosInScene.x - this.oldMousePos.x),
				y: (params.mousePosInScene.y - this.oldMousePos.y),
				z: (params.mousePosInScene.z - this.oldMousePos.z)
			};
			this.collisionEngine.translate(this.selectedCube, 0, deltaMove.x);
			this.collisionEngine.translate(this.selectedCube, 1, deltaMove.y);
			this.collisionEngine.translate(this.selectedCube, 2, deltaMove.z);
			this.oldMousePos = params.mousePosInScene;
		}
	}

}