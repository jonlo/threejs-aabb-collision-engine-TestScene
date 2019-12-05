'strict mode'

import { Vector3 } from 'three';
import { Collisions } from './Collisions.js'

class Transformer {

    constructor(params) {
        this.trackAfterCollision = params.trackAfterCollision === undefined ? true : params.trackAfterCollision;
        this.snap = params.snap === undefined ? new Vector3(0, 0, 0) : params.snap;
        this.margin = params.margin === undefined ? new Vector3(0, 0, 0) : params.margin;
        this.camera = params.camera;
        this.collisionEngine = new Collisions();
        this.realPosition = null;
    }

    translate(object, axis, deltaMove) {
        if (!this.realPosition) {
            this.realPosition = object.position.clone();
        }
        let margin = object.userData.margin ? object.userData.margin.getComponent(axis): new Vector3(0,0,0);
        let snap = object.userData.snap ? object.userData.snap.getComponent(axis): new Vector3(0,0,0);

        object.position.setComponent(axis, object.position.getComponent(axis) - deltaMove);
        this.realPosition.setComponent(axis, this.realPosition.getComponent(axis) - deltaMove);
        object.updateMatrixWorld();
        if (this.collisionEngine.checkCollisions(object)) {
            object.position.setComponent(axis, object.position.getComponent(axis) + deltaMove);
            this.collisionEngine.updateCollisionBox(object);
            if (this.trackAfterCollision) {
                this._tryToRelocateObject(object, axis);
            }
        } else {
            this.realPosition.setComponent(axis, object.position.getComponent(axis));
        }
    }

    reset() {
        this.realPosition = null;
    }

    _tryToRelocateObject(object, axis) {
        let currentPos = new Vector3().copy(object.position);
        object.position.setComponent(axis, this.realPosition.getComponent(axis));
        object.updateMatrixWorld();
        if (this.collisionEngine.checkCollisions(object)) {
            object.position.copy(currentPos);
            object.updateMatrixWorld();
            this.collisionEngine.updateCollisionBox(object);
        };
    }

}

export { Transformer }
