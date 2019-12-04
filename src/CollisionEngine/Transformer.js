'strict mode'

import { Vector2, Vector3 } from 'three';
import { Collisions } from './Collisions.js'

class Transformer {

    constructor(camera, colliders) {
        this.collisionEngine = new Collisions();
        this.camera = camera;
        this.colliders = colliders;
        this.oldMousePos = null;
    }

    translate(object, e) {
        let mouse = new Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
        let mousePos = this.getMousePositionInScene(mouse);

        if (!this.oldMousePos) {
            this.oldMousePos = mousePos;
        }
        let deltaMove = {
            x: this.oldMousePos.x - mousePos.x,
            y: this.oldMousePos.y - mousePos.y,
        };
        object.position.x -= deltaMove.x;
        
        if (this.collisionEngine.checkCollisions(object, this.colliders, deltaMove, "x")) {
            deltaMove.x = object.position.x - mousePos.x;
            object.position.x -= deltaMove.x;
            this.collisionEngine.checkCollisions(object, this.colliders, deltaMove, "x");
        }

        object.position.y -= deltaMove.y;
        console.log( `deltamoveY: ${deltaMove.y} `);
        console.log( `object.position.y: ${object.position.y} `);
        if (this.collisionEngine.checkCollisions(object, this.colliders, deltaMove, "y")) {
            deltaMove.y = object.position.y - mousePos.y;
            object.position.y -= deltaMove.y;
            this.collisionEngine.checkCollisions(object, this.colliders, deltaMove, "y");
        }
        this.oldMousePos = mousePos;
    }

    getMousePositionInScene(mousePos) {
        let vector = new Vector3(mousePos.x, mousePos.y, 0);
        vector.unproject(this.camera);
        let dir = vector.sub(this.camera.position).normalize();
        let distance = - this.camera.position.z / dir.z;
        let pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        return pos;
    }

    reset() {
        this.oldMousePos = null;
    }

}

export { Transformer }
