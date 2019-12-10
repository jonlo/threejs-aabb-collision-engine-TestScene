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
    collider.userData.box = new Box3().setFromObject(collider);
    collider.userData.box.min.set(collider.userData.box.min.x - margin.left, collider.userData.box.min.y - margin.bottom, collider.userData.box.min.z - margin.front);
    collider.userData.box.max.set(collider.userData.box.max.x + margin.right, collider.userData.box.max.y + margin.top, collider.userData.box.max.z + margin.back);
}

export function tryToUpdateObject(collisionObj) {
    if (!collisionObj.userData || !collisionObj.userData.box) {
        updateBox(collisionObj);
    }
}

export function updateBox(collider) {
    if (collider instanceof Group) {
        collider.userData.colliders.forEach((mesh) => {
            updateCollider(mesh);
        });
    } else {
        updateCollider(collider);
    }
}

function _getMarginForObject(object) {
    return object.userData.transform.margin ? object.userData.transform.margin : {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        front: 0,
        back: 0
    };
}