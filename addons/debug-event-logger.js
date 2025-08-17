export default (engine) => {
	let off;
	return {
		id: "debug-event-logger",
		onInit() {
			off = engine.bus.on("*", (name, data) => {
				// console.log("[bus]", name, data)
			});
		},
		onDispose() {
			off?.();
		},
	};
};
