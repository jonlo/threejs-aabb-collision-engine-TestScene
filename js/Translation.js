function Transformer(){
    var oldPos = null;

     this.translate = function(object,e) {
        var mousePos = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
        var pos = getMousePositionInScene(mousePos);
    
        if (!oldPos) {
            oldPos = pos;
        }
        var deltaMove = {
            x: oldPos.x - pos.x,
            y: oldPos.y - pos.y,
        };
        object.position.x -= deltaMove.x;
        object.position.y -= deltaMove.y;
        if (checkCollisions(object, colliders, deltaMove)) {
            var deltaMove = {
                x: object.position.x - pos.x,
                y: object.position.y - pos.y,
            };
            object.position.x -= deltaMove.x;
            object.position.y -= deltaMove.y;
            checkCollisions(object, colliders, deltaMove);
        }
        oldPos = pos;
    }
    
    function getMousePositionInScene(mousePos) {
        var vector = new THREE.Vector3(mousePos.x, mousePos.y, 0);
        vector.unproject(camera);
        var dir = vector.sub(camera.position).normalize();
        var distance = - camera.position.z / dir.z;
        var pos = camera.position.clone().add(dir.multiplyScalar(distance));
        return pos;
    }
    
}

