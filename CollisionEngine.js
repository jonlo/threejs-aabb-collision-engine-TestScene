

function checkCollisions(object, collisionList,deltaMove) {
        object.updateMatrixWorld();
        updateBox(object);
        //See if exists colliding objects
        for (var i = 0; i < collisionList.length; i++) {
                var collideBox = collisionList[i];
                if (sameObject(object, collideBox))
                        continue;

                //update collide box
                updateBox(collisionList[i]);

                if (object.userData.box.intersectsBox(collideBox.userData.box)) {
                        //      manageCollision(object.collision, collideBox.source.collision, callback);
                        console.log("Collision");
                        object.position.x += deltaMove.x * 5;
                        object.position.y += deltaMove.y * 5;
                        return;
                }
        }

        //No collision nor snap. Update initial pos,rot,sca            
       // initStates(object);
}

function sameObject(parent, son) {
        if (parent === son)
                return true;
        else if (parent.children.length === 0)
                return false;
        else {
                for (var i = 0; i < parent.children.length; i++) {
                        var sameObj = sameObject(parent.children[i], son);
                        if (sameObj)
                                return sameObj;
                }
        }
        return false;
}

function updateBox(object) {

        var box = new THREE.Box3();
        box.setFromObject(object);
        object.userData.box = box;
}