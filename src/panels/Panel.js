import Icon from '/src/components/Icon';
import Button from '../components/Button';

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

    this.panelButton = new Button(
      this.name,
      '',
      'panel-button',
      () => document.app.panelSelect(this)
    );

    this.panelButton.inject(document.querySelector("#buttons-main"));
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
    this.panelButton.setActive(state);

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

  setIcon(name, color, modifier='') {
    this.panelButton.setIcon(name, 'big ' + modifier, color); // TODO //
  }

}