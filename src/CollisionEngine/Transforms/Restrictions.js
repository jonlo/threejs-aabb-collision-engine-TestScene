const AXES = ['x', 'y', 'z'];

export function restrict(object, axis) {
	let restrictions = object.userData.transformData.getRestrictions();
	if (restrictions.position && !isNaN(restrictions.position[AXES[axis]])) {
		object.position.setComponent(axis, restrictions.position[AXES[axis]]);
	}
	if (restrictions.rotation && !isNaN(restrictions.rotation[AXES[axis]])) {
		object.rotation.setComponent(axis, restrictions.rotation[AXES[axis]]);
	}
	if (restrictions.scale && !isNaN(restrictions.scale[AXES[axis]])) {
		object.scale.setComponent(axis, restrictions.scale[AXES[axis]]);
	}
}