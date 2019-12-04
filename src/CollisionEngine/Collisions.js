import { Box3 } from 'three';

class Collisions {

        checkCollisions(object, collisionList) {
                this.updateBox(object);
                for (let i = 0; i < collisionList.length; i++) {
                        let collideBox = collisionList[i];
                        if (this.sameObject(object, collideBox)) {
                                continue;
                        }
                        this.updateBox(collisionList[i]);
                        if (object.userData.box.intersectsBox(collideBox.userData.box)) {
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