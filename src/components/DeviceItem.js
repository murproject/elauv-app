import Element from './Element.js'
import Icon from '/src/components/Icon'
import Utils from "/src/utils/Utils";

export default class DeviceListItem extends Element {
  static get defaultClasses() {
    return ['list-item', 'device-item'];
  }

  static get tag() {
    return 'device-list-item'
  }

  init() {
    this.actionTimeout = 50;
  }

  static get defaultAttrs() {
    return {
      name: '',
      address: '',
      isActive: false,
      isOnline: false,
      isCompatible: false,
    };
  }

  render() {
    this.setClass('inactive', !this.attrs.isCompatible);

    this.iconOnline =
      !this.attrs.isCompatible ? '' :
       this.attrs.isOnline ? Icon('antenna', 'green-bright') : Icon('checkbox-blank-circle-outline', 'dark', 'opacity-25')

    this.iconStatus =
      !(this.attrs.isPaired || this.attrs.isActive) ? '' :
        this.attrs.isActive ? Icon('checkbox-marked-outline') : Icon('content-save');

    const nameDivider = this.attrs.name.search('-');

    const deviceName = this.attrs.isCompatible ?
      this.attrs.name.substring(0, nameDivider) : this.attrs.name;

    const shortId = this.attrs.isCompatible ?
      this.attrs.name.substring(nameDivider + 1) : '';

    return /*html*/`
      <span class="device-tag">
        ${this.iconOnline}
      </span>

      <div class="device-title">
        <div>${deviceName}</div>
        <div class="bold">${shortId}</div>
        <div class="monospace text-tiny ${this.attrs.isCompatible ? 'opacity-25' : ''}">
          [${this.attrs.address}]
        </div>
      </div>

      <span class="device-tag">
        ${this.iconStatus}
      </span>
    `
  }

}

DeviceListItem.register();
