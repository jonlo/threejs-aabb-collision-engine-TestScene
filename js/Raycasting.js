
function Raycast() {

    var raycaster = new THREE.Raycaster();

    this.raycastHits = function(camera, mousePos, colliders) {
        raycaster.setFromCamera(mousePos, camera);
        var intersects = raycaster.intersectObjects(colliders);
        return intersects;
    }
}
