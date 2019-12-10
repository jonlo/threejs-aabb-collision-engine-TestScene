'strict mode'

import { Vector3, Group } from 'three';
import { Collisions } from './Collisions.js'
import { restrict } from './Restrictions'
import { snap } from './Snap'
import { TransformData } from './TransformData.js';

class Transformer {

    constructor(params) {
        this.trackAfterCollision = params.trackAfterCollision === undefined ? true : params.trackAfterCollision;
        this.snapDistance = params.snapDistance === undefined ? 0 : params.snapDistance;
        this.camera = params.camera;
        this.collisionEngine = new Collisions();
        this.realPosition = null;
        this.collisionsEnabled = true;
    }

    translate(object, axis, deltaMove) {
        this._checkTransformData(object);
        if (!this.realPosition) {
            this.realPosition = object.position.clone();
        }
        let snapped = false;
        if (this.snapDistance > 0) {
            snapped = snap(object, this.collisionEngine.getClosestElement(object), axis, deltaMove, this.snapDistance) === axis;
        }

        object.updateMatrixWorld();
        if (!snapped) {
            object.position.setComponent(axis, object.position.getComponent(axis) - deltaMove);
            object.updateMatrixWorld();
            this.realPosition.setComponent(axis, this.realPosition.getComponent(axis) - deltaMove);
        }
        if (this.collisionsEnabled) {
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
        restrict(object, axis);
    }

    reset() {
        this.realPosition = null;
    }

    _checkTransformData(object) {
        if (!object.userData.transformData) {
            object.userData.transformData = new TransformData();
        }
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
