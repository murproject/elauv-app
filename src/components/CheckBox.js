import Button from "/src/components/Button";
import Element from '/src/components/Element.js'
import Icon from '/src/components/Icon';

export default class CheckBox extends Button {
  static get tag() {
    return 'check-box'
  }

  init() {
    this.actionTimeout = 50;
    this.updateCheckIcon();
    this.setIcon(this.attrs.icon, this.attrs.iconColor, this.attrs.iconClasses);
  }

  static get defaultAttrs() {
    return {
      name: this.constructor.name,
      text: this.constructor.name,
      type: 'check-box',
      action: undefined,
      // checkAction: undefined,
      icon: undefined,
      enabled: true,
      checked: false,
      timeout: 0,
      // classes: undefined,
      iconColor: 'dark',
      iconClasses: 'mini',
      // scanHelper: false,
      // scanHelperBounce: false,
    };
  }

  setAction(action, actionTimeout = undefined) {
    this.attrs.action = action;
    if (actionTimeout !== null && actionTimeout !== undefined) {
      this.actionTimeout = actionTimeout;
    }

    this.onclick = () => setTimeout(() => this.checkAction(), this.actionTimeout);
  }

  checkAction() {
    this.toggle();
    if (this.attrs.action) {
      this.attrs.action(this.getChecked());
    }
  }

  toggle() {
    this.attrs.checked = !this.attrs.checked;
    this.updateCheckIcon();
    this.update();
  }

  setChecked(isChecked = true) {
    this.attrs.checked = isChecked;
  }

  getChecked() {
    return this.attrs.checked;
  }

  updateCheckIcon() {
    this.check = Icon(this.attrs.checked ? 'checkbox-outline' : 'checkbox-blank-outline', this.attrs.iconClasses, this.attrs.iconColor)
  }

  render() {
    this.setClass(this.attrs.type);
    this.applyClasses(this.attrs.classes);

    return /*html*/`
      ${this.check}
      ${this.icon}
      <span class="caption">${this.attrs.text}</span>
    `;
  }
}

CheckBox.register();