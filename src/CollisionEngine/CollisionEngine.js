import { Vector3 } from 'three';
import { Collisions } from './Collisions/Collisions';
import { restrict } from './Transforms/Restrictions';
import { snap } from './Transforms/Snap';
import { TransformData } from './Transforms/TransformData.js';

class CollisionEngine {

	constructor(params) {
		this.trackAfterCollision = params.trackAfterCollision === undefined ? true : params.trackAfterCollision;
		this.snapDistance = params.snapDistance === undefined ? 0 : params.snapDistance;
		this.collisions = new Collisions();
		this.realPosition = null;
		this.collisionsEnabled = true;
		this.resetOnSnap = params.resetOnSnap === undefined ? true : params.resetOnSnap;
		this.resetCallback = params.resetCallback === undefined ? null : params.resetCallback;
	}

	translate(object, axis, deltaMove) {
		if (!object) {
			return;
		}
		this._checkTransformData(object);
		if (!this.realPosition) {
			this.realPosition = object.position.clone();
		}
		let snapped = false;
		if (this.snapDistance > 0) {
			snapped = snap(object, this.collisions.getClosestElement(object), axis, deltaMove, this.snapDistance, (object, axis, value) => { this._onSnap(object, axis, value); }) === axis;
		}
		object.updateMatrixWorld();
		if (!snapped) {
			object.position.setComponent(axis, object.position.getComponent(axis) - deltaMove);
			this._translateChildren(object, axis, deltaMove, -1);
			object.updateMatrixWorld();
			this.realPosition.setComponent(axis, this.realPosition.getComponent(axis) - deltaMove);
		}
		if (this.collisionsEnabled) {
			if (this.collisions.checkCollisions(object)) {
				object.position.setComponent(axis, object.position.getComponent(axis) + deltaMove);
				this._translateChildren(object, axis, deltaMove, 1);
				this.collisions.updateCollisionBox(object);
				if (this.trackAfterCollision) {
					this._tryToRelocateObject(object, axis);
				}
			} else {
				this.realPosition.setComponent(axis, object.position.getComponent(axis));
			}
		}
		restrict(object, axis);
	}

	addCollider(collider) {
		this.collisions.addCollider(collider);
	}

	getMeshColliders() {
		return this.collisions.meshColliders;
	}

	reset() {
		this.realPosition = null;
	}

	_checkTransformData(object) {
		if (!object) {
			return;
		}
		if (!object.userData.transformData) {
			object.userData.transformData = new TransformData();
		}
	}

	_onSnap(object, axis, value) {
		if (!this.realPosition) { return; }
		object.position.setComponent(axis, value);
		let deltaMove = this.realPosition.getComponent(axis) - object.position.getComponent(axis);
		this._translateChildren(object, axis, deltaMove, -1);
		if (this.resetOnSnap) {
			this.resetCallback();
		}
	}

	_translateChildren(object, axis, deltaMove, dir) {
		object.userData.transformData.getChildren().forEach(child => {
			child.position.setComponent(axis, child.position.getComponent(axis) + deltaMove * dir);
			this.collisions.updateCollisionBox(child);
		});
	}

	_tryToRelocateObject(object, axis) {
		let currentPos = new Vector3().copy(object.position);
		object.position.setComponent(axis, this.realPosition.getComponent(axis));
		object.updateMatrixWorld();
		if (this.collisions.checkCollisions(object)) {
			object.position.copy(currentPos);
			object.updateMatrixWorld();
			this.collisions.updateCollisionBox(object);
		} else {
			let deltaMove = this.realPosition.getComponent(axis) - currentPos.getComponent(axis);
			this._translateChildren(object, axis, deltaMove, 1);
		}
	}
}

export { CollisionEngine };
