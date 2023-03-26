import Experience from "./Experience.js";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import EventEmitter from "utils/EventEmitter.js";
export default class PhysicsWorld extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.debug = this.experience.debug;

    this.gravity = {
      x: 0,
      y: -1,
      z: 0,
    };

    this.setInstance();
    if (this.debug.active) this.setDebug();
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: "physicsWorld",
        expanded: true,
      });
    }

    this.debugFolder
      .addInput(this.gravity, "x", {
        label: "gravityX",
        min: -10,
        max: 10,
        step: 0.1,
      })
      .on("change", () => {
        this.instance.gravity.x = this.gravity.x;
      });
    this.debugFolder
      .addInput(this.gravity, "y", {
        label: "gravityY",
        min: -10,
        max: 10,
        step: 0.1,
      })
      .on("change", () => {
        this.instance.gravity.y = this.gravity.y;
      });
    this.debugFolder
      .addInput(this.gravity, "z", {
        label: "gravityZ",
        min: -10,
        max: 10,
        step: 0.1,
      })
      .on("change", () => {
        this.instance.gravity.z = this.gravity.z;
      });

    this.debugFolder
      .addButton({
        title: "cannonDebuggerVisible",
      })
      .on("click", () => {
        if (!this.cannonDebugger) {
          this.cannonDebugger = new CannonDebugger(
            this.experience.scene,
            this.instance,
            {
              onInit: (body, mesh) => {
                this.on("cannonDebuggerVisible", () => {
                  mesh.visible = !mesh.visible;
                });
              },
            }
          );
        }
        this.trigger("cannonDebuggerVisible");
      });
  }

  setInstance() {
    this.instance = new CANNON.World();
    this.instance.gravity.set(this.gravity.x, this.gravity.y, this.gravity.z);
    this.instance.broadphase = new CANNON.NaiveBroadphase();
  }

  addBody(_body) {
    this.instance.addBody(_body);
  }

  update() {
    this.instance.step(1 / 60, this.experience.time.delta, 3);
    if (this.cannonDebugger) this.cannonDebugger.update();
  }
}
