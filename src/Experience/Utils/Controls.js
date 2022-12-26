export default class Controls {
  constructor() {
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      Shift: false,
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
