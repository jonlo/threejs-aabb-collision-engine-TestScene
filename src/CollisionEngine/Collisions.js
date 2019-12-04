import { Box3 } from 'three';

class Collisions {

        checkCollisions(object, collisionList, deltaMove, axis) {
                //object.updateMatrixWorld();
                this.updateBox(object);
                //See if exists colliding objects
                for (let i = 0; i < collisionList.length; i++) {
                        let collideBox = collisionList[i];
                        if (this.sameObject(object, collideBox)) {
                                continue;
                        }
                        this.updateBox(collisionList[i]);
                        if (object.userData.box.intersectsBox(collideBox.userData.box)) {
                                if (axis === "x") {
                                        object.position.x += deltaMove.x;

                                } else if (axis === "y") {
                                        object.position.y += deltaMove.y;
                                }
                                return true;
                        }
                }
                return false;
        }

        sameObject(parent, son) {
                if (parent === son)
                        return true;
                else if (parent.children.length === 0)
                        return false;
                else {
                        for (var i = 0; i < parent.children.length; i++) {
                                var sameObj = sameObject(parent.children[i], son);
                                if (sameObj) {
                                        return sameObj;
                                }
                        }
                }
                return false;
        }

        updateBox(object) {
                let box = new Box3();
                box.setFromObject(object);
                object.userData.box = box;
        }
}

export { Collisions }