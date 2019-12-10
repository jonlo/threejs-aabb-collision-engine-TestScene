import { Group, Vector3 } from 'three';

const SNAP_SCAPE = 0.3;
const SNAP_MARGIN = 0.005;

export function snap(object, closest, movingAxis, deltaMove, snapDistance) {
    let distance = closest.distances.reduce(function (prev, curr) {
        return (Math.abs(curr - 0) < Math.abs(prev - 0 && curr > 0) ? curr : prev);
    });
    let axis = closest.distances.indexOf(distance);
    let dir = deltaMove < 0 ? -1 : 1;
    let correctDistances = closest.distances.filter(d => d < snapDistance).length;
    if (correctDistances > 2 && distance >= SNAP_SCAPE) {
        if (movingAxis === axis) {
            object.position.setComponent(axis, object.position.getComponent(axis) - (distance - SNAP_MARGIN) * dir);
            return movingAxis;
        }
    }
}

export function getClosestDistanceBetweenObjects(selectedObject, collider) {
    let distancesX = [];
    let distancesY = [];
    let distancesZ = [];
    if (selectedObject instanceof Group) {
        selectedObject.updateMatrixWorld();
        selectedObject.userData.colliders.forEach((mesh) => {
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
    let colliderBox = collider.userData.box;
    let selectedBox = selectedElement.userData.box;
    distancesX.push(Math.abs((selectedWorldPos.x - colliderWorldPos.x) - (selectedBox.max.x - selectedBox.min.x) / 2
        + (colliderBox.max.x - colliderBox.min.x) / 2) - (selectedBox.max.x - selectedBox.min.x));
    distancesY.push(Math.abs((selectedWorldPos.y - colliderWorldPos.y) - (selectedBox.max.y - selectedBox.min.y) / 2
        + (colliderBox.max.y - colliderBox.min.y) / 2) - (selectedBox.max.y - selectedBox.min.y));
    distancesZ.push(Math.abs((selectedWorldPos.z - colliderWorldPos.z) - (selectedBox.max.z - selectedBox.min.z) / 2
        + (colliderBox.max.z - colliderBox.min.z) / 2));
}

function getClosestDistance(distances) {
    return distances.reduce((prev, curr) => {
        return (Math.abs(curr - 0) < Math.abs(prev - 0) ? curr : prev);
    });
}