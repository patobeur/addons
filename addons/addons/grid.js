export default (engine) => {
	const { THREE, scene } = engine;
	let grid;
	return {
		id: "grid",
		onInit() {
			const grid = new THREE.GridHelper(20, 20);
			grid.material.opacity = 0.25;
			grid.material.transparent = true;
			scene.add(grid);
		},
		onUpdate(dt) {
			//if (grid) grid.rotation.y += dt;
		},
		onDispose() {
			if (!grid) return;
			scene.remove(grid);
			grid.geometry.dispose();
			grid.material.dispose();
		},
	};
};
