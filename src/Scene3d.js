/* eslint-disable no-unused-vars */

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Scene, WebGLRenderer, PerspectiveCamera, GridHelper, Mesh, BoxGeometry, MeshBasicMaterial, OrthographicCamera, AmbientLight, DirectionalLight } from 'three';
import { Object3dInteraction } from './Object3dInteraction';

export class Scene3d {

	constructor(containerId) {
		this.container = document.getElementById(containerId);
		this._setRenderer();
		this.scene = new Scene();
		this._setCamera();
		this._setInteraction();
		this._addElements();
		this._addLights();
		this.stats = new Stats();
		this.container.appendChild(this.stats.dom);
	}

	animate() {
		this.object3dInteraction.update();
		this.stats.update();
		this.renderer.render(this.scene, this.camera);
	}

	_onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	_setRenderer() {
		this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.container.appendChild(this.renderer.domElement);
	}

	_setCamera() {

		var wid = window.innerWidth;
		var hei = window.innerHeight;
		let frustum = 1;
		var aspect = wid / hei;
		//this.camera = new OrthographicCamera(frustum * aspect / -2, frustum * aspect / 2, frustum / 2, frustum / -2, 0.5, 100);
		
		this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.scene.add(this.camera);
		this.camera.position.set(0, 0, 5);
	}

	_setInteraction() {
		this.object3dInteraction = new Object3dInteraction(this);
	}

	_addElements() {
		var size = 100;
		var divisions = 100;
		var gridHelper = new GridHelper(size, divisions);
		gridHelper.name = 'grid';
		this.object3dInteraction.collisionEngine.addCollider(gridHelper);
		gridHelper.userData.transformData.selectable = false;
		this.scene.add(gridHelper);
	}

	_addLights() {
		var light = new AmbientLight(0x404040); // soft white light
		this.scene.add(light);
		// White directional light at half intensity shining from the top.
		var directionalLight = new DirectionalLight(0xffffff, 1.5);
		directionalLight.position.set(10, 10, 10);
		this.scene.add(directionalLight);
	}

	_onEngineReset() {
		this.selectedCube = null;
	}
}