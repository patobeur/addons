export default (engine) => {
	const { THREE, scene } = engine;
	let mesh;
	return {
		id: "spin-cube",
		onInit() {
			const geo = new THREE.BoxGeometry(1, 1, 1);
			const mat = new THREE.MeshNormalMaterial();
			mesh = new THREE.Mesh(geo, mat);
			scene.add(mesh);
		},
		onUpdate(dt) {
			if (mesh) mesh.rotation.y += dt;
		},
		onDispose() {
			if (!mesh) return;
			scene.remove(mesh);
			mesh.geometry.dispose();
			mesh.material.dispose();
		},
	};
};
