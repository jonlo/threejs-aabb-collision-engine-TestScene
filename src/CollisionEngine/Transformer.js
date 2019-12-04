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

        this.translateAxis(0, object, deltaMove.x);
        this.translateAxis(1, object, deltaMove.y);
        
        this.oldMousePos = mousePos;
    }


    translateAxis(axis, object, deltaMove) {
        object.position.setComponent(axis,object.position.getComponent(axis)-deltaMove);
        this.realPosition.setComponent(axis,this.realPosition.getComponent(axis)-deltaMove);

        if (this.collisionEngine.checkCollisions(object, this.colliders)) {
            object.position.setComponent(axis,object.position.getComponent(axis)+deltaMove);
            let currentPos = new Vector3().copy(object.position);
            object.position.setComponent(axis,this.realPosition.getComponent(axis));
            if (this.collisionEngine.checkCollisions(object, this.colliders)) {
                object.position.copy(currentPos);
            };
        } else {
            this.realPosition.setComponent(axis, object.position.getComponent(axis));
        }
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