'strict mode'

import { Scene, Vector2, Vector3, Raycaster } from 'three';
import { Transformer } from '../CollisionEngine/Transformer.js';

class InputMouse {

    constructor(container, camera, controls) {
        this.raycaster = new Raycaster();
        this.oldMousePos = null;
        this.raycast = new Raycaster();
        let transformerParams = {
            camera: camera,
            trackAfterCollision: true,
            snapDistance: 1
        };
        this.transformer = new Transformer(transformerParams);
        this.controls = controls;
        this.camera = camera;
        container.addEventListener('mousedown', (e) => { this._mouseDown(e) });
        container.addEventListener('mousemove', (e) => { this._mouseMove(e) });
        container.addEventListener('mouseup', (e) => { this._mouseUp(e) });
    }

    _mouseDown(e) {
        var mousePos = new Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
        var intersects = this._raycastHits(this.camera, mousePos, this.transformer.collisionEngine.meshColliders);
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

    _mouseUp(e) {
        if (this.selectedCube) {
            this.selectedCube = null;
            this.controls.enabled = true;
            this.transformer.reset();
            this.oldMousePos = null;
        }
    }

    _mouseMove(e) {
        if (this.selectedCube) {
            let mouse = new Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
            let mousePos = this._getMousePositionInScene(mouse);
            if (!this.oldMousePos) {
                this.oldMousePos = mousePos;
            }
            let deltaMove = {
                x: this.oldMousePos.x - mousePos.x,
                y: this.oldMousePos.y - mousePos.y,
            };
            this.transformer.translate(this.selectedCube, 0, deltaMove.x);
            this.transformer.translate(this.selectedCube, 1, deltaMove.y);
            this.oldMousePos = mousePos;
        }
    }

    _raycastHits(camera, mousePos, colliders) {
        this.raycaster.setFromCamera(mousePos, camera);
        let intersects = this.raycaster.intersectObjects(colliders.filter(element => element.userData.transformData.selectable));
        return intersects;
    }

    _getMousePositionInScene(mousePos) {
        let vector = new Vector3(mousePos.x, mousePos.y, 0);
        vector.unproject(this.camera);
        let dir = vector.sub(this.camera.position).normalize();
        let distance = - this.camera.position.z / dir.z;
        let pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        return pos;
    }

}

export { InputMouse }