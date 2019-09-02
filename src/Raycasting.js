'strict mode'
import {Raycaster} from 'three';

export class CollisionRaycaster {

    constructor(){
        this.raycaster = new Raycaster();
    }

    raycastHits  (camera, mousePos, colliders) {
        this.raycaster.setFromCamera(mousePos, camera);
        var intersects = this.raycaster.intersectObjects(colliders);
        return intersects;
    }
}