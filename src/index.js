import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { InputMouse } from './Input/InputMouse'
import { TransformData } from './CollisionEngine/TransformData'
'use strict';

var container,
    camera,
    scene,
    renderer,
    controls,
    inputMouse,
    stats;

(function initScene() {
    // dom
    container = document.createElement('div');
    stats = new Stats();
    container.appendChild(stats.dom);
    window.addEventListener('resize', onWindowResize, false);
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
    //controls
    controls = new OrbitControls(camera, renderer.domElement);
    inputMouse = new InputMouse(container, camera, controls)
    //controls.update() must be called after any manual changes to the camera's transform
    controls.update();
    var size = 100;
    var divisions = 100;
    var gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
    addElements();
    animate();
})();


function addElements() {
    let cubeA = createCube(10, 5, 5, 0x00ffff);
    let cubeB = createCube(5, 5, 5, 0x00ffff);
    cubeB.position.set(-2.5, 5, 0);
    var group = new THREE.Group();
    group.add(cubeA);
    group.add(cubeB);
    group.name = "tetris";
    group.position.set(-10, 2.5, 0);
    inputMouse.transformer.collisionEngine.addCollider(group);
    scene.add(group);
    // for (let indexX = 0; indexX < 5; indexX++) {
    //     for (let indexY = 0; indexY < 5; indexY++) {//Math.random() * 
    //         let cube = createCube(5, 5, 5, 0x00ff00);
    //         cube.position.set((indexX * 5.01), (indexY * 5.01 + 2.5), 0);
    //         cube.name = `cube_${indexX}_${indexY}`;
    //         scene.add(cube);
    //         inputMouse.transformer.collisionEngine.addCollider(cube);
    //     }
    // }


    let cube = createCube(5, 5, 5, Math.random() * 0xffffff);
    cube.position.set((0 * 5.01), (0 * 5.01 + 2.5), 0);
    cube.name = `cube_0`;
    scene.add(cube);
    inputMouse.transformer.collisionEngine.addCollider(cube);

    let cube1 = createCube(5, 5, 5, Math.random() * 0xffffff);
    cube1.position.set((1 * 5.01), (1 * 5.01 + 2.5), 0);
    cube1.name = `cube_1`;
    scene.add(cube1);
    inputMouse.transformer.collisionEngine.addCollider(cube1);

    var geometry = new THREE.BoxGeometry(25, 25, 25);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 });
    var parentCube2 = new THREE.Mesh(geometry, material);
    parentCube2.position.set(0, 0, 0);
    parentCube2.name = `parent`;
    scene.add(parentCube2);
    inputMouse.transformer.collisionEngine.addCollider(parentCube2);

    parentCube2.userData.transformData.addChild(cube);
    parentCube2.userData.transformData.addChild(cube1);
   // parentCube2.userData.transformData.selectable = false;

}

function createCube(width, height, depth, color) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshBasicMaterial({ color: color });
    var cube = new THREE.Mesh(geometry, material);
    return cube;
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
    stats.update();
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}