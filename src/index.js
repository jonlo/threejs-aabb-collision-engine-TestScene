import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {CollisionRaycaster} from './Raycasting.js';
import {Transformer} from './Transformer.js';

'use strict';

var container,
    camera,
    scene,
    renderer,
    controls,
    selectedCube;

var colliders = [];
var raycast = new CollisionRaycaster();
var transformer;
main();

function main() {

    initScene();
}

function initScene() {
    // dom
    container = document.createElement('div');
    window.addEventListener('resize', onWindowResize, false);
    container.addEventListener('mousedown', mouseDown);
    container.addEventListener('mousemove', mouseMove);
    container.addEventListener('mouseup', mouseUp);
    document.body.appendChild(container);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();
    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(10, 10, 15);

    transformer = new Transformer(camera,colliders);
    //controls
    controls = new OrbitControls(camera, renderer.domElement);
    //controls.update() must be called after any manual changes to the camera's transform
    controls.update();

    colliders.push(createCube(5,5, 5, 0xffff00));


    for (var index = 0; index < 5; index++) {
        colliders.push(createCube(0.5, 10, 1, 0x00ff00));
        colliders[index+1].position.set(index*5, 0, 0);
    }

};

function createCube(width, height, depth, color) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshBasicMaterial({ color: color });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    return cube;
}

function render() {
    renderer.render(scene, camera);
}

// animate            
(function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();

}());

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function mouseDown(e) {
    var mousePos = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
    var intersects = raycast.raycastHits(camera, mousePos, colliders);
    if (intersects.length > 0) {
        selectedCube = intersects[0].object;
        controls.enabled = false;
    }
}

function mouseUp(e) {
    if (selectedCube) {
        selectedCube = null;
        controls.enabled = true;
        transformer.reset();
    }
}

function mouseMove(e) {
    if (selectedCube) {
        transformer.translate(selectedCube, e);
    }
}

