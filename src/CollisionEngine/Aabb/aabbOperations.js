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

function setDistancesBetweenObjects(selectedElement, collider, distances) {
    let selectedWorldPos = new Vector3();
    selectedWorldPos.setFromMatrixPosition(selectedElement.matrixWorld);
    let colliderWorldPos = new Vector3();
    colliderWorldPos.setFromMatrixPosition(collider.matrixWorld);
    for (let axis = 0; axis < 3; axis++) {
        let colliderWidth = (collider.userData.transformData.box.max.getComponent(axis) - collider.userData.transformData.box.min.getComponent(axis)) / 2;
        let selectedWidth = (selectedElement.userData.transformData.box.max.getComponent(axis) - selectedElement.userData.transformData.box.min.getComponent(axis)) / 2;
        let selectedMaxPoint = selectedWorldPos.getComponent(axis) + selectedWidth;
        let colliderMinPoint = colliderWorldPos.getComponent(axis) - colliderWidth;
        let selectedMinPoint = selectedWorldPos.getComponent(axis) - selectedWidth;
        let colliderMaxPoint = colliderWorldPos.getComponent(axis) + colliderWidth;
        if (selectedMaxPoint < colliderMaxPoint) {
            distances[axis].push(colliderMinPoint - selectedMaxPoint);
        } else {
            distances[axis].push(selectedMinPoint - colliderMaxPoint);
        }
    }
    console.log(`dx: ${distances[0]}`);
    console.log(`dy: ${distances[1]}`);
    console.log(`dz: ${distances[2]}`);
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
            < (parent.position.getComponent(axis) - (parentBox.max.getComponent(axis) - parentBox.min.getComponent(axis)) / 2 + Object.values(parent.userData.transformData.padding)[axis]) ||
            (object.position.getComponent(axis) + (objectBox.max.getComponent(axis) - objectBox.min.getComponent(axis)) / 2)
            > (parent.position.getComponent(axis) + (parentBox.max.getComponent(axis) - parentBox.min.getComponent(axis)) / 2 - Object.values(parent.userData.transformData.padding)[axis + 1])) {
            return false;
        }
    }
    return true;
}