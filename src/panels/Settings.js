import App from "/src/App.js";
import Panel from './Panel'
import Button from '../components/Button';
import CheckBox from "../components/CheckBox";
import SettingsStorage from "/src/utils/SettingsStorage";
import GlobalDialog from '/src/components/GlobalDialog.js';

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
        setting: 'enableVizAuv',
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
      action: () => this.confirm(() => location.reload(), "Перезапустить приложение"),
      icon: 'replay',
    }).inject(this.appSettingsButtons);

    /* Vehicle settings */

    const buttons = [
      {
        text: 'Получить настройки',
        action: () => {}, // TODO //
        icon: 'format-list-bulleted-square',
        parent: this.settingsButtons,
      },
      {
        text: 'Записать настройки',
        action: () => {}, // TODO //
        icon: 'content-save',
        parent: this.settingsButtons,
      },
      {
        text: 'Очистить настройки',
        action: () => {}, // TODO //
        icon: 'trash-can',
        parent: this.settingsButtons,
      },
      {
        text: 'Нагрузка процессора',
        action: () => {}, // TODO //
        icon: 'clipboard-list-outline',
        parent: this.vehicleButtons,
      },
      {
        text: 'Перезагрузить аппарат',
        action: () => {}, // TODO //
        icon: 'power',
        parent: this.vehicleButtons,
      },
      {
        text: 'Калибровка нав.датчика',
        action: () => {}, // TODO //
        icon: 'rotate-orbit',
        parent: this.vehicleButtons,
      }
    ];

    buttons.forEach(button => {
      new Button({
        text: button.text,
        action: () => this.confirm(button.action, button.text),
        icon: button.icon,
        classes: 'button-vertical'
      }).inject(button.parent);
    });
  }

  confirm(action, text) {
    App.showGlobalDialog(
      new GlobalDialog({
        title: 'Выполнить действие?',
        text: text,
        classes: 'text-center',
        buttons: [
          new Button({
            text: 'Да',
            icon: 'check',
          }, () => { App.closeGlobalDialog(); action() }),
          new Button({
            text: 'Назад',
            icon: 'keyboard-return',
          }, () => App.closeGlobalDialog()),
        ]
      })
    );
  }


}