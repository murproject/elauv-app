export default class Panel {

  constructor(name) {
    this.begin();
    this.inject();
    this.init();

    console.log(this);
  }

  init() {
    console.error("Empty panel init!");
  }

  inject() {
    this.container = document.createElement("div");
    this.container.classList.add("panel");
    this.container.innerHTML = this.html;
    document.querySelector("#panel-wrapper").appendChild(this.container);

    this.panelButton = document.createElement("button");
    this.panelButton.onclick = () => document.app.panelSelect(this.name);
    this.panelButton.innerText = this.name;
    document.querySelector("#buttons-main").appendChild(this.panelButton);

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

    this.onActiveChanged();
  }

  onActiveChanged() {}

  setInterval(func, timeout) {
    return window.setInterval(() => { this[func.name]() }, timeout);
  }

}