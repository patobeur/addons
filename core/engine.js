import * as THREE from "three";
import { PluginManager } from "./pluginManager.js";
import { EventBus } from "./bus.js";

export class Engine {
	constructor() {
		this.bus = new EventBus();
		// this.canvas = canvas;
	}
	do() {
		this.canvas = document.createElement("canvas");
		this.canvas.id = "app";
		document.body.prepend(this.canvas);
		let canvas = this.canvas;
		this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
		this.camera.position.set(3, 2, 5);

		this.clock = new THREE.Clock();
		this.pm = new PluginManager(this);

		// Décor de base
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(5, 10, 7);
		this.scene.add(new THREE.AmbientLight(0xffffff, 0.5), light);

		window.addEventListener("resize", () => this.#resize());
		this.#resize();
	}
	get THREE() {
		return THREE;
	}

	async init() {
		this.do();
		// Charge la liste d'addons (si le fichier manque/échoue → noyau OK quand même)
		await this.pm.loadFromManifest("/addons/addons.json");
		this.bus.emit("core:ready");
	}

	start() {
		this.clock.start();
		const loop = () => {
			const dt = this.clock.getDelta();
			this.bus.emit("tick:before", { dt });
			this.pm.update(dt);
			this.bus.emit("tick:after", { dt });
			this.renderer.render(this.scene, this.camera);
			this._raf = requestAnimationFrame(loop);
		};
		loop();
	}

	stop() {
		cancelAnimationFrame(this._raf);
		this.pm.dispose();
	}

	#resize() {
		const w = this.canvas.clientWidth || window.innerWidth;
		const h = this.canvas.clientHeight || window.innerHeight;
		this.renderer.setSize(w, h, false);
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
		this.bus.emit("resize", {
			width: this.renderer.domElement.width,
			height: this.renderer.domElement.height,
		});
	}
}
