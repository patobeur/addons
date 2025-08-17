export default (engine) => {
	const down = (e) =>
		engine.bus.emit("input:down", {
			key: e.key,
			code: e.code,
			alt: e.altKey,
			ctrl: e.ctrlKey,
			shift: e.shiftKey,
		});
	const up = (e) => engine.bus.emit("input:up", { key: e.key, code: e.code });
	return {
		id: "input-keys",
		onInit() {
			window.addEventListener("keydown", down);
			window.addEventListener("keyup", up);
		},
		onDispose() {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
		},
	};
};
