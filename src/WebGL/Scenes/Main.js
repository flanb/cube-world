import Experience from "webgl/Experience.js";
import Floor from "components/Floor.js";
import Cube from "components/Cube/Cube.js";
import Platform from "components/Platform.js";
import { Vector3 } from "three";

export default class Main {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floor = new Floor();
      this.cube = new Cube();

      new Platform(new Vector3(3, 2, 0), new Vector3(2, 0.25, 2));
      new Platform(new Vector3(5, 4, 0), new Vector3(2, 0.25, 2));
    });
  }

  update() {
    if (this.cube) this.cube.update();
  }
}
