import Element from './Element.js';
import Icon from '/src/components/Icon';
import Utils from '/src/utils/Utils';

const icons = {
  online: Icon('antenna', 'green-bright'),
  offline: Icon('checkbox-blank-circle-outline', 'dark', 'opacity-25'),
  active: Icon('checkbox-marked-outline'),
  paired: Icon('content-save'),
};

export default class DeviceListItem extends Element {
  static get defaultClasses() {
    return ['list-item', 'device-item'];
  }

  static get tag() {
    return 'device-list-item';
  }

  init() {
    this.actionTimeout = 50;
  }

  static get defaultAttrs() {
    return {
      name: '',
      address: '',
      isOnline: false,
      isCompatible: false,
    };
  }

  render() {
    this.setClass('inactive', !this.attrs.isCompatible);

    const nameDivider = this.attrs.name.search('-');

    const deviceName = this.attrs.isCompatible ?
      this.attrs.name.substring(0, nameDivider) : this.attrs.name;

    const shortId = this.attrs.isCompatible ?
      this.attrs.name.substring(nameDivider + 1) : '';

    return /*html*/`
      <div class="device-title list-item-title">
        <div>${deviceName}</div>
        <div class="bold">${shortId}</div>
        <div class="monospace text-tiny ${this.attrs.isCompatible ? 'opacity-25' : ''}">
          [${this.attrs.address}]
        </div>
      </div>
    `;
  }
}

DeviceListItem.register();
