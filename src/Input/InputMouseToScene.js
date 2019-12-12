'strict mode'

import { Vector2, Vector3 } from 'three';

class InputMouseToScene {

    constructor(container, camera, listeners) {
        this.listeners = listeners ? listeners : [];

        this.camera = camera;
        container.addEventListener('mousedown', (e) => { this._mouseDown(e) });
        container.addEventListener('mousemove', (e) => { this._mouseMove(e) });
        container.addEventListener('mouseup', (e) => { this._mouseUp(e) });
    }

    _mouseDown(e) {
        let mouse = new Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
        let mousePos = this._getMousePositionInScene(mouse);
        this.listeners.forEach(l => l.mouseDown(mousePos,mouse));

        console.log(`mousex: ${e.clientX}  mousey:${e.clientY} sceneX${mousePos.x} sceneY${mousePos.x} `);
    }

    _mouseUp(e) {
        let mouse = new Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
        let mousePos = this._getMousePositionInScene(mouse);
        this.listeners.forEach(l => l.mouseUp(mousePos,mouse));
    }

    _mouseMove(e) {
        let mouse = new Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
        let mousePos = this._getMousePositionInScene(mouse);
        this.listeners.forEach(l => l.mouseMove(mousePos,mouse));
    }

    _getMousePositionInScene(mousePos) {
        let vector = new Vector3(mousePos.x, mousePos.y, 0);
        vector.unproject(this.camera);
        let dir = vector.sub(this.camera.position).normalize();
        let distance = - this.camera.position.z / dir.z;
        let pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        return pos;
    }

}

export { InputMouseToScene }