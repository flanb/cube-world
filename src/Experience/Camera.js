import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PerspectiveCamera } from "three";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.mouse = this.experience.mouse;

    this.setInstance();

    if (this.followObject) return;
    this.setControls();
  }

  setInstance() {
    this.instance = new PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(6, 4, 8);
    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
  }

  follow(_follow) {
    this.followObject = _follow;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    if (this.followObject) {
      this.instance.position.copy(this.followObject.position);
      this.instance.position.x += this.mouse.cursor.x * 3;
      this.instance.position.y += this.mouse.cursor.y * 3;
      this.instance.position.y += 5;
      this.instance.position.z += 10;
      this.instance.lookAt(
        this.followObject.position.x,
        this.followObject.position.y,
        this.followObject.position.z
      );
      return;
    }
    this.controls.update();
  }
}
