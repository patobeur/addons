export default (engine) => {
	const { THREE, scene } = engine;
	let off;
	function handle(payload) {
		if (payload.key !== " ") return;
		const geo = new THREE.SphereGeometry(0.25, 16, 16);
		const mat = new THREE.MeshStandardMaterial({
			metalness: 0.1,
			roughness: 0.7,
		});
		const mesh = new THREE.Mesh(geo, mat);
		mesh.position.set(
			(Math.random() - 0.5) * 5,
			0.5,
			(Math.random() - 0.5) * 5
		);
		scene.add(mesh);
		setTimeout(() => {
			scene.remove(mesh);
			geo.dispose();
			mat.dispose();
		}, 5000);
	}
	return {
		id: "spawn-sphere-on-space",
		onInit() {
			off = engine.bus.on("input:down", handle);
		},
		onDispose() {
			off?.();
		},
	};
};
