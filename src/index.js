import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { InputMouse } from './Input/InputMouse'
import { Vector3 } from 'three';
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
    group.userData.transform = {
        margin: null,
        restrictions: {
            position: {
                x: NaN,
                y: NaN,
                z: NaN
            },
            rotation: {
                x: NaN,
                y: NaN,
                z: NaN
            },
            scale: {
                x: NaN,
                y: NaN,
                z: NaN
            }
        },
        padding: null,
    }

    group.userData.transform.margin = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        front: 0,
        back: 0
    };

    for (let indexX = 0; indexX < 50; indexX++) {
        for (let indexY = 0; indexY < 50; indexY++) {//Math.random() * 
            let cube = createCube(5, 5, 5, 0x00ff00);
            cube.position.set((indexX * 5.01), (indexY * 5.01 + 2.5), 0);

            cube.userData.transform = {
                margin: null,
                restrictions: {
                    position: {
                        x: NaN,
                        y: NaN,
                        z: NaN
                    },
                    rotation: {
                        x: NaN,
                        y: NaN,
                        z: NaN
                    },
                    scale: {
                        x: NaN,
                        y: NaN,
                        z: NaN
                    }
                },
                padding: null,
            }

            cube.userData.transform.margin = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                front: 0,
                back: 0
            };
            cube.name = `cube_${indexX}_${indexY}`;
            scene.add(cube);
            inputMouse.transformer.collisionEngine.addCollider(cube);
        }
    }
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