import icon from '/src/utils/icon'

export default class Panel {

  constructor() {
    this.name = this.constructor.name;
    this.html = ``;

    this.begin();
    this.inject();
    this.init();
  }

  begin() {}

  inject() {
    this.container = document.createElement("div");
    this.container.classList.add("panel");
    this.container.innerHTML = this.html;
    document.querySelector("#panel-wrapper").appendChild(this.container);

    this.panelButton = document.createElement("div");
    this.panelButton.classList.add("panel-button");
    this.panelButton.onclick = () => document.app.panelSelect(this);
    this.panelButton.innerText = this.name;
    document.querySelector("#buttons-main").appendChild(this.panelButton);

    this.setActive(false);
  }

  init() {}

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
      this.panelButton.classList.add('active');
    } else {
      this.container.classList.remove('active');
      this.panelButton.classList.remove('active');
    }

    this.onActiveChanged();
  }

  onActiveChanged() {}

  setInterval(func, timeout) {
    return window.setInterval(() => { this[func.name]() }, timeout);
  }

  setIcon(name, color) {
    this.panelButton.innerHTML = icon(name, 'big', color); // TODO //
  }

}