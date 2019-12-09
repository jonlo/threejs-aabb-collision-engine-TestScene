'strict mode'

import { Vector3 } from 'three';
import { Collisions } from './Collisions.js'

const snapScape = 0.3;
const snapMargin = 0.025;

class Transformer {

    constructor(params) {
        this.trackAfterCollision = params.trackAfterCollision === undefined ? true : params.trackAfterCollision;
        this.snapDistance = params.snapDistance === undefined ? 0 : params.snapDistance;
        this.camera = params.camera;
        this.collisionEngine = new Collisions();
        this.realPosition = null;
    }

    translate(object, axis, deltaMove) {
        if (!this.realPosition) {
            this.realPosition = object.position.clone();
        }
        let snapped = this._snap(object, axis, deltaMove) === axis;
        object.updateMatrixWorld();
        if (!snapped) {
            object.position.setComponent(axis, object.position.getComponent(axis) - deltaMove);
            object.updateMatrixWorld();
            this.realPosition.setComponent(axis, this.realPosition.getComponent(axis) - deltaMove);
        }

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
        this.snapped = [false, false, false];
        this.realPosition = null;
    }

    _snap(object, movingAxis, deltaMove) {
        if (this.snapDistance > 0) {
            let closest = this.collisionEngine.getClosestElement(object);
            let distance = closest.distances.reduce(function (prev, curr) {
                return (Math.abs(curr - 0) < Math.abs(prev - 0 && curr > 0) ? curr : prev);
            });
            let axis = closest.distances.indexOf(distance);
            let dir = deltaMove < 0 ? -1 : 1;
            let correctDistances = closest.distances.filter(d => d < this.snapDistance).length;
            if (correctDistances > 2 && distance >= snapScape) {
                if (movingAxis === axis) {
                    object.position.setComponent(axis, object.position.getComponent(axis) - (distance - snapMargin) * dir);
                    return movingAxis;
                }
            }
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
