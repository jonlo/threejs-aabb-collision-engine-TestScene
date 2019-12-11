import { Box3 } from 'three';

class TransformData {

    constructor(element) {
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
        this.children = [];
        this.ischild = false;
        this.element = element;
    }

    setAsGroupChild() {
        this.colliders = null;
        this.margin = null;
        this.restrictions = null;
        this.ischild = true;
    }

    addChild(child) {
        this.children.push(child);
        child.userData.transformData.parent = this.element;
    }

    removeChild(child) {
        var index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
        child.userData.transformData.parent = child.parent;
    }

    getChildren() {
        return this.children;
    }

    getParent() {
        if (!this.parent) {
            return this.element.parent;
        }
        return this.parent;
    }

    setBox(collider) {
        this.box = new Box3().setFromObject(collider);
    }

    getRestrictions() {
        return this.restrictions;
    }

}

export { TransformData };