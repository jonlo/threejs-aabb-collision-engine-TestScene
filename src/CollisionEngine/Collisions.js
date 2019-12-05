import { Box3, Group, Mesh } from 'three';

class Collisions {
        constructor() {
                this.colliders = [];
        }

        checkCollisions(selectedObject) {
                this._updateBoxes();
                for (let i = 0; i < this.colliders.length; i++) {
                        let collisionObj = this.colliders[i];
                        if (this.sameObject(selectedObject, collisionObj)) {
                                continue;
                        }

                        if (selectedObject instanceof Group) {
                                for (let j = 0; j < selectedObject.userData.colliders.length; j++) {
                                        if (selectedObject.userData.colliders[j].userData.box.intersectsBox(collisionObj.userData.box)) {
                                                console.log(`collided with ${collisionObj.name}`)
                                                return true;
                                        }
                                }
                        } else {
                                if (selectedObject.userData.box.intersectsBox(collisionObj.userData.box)) {
                                        return true;
                                }
                        }
                }
                return false;
        }

        addCollider(collider) {
                if (collider instanceof Group) {
                        collider.userData.colliders = [];
                        collider.traverse((mesh) => {
                                if ((mesh instanceof Mesh)) {
                                        this.colliders.push(mesh);
                                        collider.userData.colliders.push(mesh);
                                }
                        });
                } else if (collider instanceof Mesh) {
                        this.colliders.push(collider);
                } else {
                        throw "Only mesh or group colliders should be added";
                }
        }

        _updateBoxes() {
                this.colliders.forEach((collider) => {
                        let box = new Box3();
                        box.setFromObject(collider);
                        collider.userData.box = box;
                });


        }

        sameObject(parent, son) {
                if (parent === son)
                        return true;
                else if (parent.children.length === 0)
                        return false;
                else {
                        for (var i = 0; i < parent.children.length; i++) {
                                var sameObj = this.sameObject(parent.children[i], son);
                                if (sameObj) {
                                        return sameObj;
                                }
                        }
                }
                return false;
        }
}

export { Collisions }