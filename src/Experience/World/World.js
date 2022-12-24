import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Cube from "./Cube.js";
import { Vector3 } from "three";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.environment = new Environment();

    this.floor = new Floor();
    this.cube = new Cube(new Vector3(0, 2, 0));
  }

  update() {
    this.cube.update();
    this.floor.update();
  }
}
