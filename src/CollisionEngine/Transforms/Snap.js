const SNAP_SCAPE = 0.3;
const SNAP_MARGIN = 0.005;

export function snap(object, closest, movingAxis, deltaMove, snapDistance) {
    let distance = closest.distances.reduce(function (prev, curr) {
        return (Math.abs(curr - 0) < Math.abs(prev - 0 && curr > 0) ? curr : prev);
    });
    let axis = closest.distances.indexOf(distance);
    let dir = deltaMove < 0 ? -1 : 1;
    let correctDistances = closest.distances.filter(d => d < snapDistance).length;
    if (correctDistances > 2 && distance >= SNAP_SCAPE) {
        if (movingAxis === axis) {
            object.position.setComponent(axis, object.position.getComponent(axis) - (distance - SNAP_MARGIN) * dir);
            return movingAxis;
        }
    }
}
