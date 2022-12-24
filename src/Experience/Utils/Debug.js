import { Pane } from "tweakpane";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default class Debug {
  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.ui = new Pane();

      this.stats = Stats();
      document.body.appendChild(this.stats.dom);
    }
  }

  update() {
    if (this.active) {
      this.stats.update();
    }
  }
}
