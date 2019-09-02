'strict mode'

import * as THREE from 'three';
import { CollisionEngine } from './CollisionEngine.js'

export class Transformer {

    constructor(camera, colliders) {
        this.collisionEngine = new CollisionEngine();
        this.camera = camera;
        this.colliders = colliders;
        this.oldPos = null;
    }


    translate(object, e) {
        let mousePos = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
        let pos = this.getMousePositionInScene(mousePos);

        if (!this.oldPos) {
            this.oldPos = pos;
        }
        let deltaMove = {
            x: this.oldPos.x - pos.x,
            y: this.oldPos.y - pos.y,
        };
        object.position.x -= deltaMove.x;
        object.position.y -= deltaMove.y;
        if (this.collisionEngine.checkCollisions(object, this.colliders, deltaMove)) {

            deltaMove.x = object.position.x - pos.x;
            deltaMove.y = object.position.y - pos.y;

            object.position.x -= deltaMove.x;
            object.position.y -= deltaMove.y;
            this.collisionEngine.checkCollisions(object, this.colliders, deltaMove);
        }
        this.oldPos = pos;
    }

    getMousePositionInScene(mousePos) {
        let vector = new THREE.Vector3(mousePos.x, mousePos.y, 0);
        vector.unproject(this.camera);
        let dir = vector.sub(this.camera.position).normalize();
        let distance = - this.camera.position.z / dir.z;
        let pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        return pos;
    }

    reset() {
        this.oldPos = null;
    }

}

export default function () { }
