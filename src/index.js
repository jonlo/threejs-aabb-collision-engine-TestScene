import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { InputMouseToScene } from './Input/InputMouseToScene'
import { TransformData } from './CollisionEngine/TransformData'
import { Scene, WebGLRenderer, PerspectiveCamera, GridHelper, Raycaster, Group, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
import { Transformer } from './CollisionEngine/Transformer.js';

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
        this.camera.position.set(10, 10, 15);
        //controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.inputMouse = new InputMouseToScene(this.container, this.camera, [this])
        //controls.update() must be called after any manual changes to the camera's transform
        this.controls.update();
        this.raycaster = new Raycaster();
        this.oldMousePos = null;
        this.raycast = new Raycaster();
        let transformerParams = {
            camera: this.camera,
            trackAfterCollision: true,
            snapDistance: 1
        };
        this.transformer = new Transformer(transformerParams);
        var size = 100;
        var divisions = 100;
        var gridHelper = new GridHelper(size, divisions);
        this.scene.add(gridHelper);
        this.addElements();
    }

    mouseDown(mousePosScene, mousePosNormalized) {
        var intersects = this._raycastHits(this.camera, mousePosNormalized, this.transformer.collisionEngine.meshColliders);
        if (intersects.length > 0) {
            if (!(intersects[0].object.parent instanceof Scene)) {
                this.selectedCube = intersects[0].object.parent;
            } else {
                this.selectedCube = intersects[0].object;
            }
            let firstChild = intersects.find(intersect => intersect.object.userData.transformData.isChild());
            if (firstChild) {
                this.selectedCube = firstChild.object;
            }
            this.controls.enabled = false;
        }
    }

    mouseUp(mousePosScene, mousePosNormalized) {
        if (this.selectedCube) {
            this.selectedCube = null;
            this.controls.enabled = true;
            this.transformer.reset();
            this.oldMousePos = null;
        }
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
            this.transformer.translate(this.selectedCube, 0, deltaMove.x);
            this.transformer.translate(this.selectedCube, 1, deltaMove.y);
            this.oldMousePos = mousePosScene;
        }
    }


    _raycastHits(camera, mousePos, colliders) {
        this.raycaster.setFromCamera(mousePos, camera);
        let intersects = this.raycaster.intersectObjects(colliders.filter(element => element.userData.transformData.selectable));
        return intersects;
    }


    addElements() {
        let cubeA = this.createCube(10, 5, 5, 0x00ffff);
        let cubeB = this.createCube(5, 5, 5, 0x00ffff);
        cubeB.position.set(-2.5, 5, 0);
        var group = new Group();
        group.add(cubeA);
        group.add(cubeB);
        group.name = "tetris";
        group.position.set(-10, 2.5, 0);
        this.transformer.collisionEngine.addCollider(group);
        this.scene.add(group);
        // for (let indexX = 0; indexX < 5; indexX++) {
        //     for (let indexY = 0; indexY < 5; indexY++) {//Math.random() * 
        //         let cube = createCube(5, 5, 5, 0x00ff00);
        //         cube.position.set((indexX * 5.01), (indexY * 5.01 + 2.5), 0);
        //         cube.name = `cube_${indexX}_${indexY}`;
        //         scene.add(cube);
        //         inputMouse.transformer.collisionEngine.addCollider(cube);
        //     }
        // }


        let cube = this.createCube(5, 5, 5, Math.random() * 0xffffff);
        cube.position.set((0 * 5.01), (0 * 5.01 + 2.5), 0);
        cube.name = `cube_0`;
        this.scene.add(cube);
        this.transformer.collisionEngine.addCollider(cube);

        let cube1 = this.createCube(5, 5, 5, Math.random() * 0xffffff);
        cube1.position.set((1 * 5.01), (1 * 5.01 + 2.5), 0);
        cube1.name = `cube_1`;
        this.scene.add(cube1);
        this.transformer.collisionEngine.addCollider(cube1);

        var geometry = new BoxGeometry(25, 25, 25);
        var material = new MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 });
        var parentCube2 = new Mesh(geometry, material);
        parentCube2.position.set(0, 0, 0);
        parentCube2.name = `parent`;
        this.scene.add(parentCube2);
        this.transformer.collisionEngine.addCollider(parentCube2);

        parentCube2.userData.transformData.addChild(cube);
        parentCube2.userData.transformData.addChild(cube1);
        // parentCube2.userData.transformData.selectable = false;

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
};

function onWindowResize() {
    mediator.camera.aspect = window.innerWidth / window.innerHeight;
    mediator.camera.updateProjectionMatrix();
    mediator.renderer.setSize(window.innerWidth, window.innerHeight);
}


var mediator = new Mediator();
window.addEventListener('resize', onWindowResize, false);
animate();