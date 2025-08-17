export class PluginManager {
	constructor(engine) {
		this.engine = engine;
		this.plugins = [];
	}

	async loadFromManifest(url) {
		try {
			const res = await fetch(url, { cache: "no-store" });
			if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
			const list = await res.json();
			if (!Array.isArray(list))
				throw new Error("Manifest must be an array.");

			for (const entry of list) {
				const path = typeof entry === "string" ? entry : entry?.path;
				const enabled =
					typeof entry === "object" ? entry?.enabled !== false : true;
				if (!path || !enabled) continue;
				await this.#loadPlugin(path);
			}
		} catch (e) {
			console.warn(
				"[addons] manifest manquant/illisible — noyau OK sans addons.",
				e
			);
		}
	}

	async #loadPlugin(path) {
		try {
			const mod = await import(path);
			const factory = mod.default ?? mod.createPlugin;
			if (typeof factory !== "function") {
				console.warn(
					`[addons] ${path} n'exporte pas de factory par défaut.`
				);
				return;
			}
			const plugin = factory(this.engine);
			if (!plugin || typeof plugin !== "object") {
				console.warn(`[addons] ${path} a renvoyé un plugin invalide.`);
				return;
			}
			plugin.id ??= path;
			try {
				plugin.onInit?.();
			} catch (e) {
				console.error(`[addons] onInit ${plugin.id} a échoué`, e);
			}
			this.plugins.push(plugin);
			console.log(`[addons] chargé: ${plugin.id}`);
		} catch (e) {
			console.warn(`[addons] échec import ${path} — ignoré.`, e);
		}
	}

	// Dans PluginManager (variante Vite, à la place de loadFromManifest)
	// Avec cette variante, déposer un nouveau fichier dans /core/adds suffit (zéro config).
	// // Il faut en revanche passer par Vite (ou un bundler qui expose import.meta.glob).
	// async loadAllWithViteGlob() {
	// 	const modules = import.meta.glob("/addons/**/*.js");
	// 	for (const path in modules) {
	// 		try {
	// 			const mod = await modules[path]();
	// 			const factory = mod.default ?? mod.createPlugin;
	// 			if (typeof factory !== "function") continue;
	// 			const plugin = factory(this.engine);
	// 			plugin.id ??= path;
	// 			plugin.onInit?.();
	// 			this.plugins.push(plugin);
	// 		} catch (e) {
	// 			console.warn("[addons] échec import", path, e);
	// 		}
	// 	}
	// }

	update(dt) {
		for (const p of this.plugins) {
			try {
				p.onUpdate?.(dt);
			} catch (e) {
				console.error(`[addons] onUpdate ${p.id} a planté`, e);
			}
		}
	}

	dispose() {
		for (const p of this.plugins) {
			try {
				p.onDispose?.();
			} catch (_) {}
		}
		this.plugins.length = 0;
	}
}
