import { Group, Vector3 } from 'three';

export function getClosestDistanceBetweenObjects(selectedObject, collider) {
    let distancesX = [];
    let distancesY = [];
    let distancesZ = [];
    if (selectedObject instanceof Group) {
        selectedObject.updateMatrixWorld();
        selectedObject.userData.transformData.colliders.forEach((mesh) => {
            setDistancesBetweenObjects(mesh, collider, distancesX, distancesY, distancesZ);
        });
    } else {
        setDistancesBetweenObjects(selectedObject, collider, distancesX, distancesY, distancesZ);
    }
    let distanceX = getClosestDistance(distancesX);
    let distanceY = getClosestDistance(distancesY);
    let distanceZ = getClosestDistance(distancesZ);
    return { distanceX, distanceY, distanceZ };
}

function setDistancesBetweenObjects(selectedElement, collider, distancesX, distancesY, distancesZ) {
    let selectedWorldPos = new Vector3();
    selectedWorldPos.setFromMatrixPosition(selectedElement.matrixWorld);
    let colliderWorldPos = new Vector3();
    colliderWorldPos.setFromMatrixPosition(collider.matrixWorld);
    let colliderBox = collider.userData.transformData.box;
    let selectedBox = selectedElement.userData.transformData.box;
    distancesX.push(Math.abs((selectedWorldPos.x - colliderWorldPos.x) - (selectedBox.max.x - selectedBox.min.x) / 2
        + (colliderBox.max.x - colliderBox.min.x) / 2) - (selectedBox.max.x - selectedBox.min.x));
    distancesY.push(Math.abs((selectedWorldPos.y - colliderWorldPos.y) - (selectedBox.max.y - selectedBox.min.y) / 2
        + (colliderBox.max.y - colliderBox.min.y) / 2) - (selectedBox.max.y - selectedBox.min.y));
    distancesZ.push(Math.abs((selectedWorldPos.z - colliderWorldPos.z) - (selectedBox.max.z - selectedBox.min.z) / 2
        + (colliderBox.max.z - colliderBox.min.z) / 2) - (selectedBox.max.z - selectedBox.min.z));
}

function getClosestDistance(distances) {
    return distances.reduce((prev, curr) => {
        return (Math.abs(curr - 0) < Math.abs(prev - 0) ? curr : prev);
    });
}

export function checkIfObjectInsideObjectBounds(object, parent) {
    let objectBox = object.userData.transformData.box;
    let parentBox = parent.userData.transformData.box;
    for (let axis = 0; axis < 2; axis++) {
        if ((object.position.getComponent(axis) - (objectBox.max.getComponent(axis) - objectBox.min.getComponent(axis)) / 2)
            < (parent.position.getComponent(axis) - (parentBox.max.getComponent(axis) - parentBox.min.getComponent(axis)) / 2) ||
            (object.position.getComponent(axis) + (objectBox.max.getComponent(axis) - objectBox.min.getComponent(axis)) / 2)
            > (parent.position.getComponent(axis) + (parentBox.max.getComponent(axis) - parentBox.min.getComponent(axis)) / 2)) {
            return false;
        }
    }
    return true;
}



