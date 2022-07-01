import Element from './Element.js'
import Icon from '/src/components/Icon'

export default class Button extends Element {
  static get defaultClasses() {
    return [];
  }

  static get tag() {
    return 'push-button'
  }

  init() {
    this.actionTimeout = 50;
    this.setIcon(this.attrs.icon, this.attrs.iconColor, this.attrs.iconClasses);
  }

  static get defaultAttrs() {
    return {
      name: this.constructor.name,
      text: this.constructor.name,
      type: 'push-button',
      action: undefined,
      icon: undefined,
      enabled: true,
      timeout: 0,
      classes: undefined,
      iconcolor: 'dark',
      iconclasses: ''
    };
  }

  setEnabled(isEnabled) {
    this.setClass('disabled', !isEnabled);
  }

  setActive(isActive) {
    this.setClass('active', isActive);
  }

  setIcon(name, color = 'dark', modifier = 'big') {
    this.attrs.icon = name;
    this.attrs.iconColor = color;
    this.attrs.iconClasses = modifier;

    this.icon = this.attrs.icon ? Icon(this.attrs.icon, this.attrs.iconClasses, this.attrs.iconColor) : '';
    this.update();
  }

  setText(text) {
    this.setAttribute('text', text);
  }

  render() {
    this.setClass(this.attrs.type);
    this.applyClasses(this.attrs.classes);

    return /*html*/`
      ${this.icon}
      <span class="caption">${this.attrs.text}</span>
    `;
  }
}

Button.register();