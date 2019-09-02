'strict mode'

import * as THREE from 'three';
import {CollisionEngine} from './CollisionEngine.js'

export class Transformer{

    constructor(camera,colliders){
        this.collisionEngine = new CollisionEngine();
        this.camera = camera;
        this.colliders = colliders;
        this.oldPos = null;
    }
    

     translate (object,e) {
        var mousePos = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
        var pos = this.getMousePositionInScene(mousePos);
    
        if (!this.oldPos) {
            this.oldPos = pos;
        }
        var deltaMove = {
            x: this.oldPos.x - pos.x,
            y: this.oldPos.y - pos.y,
        };
        object.position.x -= deltaMove.x;
        object.position.y -= deltaMove.y;
        if (this.collisionEngine.checkCollisions(object, this.colliders, deltaMove)) {
            var deltaMove = {
                x: object.position.x - pos.x,
                y: object.position.y - pos.y,
            };
            object.position.x -= deltaMove.x;
            object.position.y -= deltaMove.y;
            this.collisionEngine.checkCollisions(object, this.colliders, deltaMove);
        }
        this.oldPos = pos;
    }
    
    getMousePositionInScene(mousePos) {
        var vector = new THREE.Vector3(mousePos.x, mousePos.y, 0);
        vector.unproject(this.camera);
        var dir = vector.sub(this.camera.position).normalize();
        var distance = - this.camera.position.z / dir.z;
        var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        return pos;
    }

    reset (){
        this.oldPos = null;
    }
    
}

export default function(){}
