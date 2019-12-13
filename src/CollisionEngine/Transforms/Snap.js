import { getBoundsForElementInAxis } from '../Aabb/aabbOperations';

const SNAP_SCAPE = 0.3;
const SNAP_MARGIN = 0.005;
const SNAP_BOUNDS = Object.freeze({ 'none': 0, 'snapXY': 1, 'snapXZ': 2, 'snapZY': 3 });

const lastDistance = [0, 0, 0];
const lastScapeDistance = [0, 0, 0];

export function snap(selectedObject, closestObject, movingAxis, deltaMove, snapDistance, onSnapCallback, snapToBound = SNAP_BOUNDS.snapXY) {
	if (closestObject.distances.length === 0) {
		return;
	}
	let distance = closestObject.distances.reduce(function (prev, curr) {
		return (Math.abs(curr - 0) < Math.abs(prev - 0 && curr > 0) ? curr : prev);
	});
	let axis = closestObject.distances.indexOf(distance);
	let dir = deltaMove < 0 ? -1 : 1;
	let correctDistances = closestObject.distances.filter(d => d < snapDistance).length;
	if (correctDistances > 2) {
		if (distance < lastDistance[movingAxis] && distance > SNAP_SCAPE) {
			if (movingAxis === axis) {
				onSnapCallback(selectedObject, axis, selectedObject.position.getComponent(axis) - (distance - SNAP_MARGIN) * dir);
				if (snapToBound !== SNAP_BOUNDS.none) {
					snapToBounds(selectedObject, closestObject, getAxisForSnapBound(axis, snapToBound), onSnapCallback);
				}
				lastDistance[movingAxis] = 0;
				return movingAxis;
			}
		} else {
			lastDistance[movingAxis] = Math.abs(distance);
		}

	}

}

function snapToBounds(selectedObject, closestObject, axis, onSnapCallback) {
	let selectedObjectPoints = getBoundsForElementInAxis(selectedObject, axis);
	let closestObjectPoints = getBoundsForElementInAxis(closestObject.element, axis);
	let minPointsDistance = selectedObjectPoints.min - closestObjectPoints.min;
	let maxPointsDistance = selectedObjectPoints.max - closestObjectPoints.max;
	if (Math.abs(minPointsDistance) < Math.abs(maxPointsDistance)) {
		onSnapCallback(selectedObject, axis, selectedObject.position.getComponent(axis) - minPointsDistance);
	} else {
		onSnapCallback(selectedObject, axis, selectedObject.position.getComponent(axis) - maxPointsDistance);
	}
}

function getAxisForSnapBound(axis, snapToBound) {
	switch (snapToBound) {
		case SNAP_BOUNDS.snapXY:
			return axis === 0 ? 1 : 0;
		case SNAP_BOUNDS.snapXZ:
			return axis === 0 ? 2 : 0;
		case SNAP_BOUNDS.snapZY:
			return axis === 1 ? 2 : 1;
	}
}
