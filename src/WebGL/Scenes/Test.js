import Experience from "webgl/Experience.js";
import Environment from "components/Environment.js";
import Floor from "components/Floor.js";
import Fox from "components/Fox/Fox.js";
import Cube from "components/Cube/Cube.js";

export default class Main {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floor = new Floor();
      this.fox = new Fox();
      this.cube = new Cube();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) this.fox.update();
    if (this.cube) this.cube.update();
  }
}