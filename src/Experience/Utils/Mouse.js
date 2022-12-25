export default class Mouse {
  constructor() {
    this.cursor = {
      x: 0,
      y: 0,
    };

    this.setEvents();
  }

  setEvents() {
    addEventListener("touchmove", (event) => {
      event.preventDefault();
      this.onMouve(event.touches[0]);
    });

    addEventListener("mousemove", (event) => {
      this.onMouve(event);
    });
  }

  onMouve(event) {
    this.cursor.x = (event.clientX / window.innerWidth - 0.5) * 2;
    this.cursor.y = (event.clientY / window.innerHeight - 0.5) * 2;
  }
}
