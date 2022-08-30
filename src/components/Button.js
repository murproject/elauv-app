import Element from './Element.js';
import Icon from '/src/components/Icon';

export default class Button extends Element {
  static get defaultClasses() {
    return [];
  }

  static get tag() {
    return 'push-button';
  }

  init() {
    this.actionTimeout = 50;
    this.setIcon(this.attrs.icon, this.attrs.iconColor, this.attrs.iconClasses);
  }

  static get defaultAttrs() {
    return {
      name: this.constructor.name,
      text: this.constructor.name,
      ignore: false,
      type: 'push-button',
      action: undefined,
      icon: undefined,
      enabled: true,
      timeout: 0,
      classes: undefined,
      iconColor: 'dark',
      iconClasses: 'mini',
      scanHelper: false,
      scanHelperBounce: false,
    };
  }

  setEnabled(isEnabled) {
    this.setClass('disabled', !isEnabled);
  }

  setActive(isActive) {
    this.setClass('active', isActive);
  }

  setIcon(name, color = 'dark', modifier = 'mini') {
    this.attrs.icon = name;
    this.attrs.iconColor = color;
    this.attrs.iconclasses = modifier;

    this.icon = this.attrs.icon ? Icon(this.attrs.icon, this.attrs.iconClasses, this.attrs.iconColor) : '';
    this.update();
  }

  setText(text) {
    this.setAttribute('text', text);
  }

  render() {
    this.setClass(this.attrs.type);
    this.setClass('has-scan-helper', this.attrs.scanHelper);
    this.applyClasses(this.attrs.classes);

    if (this.attrs.scanHelper) {
      this.scanHelperIcon = Icon(
          'scan-helper',
          this.attrs.iconClasses + ' scan-helper' + (this.attrs.scanHelperBounce ? ' bounce-soft' : ''),
          this.attrs.iconColor,
      );
    } else {
      this.scanHelperIcon = '';
    }

    return /*html*/`
      ${this.icon}
      ${this.scanHelperIcon}
      <span class="caption">${this.attrs.text}</span>
    `;
  }
}

Button.register();
