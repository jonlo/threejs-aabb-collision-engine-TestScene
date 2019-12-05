import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CollisionRaycaster } from './Raycasting.js';
import { Transformer } from './CollisionEngine/Transformer.js';

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

    transformer = new Transformer(camera);
    //controls
    controls = new OrbitControls(camera, renderer.domElement);
    //controls.update() must be called after any manual changes to the camera's transform
    controls.update();

    var size = 100;
    var divisions = 100;

    var gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    let cubeA = createCube(10, 5, 5, 0x00ffff);
    cubeA.name = "cubeA";
    let cubeB = createCube(5, 5, 5, 0x00ffff);
    cubeB.position.set(-2.5, 5, 0);
    cubeB.name = "cubeB";
    var group = new THREE.Group();
    group.add(cubeA);
    group.add(cubeB);
    group.name = "tetris";
    transformer.collisionEngine.addCollider(group);
   
    scene.add(group);
    
    // for (var index = 0; index < 5; index++) {
    //     let cube = createCube((index + 1) * 5, 5, 5, Math.random() * 0xffffff);
    //     colliders.push(cube);
    //     colliders[index].position.set(index * 5, 2.5, 0);
    //     scene.add(cube);
    // }

    let cube = createCube(5, 5, 5, Math.random() * 0xffffff);
    
    cube.position.set(15, 2.5, 0);
    scene.add(cube);
    transformer.collisionEngine.addCollider(cube);
    cube.name = "cube 1";
    let cube2 = createCube(5, 5, 5, Math.random() * 0xff00ff);
    cube2.position.set(20, 2.5, 0);
    cube.name = "cube 2";
    transformer.collisionEngine.addCollider(cube2);
    scene.add(cube2);
};

function createCube(width, height, depth, color) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshBasicMaterial({ color: color });
    var cube = new THREE.Mesh(geometry, material);

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
    var intersects = raycast.raycastHits(camera, mousePos, transformer.collisionEngine.colliders);
    if (intersects.length > 0) {
        if (!(intersects[0].object.parent instanceof THREE.Scene)) {
            selectedCube = intersects[0].object.parent;
        } else {
            selectedCube = intersects[0].object;
        }
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