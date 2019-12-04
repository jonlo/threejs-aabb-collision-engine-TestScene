'strict mode'

import { Vector2, Vector3 } from 'three';
import { Collisions } from './Collisions.js'

class Transformer {

    constructor(camera, colliders) {
        this.collisionEngine = new Collisions();
        this.camera = camera;
        this.colliders = colliders;
        this.oldMousePos = null;
        this.realPosition = null;
    }

    translate(object, e) {
        let mouse = new Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
        let mousePos = this.getMousePositionInScene(mouse);

        if (!this.oldMousePos) {
            this.oldMousePos = mousePos;
        }
        if (!this.realPosition) {
            this.realPosition = object.position.clone();
        }
        let deltaMove = {
            x: this.oldMousePos.x - mousePos.x,
            y: this.oldMousePos.y - mousePos.y,
        };

        object.position.x -= deltaMove.x;
        this.realPosition.x -= deltaMove.x;

        if (this.collisionEngine.checkCollisions(object, this.colliders)) {
            object.position.x += deltaMove.x;
            let currentPos = new Vector3().copy(object.position);
            object.position.set(this.realPosition.x, object.position.y, object.position.z);
            if (this.collisionEngine.checkCollisions(object, this.colliders)) {
                object.position.set(currentPos.x, currentPos.y, currentPos.z);
            };
        } else {
            this.realPosition.setComponent(0, object.position.x);
        }

        object.position.y -= deltaMove.y;
        this.realPosition.y -= deltaMove.y;
        if (this.collisionEngine.checkCollisions(object, this.colliders)) {
            object.position.y += deltaMove.y;
            let currentPos = new Vector3().copy(object.position);
            object.position.set(object.position.x, this.realPosition.y, object.position.z);
            if (this.collisionEngine.checkCollisions(object, this.colliders)) {
                object.position.set(currentPos.x, currentPos.y, currentPos.z);
            }
        } else {
            this.realPosition.setComponent(1, object.position.y);
        }

        this.oldMousePos = mousePos;
    }

    getMousePositionInScene(mousePos) {
        let vector = new Vector3(mousePos.x, mousePos.y, 0);
        vector.unproject(this.camera);
        let dir = vector.sub(this.camera.position).normalize();
        let distance = - this.camera.position.z / dir.z;
        let pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        return pos;
    }

    reset() {
        this.oldMousePos = null;
        this.realPosition = null;
    }

}

export { Transformer }
