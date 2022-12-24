import EventEmitter from "./EventEmitter.js";

export default class Controls extends EventEmitter {
  constructor() {
    super();

    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      " ": false,
    };

    this.setEvents();
  }

  setEvents() {
    addEventListener("keydown", (event) => {
      if (this.keys[event.key] !== undefined) {
        this.keys[event.key] = true;
      }
    });

    addEventListener("keyup", (event) => {
      if (this.keys[event.key] !== undefined) {
        this.keys[event.key] = false;
      }
    });
  }
}
