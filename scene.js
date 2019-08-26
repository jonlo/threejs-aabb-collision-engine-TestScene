var container,
    camera,
    scene,
    renderer,
    pivot_matrix,
    cube,
    controls,
    cube1,
    cube2,
    hitOnClick,
    resetting,
    selectedCube;

var oldPos = null;
var colliders = [];
var raycaster = new THREE.Raycaster();

'use strict';

main();

function main() {

    initScene();
}

function initScene() {
    // dom
    container = document.createElement('div');
    window.addEventListener('resize', onWindowResize, false);
    container.addEventListener('mousedown', mouseDown);
    container.addEventListener('mousemove', mouseMove);
    container.addEventListener('mouseup', mouseUp);
    document.body.appendChild(container);

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();
    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(10, 10, 15);

    //controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.update() must be called after any manual changes to the camera's transform
    controls.update();

    var geometry1 = new THREE.BoxGeometry(0.5, 10, 1);
    var material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube1 = new THREE.Mesh(geometry1, material1);
    scene.add(cube1);
    var geometry2 = new THREE.BoxGeometry(1, 1, 1);
    var material2 = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    cube2 = new THREE.Mesh(geometry2, material2);
    cube2.position.set(10, 0, 0);
    scene.add(cube2);
    colliders.push(cube1);
    colliders.push(cube2);

};

function render() {
    renderer.render(scene, camera);
}

// animate            
(function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();

}());

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function mouseDown(e) {
    var mousePos = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
    intersects = RaycastHits(camera, mousePos);
    if (intersects.length > 0) {
        selectedCube = intersects[0].object;
        hitOnClick = true;
        controls.enabled = false;
    }
}

function mouseUp(e) {
    if (selectedCube) {
        selectedCube = null;
        hitOnClick = false;
        oldPos = null;
        controls.enabled = true;
    }
}

function mouseMove(e) {
    if (selectedCube) {
        translateCube(e);
    }
}

function RaycastHits(camera, mousePos) {
    raycaster.setFromCamera(mousePos, camera);
    var intersects = raycaster.intersectObjects(colliders);
    return intersects;
}

function translateCube() {
    var mousePos = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
    var pos = getMousePositionInScene(mousePos);

    if (!oldPos) {
        oldPos = pos;
    }
    var deltaMove = {
        x: oldPos.x - pos.x,
        y: oldPos.y - pos.y,
    };
    selectedCube.position.x -= deltaMove.x;
    selectedCube.position.y -= deltaMove.y;
    if (checkCollisions(selectedCube, colliders, deltaMove)) {
        var deltaMove = {
            x: selectedCube.position.x - pos.x,
            y: selectedCube.position.y - pos.y,
        };
        selectedCube.position.x -= deltaMove.x;
        selectedCube.position.y -= deltaMove.y;
        checkCollisions(selectedCube, colliders, deltaMove);
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

