import { Box3, Group, Mesh,Vector3 } from 'three';

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
                        if (!collisionObj.userData || !collisionObj.userData.box) {
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
                        collider.userData.colliders.forEach((mesh) => {
                                let margin = mesh.userData.margin ? mesh.userData.margin : new Vector3(0, 0, 0);

                                mesh.userData.box = new Box3().setFromObject(mesh);
                                mesh.userData.box.min.set(mesh.userData.box.min.x + margin.x, mesh.userData.box.min.y + margin.y, mesh.userData.box.min.z + margin.z);
                                mesh.userData.box.max.set(mesh.userData.box.max.x - margin.x, mesh.userData.box.max.y - margin.y, mesh.userData.box.max.z - margin.z);

                        });
                }
                let margin = collider.userData.margin ? collider.userData.margin : new Vector3(0, 0, 0);

                collider.userData.box = new Box3().setFromObject(collider);
                collider.userData.box.min.set(collider.userData.box.min.x + margin.x, collider.userData.box.min.y + margin.y, collider.userData.box.min.z + margin.z);
                collider.userData.box.max.set(collider.userData.box.max.x - margin.x, collider.userData.box.max.y - margin.y, collider.userData.box.max.z - margin.z);
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