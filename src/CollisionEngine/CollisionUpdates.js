import { Group, Box3 } from 'three';

export function isSameObject(parent, son) {
    if (parent === son)
        return true;
    else if (parent.children.length === 0)
        return false;
    else {
        for (let i = 0; i < parent.children.length; i++) {
            let sameObj = isSameObject(parent.children[i], son);
            if (sameObj) {
                return sameObj;
            }
        }
    }
    return false;
}

export function updateCollider(collider) {
    let margin = collider.userData.isChild ? _getMarginForObject(collider.parent) : _getMarginForObject(collider);
    collider.userData.transformData.setBox(collider);
    collider.userData.transformData.box.min.set(collider.userData.transformData.box.min.x - margin.left, collider.userData.transformData.box.min.y - margin.bottom, collider.userData.transformData.box.min.z - margin.front);
    collider.userData.transformData.box.max.set(collider.userData.transformData.box.max.x + margin.right, collider.userData.transformData.box.max.y + margin.top, collider.userData.transformData.box.max.z + margin.back);
}

export function tryToUpdateObject(collisionObj) {
    if (!collisionObj.userData.transformData || !collisionObj.userData.transformData.box) {
        updateBox(collisionObj);
    }
}

export function updateBox(collider) {
    if (collider instanceof Group) {
        collider.userData.transformData.colliders.forEach((mesh) => {
            updateCollider(mesh);
        });
    } else {
        updateCollider(collider);
    }
}

function _getMarginForObject(object) {
    return object.userData.transformData.margin ? object.userData.transformData.margin : {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        front: 0,
        back: 0
    };
}