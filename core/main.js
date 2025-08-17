import { Engine } from "./engine.js";

//const canvas = document.getElementById("app");
// const engine = new Engine({ canvas });
const engine = new Engine();

engine.init().then(() => engine.start());
