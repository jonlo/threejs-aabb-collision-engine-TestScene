import { Box3, Group, Mesh, Vector3 } from 'three';
import { distanceBetweenTwoLines } from './distanceBetweenTwoLines'

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
                        this._tryToUpdateObject(collisionObj);
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
                                let margin = mesh.userData.margin ? mesh.userData.margin : {
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                        front: 0,
                                        back: 0
                                };

                                mesh.userData.box = new Box3().setFromObject(mesh);
                                mesh.userData.box.min.set(mesh.userData.box.min.x - margin.left, mesh.userData.box.min.y - margin.bottom, mesh.userData.box.min.z - margin.front);
                                mesh.userData.box.max.set(mesh.userData.box.max.x + margin.right, mesh.userData.box.max.y + margin.top, mesh.userData.box.max.z + margin.back);

                        });
                }
                let margin = collider.userData.margin ? collider.userData.margin : new Vector3(0, 0, 0);
                collider.userData.box = new Box3().setFromObject(collider);
                collider.userData.box.min.set(collider.userData.box.min.x - margin.left, collider.userData.box.min.y - margin.bottom, collider.userData.box.min.z - margin.front);
                collider.userData.box.max.set(collider.userData.box.max.x + margin.right, collider.userData.box.max.y + margin.top, collider.userData.box.max.z + margin.back);
        }

        getClosestElement(selectedObject) {
                this._tryToUpdateObject(selectedObject);
                let selectedBox = selectedObject.userData.box;
                let closest = {
                        distances: [],
                        element: null
                };
                this.meshColliders.forEach(collider => {
                        if (!this._isSameObject(selectedObject, collider)) {
                                this._tryToUpdateObject(collider);
                                let colliderBox = collider.userData.box;
                                let distanceX = Math.abs((selectedObject.position.x - collider.position.x) - (selectedBox.max.x - selectedBox.min.x) / 2
                                        + (colliderBox.max.x - colliderBox.min.x) / 2) - (selectedBox.max.x - selectedBox.min.x);
                                let distanceY = Math.abs((selectedObject.position.y - collider.position.y) - (selectedBox.max.y - selectedBox.min.y) / 2
                                        + (colliderBox.max.y - colliderBox.min.y) / 2) - (selectedBox.max.y - selectedBox.min.y);
                                let distanceZ = Math.abs((selectedObject.position.z - collider.position.z) - (selectedBox.max.z - selectedBox.min.z) / 2
                                        + (colliderBox.max.z - colliderBox.min.z) / 2);

                                let distance = distanceX + distanceY + distanceZ;
                                if (!closest.element || closest.distances.reduce((a, b) => a + b, 0) > distance) {
                                        closest.element = collider;
                                        closest.distances[0] = distanceX;
                                        closest.distances[1] = distanceY;
                                        closest.distances[2] = distanceZ;
                                }
                        }
                        collider.material.color.set(0x00ff00);
                });
                closest.element.material.color.set(0xff0000);
                return closest;
        }

        _tryToUpdateObject(collisionObj) {
                if (!collisionObj.userData || !collisionObj.userData.box) {
                        this.updateCollisionBox(collisionObj);
                }
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