/* eslint-disable no-unused-vars */
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Scene, WebGLRenderer, PerspectiveCamera, GridHelper, Mesh, BoxGeometry, MeshBasicMaterial, Group } from 'three';
import { InputMouseToScene } from './Input/InputMouseToScene';
import { Selection } from './Selection/Selection';
import { CollisionEngine } from './CollisionEngine/CollisionEngine';

'use strict';

class Mediator {

	constructor() {
		// dom
		this.container = document.createElement('div');
		this.stats = new Stats();
		this.container.appendChild(this.stats.dom);
		document.body.appendChild(this.container);
		// renderer
		this.renderer = new WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.container.appendChild(this.renderer.domElement);
		// scene
		this.scene = new Scene();
		// camera
		this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.set(0, 10, 80);
		//controls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.inputMouse = new InputMouseToScene(this.container, this.camera, [this]);
		//controls.update() must be called after any manual changes to the camera's transform
		this.controls.update();
		this.oldMousePos = null;
		let collisionEngineParams = {
			camera: this.camera,
			trackAfterCollision: true,
			snapDistance: 1,
			resetCallback: () => { this._onEngineReset(); }
		};
		this.collisionEngine = new CollisionEngine(collisionEngineParams);
		this.selection = new Selection(this.camera);
		this.addElements();
	}

	mouseDown(mousePosScene, mousePosNormalized) {
		this.selectedCube = this.selection.selectElement(mousePosNormalized, this.collisionEngine.getMeshColliders());
		if (this.selectedCube) {
			this.controls.enabled = false;
		}
	}

	mouseUp(mousePosScene, mousePosNormalized) {
		this.selectedCube = null;
		this.controls.enabled = true;
		this.collisionEngine.reset();
		this.oldMousePos = null;
	}

	mouseMove(mousePosScene, mousePosNormalized) {
		if (this.selectedCube) {
			if (!this.oldMousePos) {
				this.oldMousePos = mousePosScene;
			}
			let deltaMove = {
				x: this.oldMousePos.x - mousePosScene.x,
				y: this.oldMousePos.y - mousePosScene.y,
			};
			this.collisionEngine.translate(this.selectedCube, 0, deltaMove.x);
			this.collisionEngine.translate(this.selectedCube, 1, deltaMove.y);
			this.oldMousePos = mousePosScene;
		}
	}

	addElements() {
		// let cubeA = this.createCube(10, 5, 5, 0x00ffff);
		// let cubeB = this.createCube(5, 5, 5, 0x00ffff);
		// cubeB.position.set(-2.5, 5, 0);
		// var group = new Group();
		// group.add(cubeA);
		// group.add(cubeB);
		// group.name = 'tetris';
		// group.position.set(-20, 2.5, 0);
		// this.collisionEngine.addCollider(group);
		// this.scene.add(group);
		// for (let indexX = 0; indexX < 50; indexX++) {
		// 	for (let indexY = 0; indexY < 50; indexY++) {//Math.random() * 
		// 		let cube = this.createCube(5, 5, 5, 0x00ff00);
		// 		cube.position.set((indexX * 5.01), (indexY * 5.01 + 2.5), 0);
		// 		cube.name = `cube_${indexX}_${indexY}`;
		// 		this.scene.add(cube);
		// 		this.transformer.addCollider(cube);
		// 	}
		// }


		let cube = this.createCube(15, 5, 5, Math.random() * 0xffffff);
		cube.position.set(0, 7.51, 0);
		cube.name = 'cube_0';
		this.scene.add(cube);
		this.collisionEngine.addCollider(cube);

		let cube1 = this.createCube(15, 5, 5, Math.random() * 0xffffff);
		cube1.position.set(0, 2.51, 0);
		cube1.name = 'cube_1';
		this.scene.add(cube1);
		this.collisionEngine.addCollider(cube1);

		let cube2 = this.createCube(15, 5, 5, Math.random() * 0xffffff);
		cube2.position.set(0, 30, 0);
		cube2.name = 'cube_2';
		this.scene.add(cube2);
		this.collisionEngine.addCollider(cube2);

		var geometry = new BoxGeometry(25, 25, 25);
		var material = new MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 });
		var parentCube2 = new Mesh(geometry, material);
		parentCube2.position.set(0, 12.5, 0);
		parentCube2.name = 'parent';
		this.scene.add(parentCube2);
		this.collisionEngine.addCollider(parentCube2);

		parentCube2.userData.transformData.addChild(cube);
		parentCube2.userData.transformData.addChild(cube1);
		// parentCube2.userData.transformData.selectable = false;

		let cube3 = this.createCube(15, 5, 5, Math.random() * 0xffffff);
		cube3.position.set(25, 7.51, 0);
		cube3.name = 'cube3';
		this.scene.add(cube3);
		this.collisionEngine.addCollider(cube3);

		let cube4 = this.createCube(15, 5, 5, Math.random() * 0xffffff);
		cube4.position.set(25, 2.51, 0);
		cube4.name = 'cube4';
		this.scene.add(cube4);
		this.collisionEngine.addCollider(cube4);

		var parentCube3 = new Mesh(geometry, material);
		parentCube3.position.set(25.01, 12.5, 0);
		parentCube3.name = 'parentCube3';
		this.scene.add(parentCube3);
		this.collisionEngine.addCollider(parentCube3);

		parentCube3.userData.transformData.addChild(cube3);
		parentCube3.userData.transformData.addChild(cube4);

		var size = 100;
		var divisions = 100;
		var gridHelper = new GridHelper(size, divisions);
		//this.collisionEngine.addCollider(gridHelper);
		//gridHelper.userData.transformData.selectable = false;
		this.scene.add(gridHelper);

	}
	_onEngineReset() {
		this.selectedCube = null;
	}

	createCube(width, height, depth, color) {
		var geometry = new BoxGeometry(width, height, depth);
		var material = new MeshBasicMaterial({ color: color });
		var cube = new Mesh(geometry, material);
		return cube;
	}

}

function render() {
	mediator.renderer.render(mediator.scene, mediator.camera);
}

function animate() {
	requestAnimationFrame(animate);
	mediator.controls.update();
	render();
	mediator.stats.update();
}

function onWindowResize() {
	mediator.camera.aspect = window.innerWidth / window.innerHeight;
	mediator.camera.updateProjectionMatrix();
	mediator.renderer.setSize(window.innerWidth, window.innerHeight);
}

var mediator = new Mediator();
window.addEventListener('resize', onWindowResize, false);
animate();