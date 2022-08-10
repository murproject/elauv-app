import App from "/src/App.js";
import Panel from './Panel'
import Button from '../components/Button';
import CheckBox from "../components/CheckBox";
import SettingsStorage from "/src/utils/SettingsStorage";

export default class Settings extends Panel {

  begin() {
    this.name = "Настройки";
    this.addTab = false;

    this.html = /*html*/`
      <div class="container">
        <h1 class="text-center">Настройки приложения</h1>
        <div id="app-settings-buttons" class="fit-center margin-bottom"></div>

        <h1 class="text-center">Настройки аппарата</h1>
        <div id="settings-action-buttons" class="row"></div>
        <div id="vehicle-action-buttons" class="row"></div>
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
    this.appSettingsButtons = this.q('#app-settings-buttons');

    // TODO: use global dialog to confirm

    /* app settings */

    const checkboxes = [
      {
        text: 'Вибрация при ударах',
        icon: 'vibrate',
        setting: 'vibrateOnTap',
      },
      {
        text: 'Включить 3D-визуализацию',
        icon: 'rotate-3d',
        setting: 'disableVizAuv',
      },
      {
        text: 'Расширенные блоки математики',
        icon: 'square-root',
        setting: 'extendedMath',
      },
      {
        text: 'Расширенная телеметрия',
        icon: 'format-list-bulleted-square',
        setting: 'extendedTelemetry',
      },
    ];

    checkboxes.forEach(checkbox => {
      new CheckBox({
        text: checkbox.text,
        icon: checkbox.icon,
        checked: SettingsStorage.get(checkbox.setting),
        action: (state) => {
          SettingsStorage.set(checkbox.setting, state);
        },
      }).inject(this.appSettingsButtons);
    });

    new Button({
      text: 'Перезапустить приложение',
      action: () => {
        location.reload();
      },
      icon: 'replay',
      // classes: 'button-vertical'
    }).inject(this.appSettingsButtons);

    /* Vehicle settings */

    new Button({
      text: 'Получить настройки',
      action: () => {},
      icon: 'format-list-bulleted-square',
      classes: 'button-vertical'
    }).inject(this.settingsButtons);

    new Button({
      text: 'Записать настройки',
      action: () => {},
      icon: 'content-save',
      classes: 'button-vertical'
    }).inject(this.settingsButtons);

    new Button({
      text: 'Очистить настройки',
      action: () => {},
      icon: 'trash-can',
      classes: 'button-vertical'
    }).inject(this.settingsButtons);

    new Button({
      text: 'Нагрузка процессора',
      action: () => {},
      icon: 'clipboard-list-outline',
      classes: 'button-vertical'
    }).inject(this.vehicleButtons);

    new Button({
      text: 'Перезагрузить аппарат',
      action: () => {},
      icon: 'power',
      classes: 'button-vertical'
    }).inject(this.vehicleButtons);

    new Button({
      text: 'Калибровка нав.датчика',
      action: () => {},
      icon: 'rotate-orbit',
      classes: 'button-vertical'
    }).inject(this.vehicleButtons);
  }
}