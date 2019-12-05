'strict mode'

import { Vector3 } from 'three';
import { Collisions } from './Collisions.js'

class Transformer {

    constructor(camera, trackAfterCollision = true) {
        this.trackAfterCollision = trackAfterCollision;
        this.collisionEngine = new Collisions();
        this.camera = camera;
        this.realPosition = null;
    }

    translate(object, axis, deltaMove) {
        if (!this.realPosition) {
            this.realPosition = object.position.clone();
        }
        object.position.setComponent(axis, object.position.getComponent(axis) - deltaMove);
        this.realPosition.setComponent(axis, this.realPosition.getComponent(axis) - deltaMove);
        object.updateMatrixWorld();
        if (this.collisionEngine.checkCollisions(object)) {
            object.position.setComponent(axis, object.position.getComponent(axis) + deltaMove);
            this.collisionEngine.updateCollisionBox(object);
            if (this.trackAfterCollision) {
                this._tryToRelocateObject(object,axis);
            }
        } else {
            this.realPosition.setComponent(axis, object.position.getComponent(axis));
        }
    }

    reset() {
        this.realPosition = null;
    }

    _tryToRelocateObject(object,axis) {
        let currentPos = new Vector3().copy(object.position);
        object.position.setComponent(axis, this.realPosition.getComponent(axis));
        object.updateMatrixWorld();
        if (this.collisionEngine.checkCollisions(object)) {
            object.position.copy(currentPos);
            this.collisionEngine.updateCollisionBox(object);
        };
    }

}

export { Transformer }
