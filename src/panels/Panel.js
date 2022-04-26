export default class Panel {

  constructor(id) {
    this.inject();
    this.init();
  }

  init() {
    console.error("Empty panel init!");
  }

  inject() {
    this.container = document.createElement("div");
    this.container.classList.add("panel");
    this.container.innerHTML = this.html();
    document.querySelector(".panel-wrapper").appendChild(this.container);

    this.setActive(false);
  }

  q(selector) {
    return this.container.querySelector(selector);
  }

  qAll(selector) {
    return this.container.querySelectorAll(selector);
  }

  setActive(state) {
    this.active = state;

    if (this.active) {
      this.container.classList.add('active');
    } else {
      this.container.classList.remove('active');
    }
  }

  setInterval(func, timeout) {
    return window.setInterval(() => { this[func.name]() }, timeout);
  }

}