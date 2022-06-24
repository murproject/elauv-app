import Icon from '/src/components/Icon';
import Button from '../components/Button';

export default class Panel {

  constructor() {
    this.name = this.constructor.name;
    this.html = ``;
    this.isBottomPanel = false;

    this.begin();
    this.inject();
    this.init();
  }

  begin() {}

  inject() {
    const wrapperPrefix = this.isBottomPanel ? "bottom" : "main"
    this.wrapperPanel = document.querySelector(`#${wrapperPrefix}-panel-wrapper`);
    this.wrapperButtons = document.querySelector(`#buttons-${wrapperPrefix}`);

    this.container = document.createElement("div");
    this.container.classList.add("panel");
    this.container.innerHTML = this.html;
    this.wrapperPanel.appendChild(this.container);

    this.panelButton = new Button(
      this.name,
      '',
      'panel-button',
      () => document.app.panelSelect(this, this.isBottomPanel ? 'bottom' : 'main')
    );

    if (this.wrapperButtons) {
      this.panelButton.inject(this.wrapperButtons);
    }

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