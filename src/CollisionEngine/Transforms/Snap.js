import { getBoundsForElementInAxis } from '../Aabb/aabbOperations';

const SNAP_SCAPE = 0.3;
const SNAP_MARGIN = 0.005;
const SNAP_BOUNDS = Object.freeze({ 'none': 0, 'snapXY': 1, 'snapXZ': 2, 'snapZY': 3 });

export function snap(selectedObject, closestObject, movingAxis, deltaMove, snapDistance, snapToBound = SNAP_BOUNDS.snapXY) {
	if (closestObject.distances.length === 0) {
		return;
	}
	let distance = closestObject.distances.reduce(function (prev, curr) {
		return (Math.abs(curr - 0) < Math.abs(prev - 0 && curr > 0) ? curr : prev);
	});
	let axis = closestObject.distances.indexOf(distance);
	let dir = deltaMove < 0 ? -1 : 1;
	let correctDistances = closestObject.distances.filter(d => d < snapDistance).length;
	if (correctDistances > 2 && distance >= SNAP_SCAPE) {
		if (movingAxis === axis) {
			selectedObject.position.setComponent(axis, selectedObject.position.getComponent(axis) - (distance - SNAP_MARGIN) * dir);

			switch (snapToBound) {
				case SNAP_BOUNDS.snapXY:
					snapXY(selectedObject, closestObject, axis);
					break;
				case SNAP_BOUNDS.snapXZ:
					snapXZ(selectedObject, closestObject, axis);
					break;
				case SNAP_BOUNDS.snapZY:
					snapZY(selectedObject, closestObject, axis);
					break;
				default:
					break;
			}
			return movingAxis;
		}
	}
}

function snapXY(selectedObject, closestObject, axis) {
	if (axis === 0) {
		let selectedObjectPoints = getBoundsForElementInAxis(selectedObject, 1);
		let closestObjectPoints = getBoundsForElementInAxis(closestObject.element, 1);
		let minPointsDistance = selectedObjectPoints.min - closestObjectPoints.min;
		let maxPointsDistance = selectedObjectPoints.max - closestObjectPoints.max;
		if (Math.abs(minPointsDistance) < Math.abs(maxPointsDistance)) {
			selectedObject.position.setComponent(1, selectedObject.position.getComponent(1) - minPointsDistance);
		} else {
			selectedObject.position.setComponent(1, selectedObject.position.getComponent(1) - maxPointsDistance);
		}

	} else if (axis === 1) {
		let selectedObjectPoints = getBoundsForElementInAxis(selectedObject, 0);
		let closestObjectPoints = getBoundsForElementInAxis(closestObject.element, 0);
		let minPointsDistance = selectedObjectPoints.min - closestObjectPoints.min;
		let maxPointsDistance = selectedObjectPoints.max - closestObjectPoints.max;
		if (Math.abs(minPointsDistance) < Math.abs(maxPointsDistance)) {
			selectedObject.position.setComponent(0, selectedObject.position.getComponent(0) - minPointsDistance);
		} else {
			selectedObject.position.setComponent(0, selectedObject.position.getComponent(0) - maxPointsDistance);
		}
	}
}

function snapXZ(selectedObject, closestObject, axis) {
	if (axis === 0) {
		let selectedObjectPoints = getBoundsForElementInAxis(selectedObject, 2);
		let closestObjectPoints = getBoundsForElementInAxis(closestObject.element, 2);
		let minPointsDistance = selectedObjectPoints.min - closestObjectPoints.min;
		let maxPointsDistance = selectedObjectPoints.max - closestObjectPoints.max;
		if (Math.abs(minPointsDistance) < Math.abs(maxPointsDistance)) {
			selectedObject.position.setComponent(2, selectedObject.position.getComponent(2) - minPointsDistance);
		} else {
			selectedObject.position.setComponent(2, selectedObject.position.getComponent(2) - maxPointsDistance);
		}

	} else if (axis === 2) {
		let selectedObjectPoints = getBoundsForElementInAxis(selectedObject, 0);
		let closestObjectPoints = getBoundsForElementInAxis(closestObject.element, 0);
		let minPointsDistance = selectedObjectPoints.min - closestObjectPoints.min;
		let maxPointsDistance = selectedObjectPoints.max - closestObjectPoints.max;
		if (Math.abs(minPointsDistance) < Math.abs(maxPointsDistance)) {
			selectedObject.position.setComponent(0, selectedObject.position.getComponent(0) - minPointsDistance);
		} else {
			selectedObject.position.setComponent(0, selectedObject.position.getComponent(0) - maxPointsDistance);
		}
	}
}

function snapZY(selectedObject, closestObject, axis) {
	if (axis === 1) {
		let selectedObjectPoints = getBoundsForElementInAxis(selectedObject, 2);
		let closestObjectPoints = getBoundsForElementInAxis(closestObject.element, 2);
		let minPointsDistance = selectedObjectPoints.min - closestObjectPoints.min;
		let maxPointsDistance = selectedObjectPoints.max - closestObjectPoints.max;
		if (Math.abs(minPointsDistance) < Math.abs(maxPointsDistance)) {
			selectedObject.position.setComponent(2, selectedObject.position.getComponent(2) - minPointsDistance);
		} else {
			selectedObject.position.setComponent(2, selectedObject.position.getComponent(2) - maxPointsDistance);
		}

	} else if (axis === 2) {
		let selectedObjectPoints = getBoundsForElementInAxis(selectedObject, 1);
		let closestObjectPoints = getBoundsForElementInAxis(closestObject.element, 1);
		let minPointsDistance = selectedObjectPoints.min - closestObjectPoints.min;
		let maxPointsDistance = selectedObjectPoints.max - closestObjectPoints.max;
		if (Math.abs(minPointsDistance) < Math.abs(maxPointsDistance)) {
			selectedObject.position.setComponent(1, selectedObject.position.getComponent(1) - minPointsDistance);
		} else {
			selectedObject.position.setComponent(1, selectedObject.position.getComponent(1) - maxPointsDistance);
		}
	}
}
