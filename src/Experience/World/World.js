import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Cube from "./Cube.js";
import { Vector3 } from "three";
import Platforms from "./Platforms.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.environment = new Environment();

    this.floor = new Floor();
    this.cube = new Cube(new Vector3(0, 2, 0));

    new Platforms([
      {
        position: { x: 0, y: 1, z: -1 },
        scale: { x: 1, y: 0.1, z: 1 },
      },
      {
        position: { x: 0, y: 2, z: -2 },
        scale: { x: 2, y: 0.1, z: 1 },
      },
      {
        position: { x: 0, y: 3, z: -3 },
        scale: { x: 3, y: 0.1, z: 1 },
      },
      {
        position: { x: 0, y: 4, z: -6 },
        scale: { x: 4, y: 0.1, z: 4 },
      },
    ]);
  }

  update() {
    this.cube.update();
    this.floor.update();
  }
}
