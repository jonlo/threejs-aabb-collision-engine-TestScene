import { Group, Mesh } from 'three';
import { getClosestDistanceBetweenObjects } from './Snap'
import { isSameObject, tryToUpdateObject, updateBox } from './CollisionUpdates'

class Collisions {
        
        constructor() {
                this.meshColliders = [];
        }

        updateCollisionBox(collider) {
                updateBox(collider);
        }

        addCollider(collider) {
                if (collider instanceof Group) {
                        collider.userData.colliders = [];
                        collider.traverse((mesh) => {
                                if ((mesh instanceof Mesh)) {
                                        mesh.userData.isChild = true;
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

        checkCollisions(selectedObject) {
                updateBox(selectedObject);
                for (let i = 0; i < this.meshColliders.length; i++) {
                        let collisionObj = this.meshColliders[i];
                        if (isSameObject(selectedObject, collisionObj)) {
                                continue;
                        }
                        tryToUpdateObject(collisionObj);
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

        getClosestElement(selectedObject) {
                tryToUpdateObject(selectedObject);
                let closest = {
                        distances: [],
                        element: null
                };

                this.meshColliders.forEach(collider => {
                        if (!isSameObject(selectedObject, collider)) {
                                tryToUpdateObject(collider);
                                let distances = { distanceX: 0, distanceY: 0, distanceZ: 0 };
                                distances = getClosestDistanceBetweenObjects(selectedObject, collider);
                                let distance = distances.distanceX + distances.distanceY + distances.distanceZ;
                                if (!closest.element || closest.distances.reduce((a, b) => a + b, 0) > distance) {
                                        closest.element = collider;
                                        closest.distances[0] = distances.distanceX;
                                        closest.distances[1] = distances.distanceY;
                                        closest.distances[2] = distances.distanceZ;
                                }
                        }
                        collider.material.color.set(0x00ff00);
                });
                closest.element.material.color.set(0xff0000);
                return closest;
        }

}

export { Collisions }