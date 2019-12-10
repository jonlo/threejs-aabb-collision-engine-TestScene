import { Box3 } from 'three';

class TransformData {

    constructor() {
        this.margin = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            front: 0,
            back: 0
        };
        this.restrictions = {
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
        };
        this.padding = null;
        this.box = null;
        this.colliders = [];
        this.ischild = false;
    }

    setAsChild() {
        this.colliders = null;
        this.margin = null;
        this.restrictions = null;
        this.ischild = true;
    }

    setParent(parent) {
        this.parent = parent;
    }

    getParent() {
        return this.parent;
    }

    setBox(collider) {
        this.box = new Box3().setFromObject(collider);
    }

}

export { TransformData };