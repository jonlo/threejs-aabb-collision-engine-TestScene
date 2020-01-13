/* eslint-disable no-unused-vars */
import { Environment3d } from './Environment3d';
import { Loader } from './Loader';
import { Scene3d } from './Scene3d';
import { Box3 } from 'three';

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
	var bbox = new Box3().setFromObject(object);

	let objectWidth = (bbox.max.getComponent(2) - bbox.min.getComponent(2)) / 2;
	object.position.setComponent(2, -objectWidth );
	let objectHeight = (bbox.max.getComponent(1) - bbox.min.getComponent(1)) / 2;
	object.position.setComponent(1, objectHeight );
	environment3d.scene3d.object3dInteraction.collisionEngine.addCollider(object);
	environment3d.scene3d.object3dInteraction.selection.addSelectableObject(object);
	
}