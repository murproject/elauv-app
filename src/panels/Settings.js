import App from "/src/App.js";
import Panel from './Panel'
import Button from '../components/Button';

export default class Settings extends Panel {

  begin() {
    this.name = "Настройки";
    this.addTab = false;

    this.html = /*html*/`
      <div class="container">
        <h1>Настройки приложения</h1>

        <h1>Настройки аппарата</h1>

        <div id="settings-action-buttons" class="row"> </div>
        <div id="vehicle-action-buttons" class="row"> </div>
      </div>
    `
  }

  init() {
    this.setIcon('wrench');
    this.makeButtons();
  }

  makeButtons() {
    this.settingsButtons = this.q('#settings-action-buttons');
    this.vehicleButtons = this.q('#vehicle-action-buttons');

    // TODO: use global dialog to confirm

    new Button({
      name: 'load-settings',
      text: 'Получить настройки',
      action: () => {},
      icon: 'format-list-bulleted-square',
      classes: 'button-vertical'
    }).inject(this.settingsButtons);

    new Button({
      name: 'save-settings',
      text: 'Записать настройки',
      action: () => {},
      icon: 'content-save',
      classes: 'button-vertical'
    }).inject(this.settingsButtons);

    new Button({
      name: 'wipe-settings',
      text: 'Очистить настройки',
      action: () => {},
      icon: 'trash-can',
      classes: 'button-vertical'
    }).inject(this.settingsButtons);

    new Button({
      name: 'diagnostic-log',
      text: 'Нагрузка процессора',
      action: () => {},
      icon: 'clipboard-list-outline',
      classes: 'button-vertical'
    }).inject(this.vehicleButtons);

    new Button({
      name: 'reboot-vehicle',
      text: 'Перезагрузить аппарат',
      action: () => {},
      icon: 'power',
      classes: 'button-vertical'
    }).inject(this.vehicleButtons);

    new Button({
      name: 'recalibrate-imu',
      text: 'Калибровка нав.датчика',
      action: () => {},
      icon: 'rotate-orbit',
      classes: 'button-vertical'
    }).inject(this.vehicleButtons);
  }
}