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

var mousePos = new THREE.Vector2();
var oldMousePos = new THREE.Vector2();
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
    controls.addEventListener('change', function (e) {
        if (resetting)
            return;
        if (hitOnClick) {
            resetting = true;
            controls.reset();
            resetting = false;
        } else {
            controls.saveState();
        }
    });

    //controls.update() must be called after any manual changes to the camera's transform
    controls.update();

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube1 = new THREE.Mesh(geometry, material);
    scene.add(cube1);

    cube2 = new THREE.Mesh(geometry, material);
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


function mouseDown(e) {
    intersects = RaycastHits(camera, container);
    console.log(intersects.length);
    if (intersects.length > 0) {
        selectedCube = intersects[0].object;
        hitOnClick = true;
    } else {
        hitOnClick = false;
    }
}

function mouseUp(e) {
    if (selectedCube) {
        selectedCube = null;
        hitOnClick = false;
    }
}

function mouseMove(e) {

    mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = - (event.clientY / window.innerHeight) * 2 + 1;
    if (selectedCube) {
        translateCube();
    }
    oldMousePos.x = mousePos.x;
    oldMousePos.y = mousePos.y;
}

function RaycastHits(camera) {
    raycaster.setFromCamera(mousePos, camera);
    var intersects = raycaster.intersectObjects(colliders);
    return intersects;
}

function translateCube() {
    if (oldMousePos) {
        var deltaMove = {
            x: oldMousePos.x - mousePos.x,
        };
        selectedCube.position.x -= deltaMove.x * 10;
    }
}