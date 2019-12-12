import { getBoundsForElementInAxis } from '../Aabb/aabbOperations'

const SNAP_SCAPE = 0.3;
const SNAP_MARGIN = 0.005;
var snapToBound = true;

export function snap(selectedObject, closestObject, movingAxis, deltaMove, snapDistance) {
    let distance = closestObject.distances.reduce(function (prev, curr) {
        return (Math.abs(curr - 0) < Math.abs(prev - 0 && curr > 0) ? curr : prev);
    });
    let axis = closestObject.distances.indexOf(distance);
    let dir = deltaMove < 0 ? -1 : 1;
    let correctDistances = closestObject.distances.filter(d => d < snapDistance).length;
    if (correctDistances > 2 && distance >= SNAP_SCAPE) {
        if (movingAxis === axis) {
            selectedObject.position.setComponent(axis, selectedObject.position.getComponent(axis) - (distance - SNAP_MARGIN) * dir);
            if (snapToBound) {
                console.log(`axis: ${axis}`);
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
                    // let selectedObjectPoints = getBoundsForElementInAxis(selectedObject, 0);
                    // let closestObjectPoints = getBoundsForElementInAxis(closestObject.element, 0);
                    // let minPointsDistance = selectedObjectPoints.min - closestObjectPoints.min;
                    // let maxPointsDistance = selectedObjectPoints.max - closestObjectPoints.max;
                    // if (Math.abs(minPointsDistance) < Math.abs(maxPointsDistance)) {
                    //     selectedObject.position.setComponent(0, selectedObject.position.getComponent(0) - maxPointsDistance);
                    // } else {
                    //     selectedObject.position.setComponent(0, selectedObject.position.getComponent(0) - minPointsDistance);
                    // }
                }
            }
            return movingAxis;
        }
    }
}
