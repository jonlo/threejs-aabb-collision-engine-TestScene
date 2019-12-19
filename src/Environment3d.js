
export class Environment3d {
	constructor(scene3d) {
		this.scene3d = scene3d;
		window.addEventListener('resize', () => {
			this.onWindowResize();
		}, false);
		this.animate();
	}

	animate() {
		requestAnimationFrame(() => this.animate());
		this.scene3d.animate();
	}

	onWindowResize() {
		this.scene3d.onWindowResize();
	}
}