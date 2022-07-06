import App from "/src/App.js";
import Icon from '/src/components/Icon';
import Button from '../components/Button';

export default class Panel {

  constructor() {
    this.name = this.constructor.name;
    this.html = ``;
    this.isBottomPanel = false;
    this.noTitle = false;

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

    this.panelButton = new Button({
      name: this.name,
      text: '',
      type: 'panel-button',
      action: () => {
        setTimeout(
          () => App.panelSelect(this, this.isBottomPanel ? 'bottom' : 'main'),
          50
        );
      }
    });

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
      if (!this.isBottomPanel) {
        App.setTitle(this.noTitle ? '' : this.name);
      }
    } else {
      this.container.classList.remove('active');
    }

    this.onActiveChanged(state);
  }

  onActiveChanged(isActive) {}

  setInterval(func, timeout) {
    return window.setInterval(() => { this[func.name]() }, timeout);
  }

  setIcon(name, color, modifier='') {
    this.panelButton.setIcon(name, color, 'big ' + modifier); // TODO //
  }

}