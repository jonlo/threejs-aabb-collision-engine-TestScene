import { Group, Vector3 } from 'three';

export function getClosestDistanceBetweenObjects(selectedObject, collider) {
    let distances = [[], [], []];
    if (selectedObject instanceof Group) {
        selectedObject.updateMatrixWorld();
        selectedObject.userData.transformData.colliders.forEach((mesh) => {
            setDistancesBetweenObjects(mesh, collider, distances);
        });
    } else {
        setDistancesBetweenObjects(selectedObject, collider, distances);
    }
    return {
        distanceX: getClosestDistance(distances[0]),
        distanceY: getClosestDistance(distances[1]),
        distanceZ: getClosestDistance(distances[2])
    };
}

export function checkIfObjectInsideObjectBounds(object, parent) {
    let objectBox = object.userData.transformData.box;
    let parentBox = parent.userData.transformData.box;
    for (let axis = 0; axis < 2; axis++) {
        if ((object.position.getComponent(axis) - (objectBox.max.getComponent(axis) - objectBox.min.getComponent(axis)) / 2)
            < (parent.position.getComponent(axis) - (parentBox.max.getComponent(axis) - parentBox.min.getComponent(axis)) / 2 + Object.values(parent.userData.transformData.padding)[axis]) ||
            (object.position.getComponent(axis) + (objectBox.max.getComponent(axis) - objectBox.min.getComponent(axis)) / 2)
            > (parent.position.getComponent(axis) + (parentBox.max.getComponent(axis) - parentBox.min.getComponent(axis)) / 2 - Object.values(parent.userData.transformData.padding)[axis + 1])) {
            return false;
        }
    }
    return true;
}

function setDistancesBetweenObjects(selectedElement, collider, distances) {
    for (let axis = 0; axis < 3; axis++) {
        let selectedPoints = getBoundsForElementInAxis(selectedElement, axis);
        let colliderPoints = getBoundsForElementInAxis(collider, axis);
        if (selectedPoints.max < colliderPoints.max) {
            distances[axis].push(colliderPoints.min - selectedPoints.max);
        } else {
            distances[axis].push(selectedPoints.min - colliderPoints.max);
        }
    }
    console.log(`dx: ${distances[0]}`);
    console.log(`dy: ${distances[1]}`);
    console.log(`dz: ${distances[2]}`);
}

export function getBoundsForElementInAxis(element, axis) {
    console.log(element);
    let elementWorldPos = new Vector3();
    elementWorldPos.setFromMatrixPosition(element.matrixWorld);
    let elementWidth = (element.userData.transformData.box.max.getComponent(axis) - element.userData.transformData.box.min.getComponent(axis)) / 2;
    let max = elementWorldPos.getComponent(axis) + elementWidth;
    let min = elementWorldPos.getComponent(axis) - elementWidth;
    return { min, max };
}

function getClosestDistance(distances) {
    return distances.reduce((prev, curr) => {
        return (Math.abs(curr - 0) < Math.abs(prev - 0) ? curr : prev);
    });
}
