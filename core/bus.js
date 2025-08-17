// core/bus.js
export class EventBus {
	#map = new Map();
	on(name, fn) {
		let set = this.#map.get(name);
		if (!set) this.#map.set(name, (set = new Set()));
		set.add(fn);
		return () => this.off(name, fn);
	}
	once(name, fn) {
		const off = this.on(name, (...a) => {
			off();
			fn(...a);
		});
		return off;
	}
	off(name, fn) {
		const set = this.#map.get(name);
		if (!set) return;
		set.delete(fn);
		if (!set.size) this.#map.delete(name);
	}
	emit(name, payload) {
		// "*" reçoit (name, payload)
		const any = this.#map.get("*");
		if (any)
			for (const fn of [...any])
				try {
					fn(name, payload);
				} catch (e) {
					console.error(e);
				}
		const set = this.#map.get(name);
		if (!set) return 0;
		let n = 0;
		for (const fn of [...set]) {
			try {
				fn(payload);
				n++;
			} catch (e) {
				console.error(e);
			}
		}
		return n;
	}
	clear() {
		this.#map.clear();
	}
}
