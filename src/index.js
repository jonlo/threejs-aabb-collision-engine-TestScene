/* eslint-disable no-unused-vars */
import { Environment3d } from './Environment3d';
import { Loader } from './Loader';
import { Scene3d } from './Scene3d';
import { Mesh } from 'three';

'use strict';
init3dEnvironment();
var environment3d;
var objLoader = new Loader();

function init3dEnvironment() {
	let container = document.createElement('div');
	container.id = 'design3dContainer';
	document.body.appendChild(container);

	environment3d = new Environment3d(new Scene3d('design3dContainer'));
	document.addEventListener('dragover', function (event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';

	}, false);
	document.addEventListener('drop', function (event) {
		event.preventDefault();
		objLoader.loadFiles(event.dataTransfer.files, onLoad);

	}, false);
}

function onLoad(object) {
	environment3d.scene3d.scene.add(object);
	environment3d.scene3d.object3dInteraction.collisionEngine.addCollider(object);
	//    object.traverse((mesh) => {
	//        if (mesh instanceof Mesh) {
	//        }
	//    });
}