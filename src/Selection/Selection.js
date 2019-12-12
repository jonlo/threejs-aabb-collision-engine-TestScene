import { Scene, Raycaster } from 'three';

export class Selection {
    constructor(camera) {
        this.camera = camera;
        this.raycaster = new Raycaster();
    }

    selectElement(mousePosNormalized, allElements) {
        var intersects = this._raycastHits(this.camera, mousePosNormalized, allElements);
        let selectedElement;
        if (intersects.length > 0) {
            if (!(intersects[0].object.parent instanceof Scene)) {
                selectedElement = intersects[0].object.parent;
            } else {
                selectedElement = intersects[0].object;
            }
            let firstChild = intersects.find(intersect => intersect.object.userData.transformData.isChild());
            if (firstChild) {
                selectedElement = firstChild.object;
            }
            return selectedElement;
        }
    }

    _raycastHits(camera, mousePos, colliders) {
        this.raycaster.setFromCamera(mousePos, camera);
        let intersects = this.raycaster.intersectObjects(colliders.filter(element => element.userData.transformData.selectable));
        return intersects;
    }

}