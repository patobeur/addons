import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default (engine) => {
	let controls;
	return {
		id: "orbit-controls",
		onInit() {
			controls = new OrbitControls(
				engine.camera,
				engine.renderer.domElement
			);
			controls.enableDamping = true;
		},
		onUpdate() {
			controls?.update();
		},
		onDispose() {
			controls?.dispose();
		},
	};
};
