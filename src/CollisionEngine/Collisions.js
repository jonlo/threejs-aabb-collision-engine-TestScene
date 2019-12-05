import { Box3, Group, Mesh } from 'three';

class Collisions {
        constructor() {
                this.meshColliders = [];
        }

        checkCollisions(selectedObject) {
                this.updateCollisionBox(selectedObject);
                for (let i = 0; i < this.meshColliders.length; i++) {
                        let collisionObj = this.meshColliders[i];
                        if (this._isSameObject(selectedObject, collisionObj)) {
                                continue;
                        }
                        if(!collisionObj.userData || !collisionObj.userData.box){
                                this.updateCollisionBox(collisionObj);
                        }
                        if (selectedObject instanceof Group) {
                                for (let j = 0; j < selectedObject.userData.colliders.length; j++) {
                                        if (selectedObject.userData.colliders[j].userData.box.intersectsBox(collisionObj.userData.box)) {
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
                                        this.meshColliders.push(mesh);
                                        collider.userData.colliders.push(mesh);
                                }
                        });
                } else if (collider instanceof Mesh) {
                        this.meshColliders.push(collider);
                } else {
                        throw "Only mesh or group colliders should be added";
                }

        }

        updateCollisionBox(collider) {
                if (collider instanceof Group) {
                        collider.traverse((mesh) => {
                                if ((mesh instanceof Mesh)) {
                                        mesh.userData.box = new Box3().setFromObject(mesh);
                                }
                        });
                }
                collider.userData.box = new Box3().setFromObject(collider);
        }

        _isSameObject(parent, son) {
                if (parent === son)
                        return true;
                else if (parent.children.length === 0)
                        return false;
                else {
                        for (var i = 0; i < parent.children.length; i++) {
                                var sameObj = this._isSameObject(parent.children[i], son);
                                if (sameObj) {
                                        return sameObj;
                                }
                        }
                }
                return false;
        }
}

export { Collisions }