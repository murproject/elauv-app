import App from '/src/App.js';
import Panel from './Panel';
import Button from '../components/Button';
import CheckBox from '../components/CheckBox';
import SettingsStorage from '/src/utils/SettingsStorage';
import GlobalDialog from '/src/components/GlobalDialog.js';
import TextInput from '/src/components/TextInput';
import mur from '/src/vehicle/api.js';
import protocol from '/src/vehicle/protocol';
import AppVersion from '/src/utils/AppVersion';
import ProjectsStorage from '/src/utils/ProjectsStorage';

export default class Settings extends Panel {
  begin() {
    this.name = 'Настройки';
    this.addTab = AppVersion.isDevBuild;

    this.html = /*html*/`
      <div class="container">
        <div class="list-wrapper">
          <div id="vehicle-settings">
            <h1 class="text-center">Настройки аппарата</h1>
            <div id="settings-inputs-container" class="monospace-all"></div>
            <pre id="diag-log-text" class="monospace fit-center"></pre>
            <div id="settings-action-buttons" class="row"></div>
            <div id="vehicle-action-buttons" class="row"></div>
          </div>

          <div id="app-settings">
            <h1 class="text-center">Настройки приложения</h1>
            <div id="app-settings-buttons" class="fit-center margin-auto"></div>
          </div>
        </div>
      </div>
    `;
  }

  init() {
    this.setIcon('wrench');
    this.fields = {};
    this.makeButtons();
  }

  makeButtons() {
    this.settingsButtons = this.q('#settings-action-buttons');
    this.vehicleButtons = this.q('#vehicle-action-buttons');
    this.appSettingsButtons = this.q('#app-settings-buttons');

    /* App settings */

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
      // TODO: use extended math setting
      // {
      //   text: 'Расширенные блоки математики',
      //   icon: 'square-root',
      //   setting: 'extendedMath',
      // },
      {
        text: 'Расширенная телеметрия',
        icon: 'format-list-bulleted-square',
        setting: 'extendedTelemetry',
      },
    ];

    checkboxes.forEach((checkbox) => {
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
      action: () => this.confirm(() => location.reload(), 'Перезапустить приложение'),
      icon: 'replay',
    }).inject(this.appSettingsButtons);

    /* Vehicle settings */

    if (!AppVersion.isDevBuild) {
      this.q('#vehicle-settings').innerText = '';
      return;
    }

    const buttons = [
      {
        text: 'Получить настройки',
        action: () => mur.controlGetAllSettings(),
        icon: 'format-list-bulleted-square',
        parent: this.settingsButtons,
      },
      {
        text: 'Записать настройки',
        action: () => this.sendVehicleSettings(),
        icon: 'content-save',
        parent: this.settingsButtons,
      },
      {
        text: 'Очистить настройки',
        action: () => mur.controlErase(),
        icon: 'trash-can',
        parent: this.settingsButtons,
      },
      {
        text: 'Системная информация',
        action: () => mur.controlDiagnosticInfo(),
        icon: 'clipboard-list-outline',
        parent: this.vehicleButtons,
      },
      {
        text: 'Перезагрузить аппарат',
        action: () => mur.controlReboot(),
        icon: 'power',
        parent: this.vehicleButtons,
      },
      {
        text: 'Сбросить бат.&nbsp;датчик',
        action: () => mur.controlBatteryReset(),
        icon: 'battery-alert',
        parent: this.vehicleButtons,
      },
      {
        text: 'Сбросить статистику',
        action: () => {
          localStorage.rsocStats = '[]';
          location.reload();
        },
        parent: this.appSettingsButtons,
      },
      {
        text: 'Сохранить статистику',
        action: () => ProjectsStorage.saveFile('ElAUV Stats - ' + Date.now(), localStorage.rsocStats),
        parent: this.appSettingsButtons,
      },
    ];

    if (AppVersion.isDevBuild) {
      buttons.forEach((button) => {
        new Button({
          text: button.text,
          action: () => this.confirm(button.action, button.text),
          icon: button.icon,
          classes: 'button-vertical',
        }).inject(button.parent);
      });
    }
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
            }, () => {
              App.closeGlobalDialog(); action();
            }),
            new Button({
              text: 'Назад',
              icon: 'keyboard-return',
            }, () => App.closeGlobalDialog()),
          ],
        }),
    );
  }

  makeSettingsFields(settings) {
    this.inputsContainer = this.q('#settings-inputs-container');
    this.inputsContainer.innerText = '';

    const fields = Object.keys(settings);

    fields.forEach((item) => {
      if (item === 'type') {
        return;
      }

      this.makeField(item, JSON.stringify(settings[item]));
    });
  }

  makeField(key, value) {
    const input = new TextInput({
      title: key,
      text: value,
    });

    input.inject(this.inputsContainer);
    this.fields[key] = input;
  }

  onSettingsReceived(settings) {
    this.makeSettingsFields(settings);
  }

  getSetting(key) {
    return JSON.parse(this.fields[key].getText());
  }

  sendSettingsPacket(type, fields) {
    const payload = {};

    fields.forEach((key) => {
      payload[key] = this.getSetting(key);
    });

    mur[type](payload);
  }

  sendVehicleSettings() {
    if (Object.keys(this.fields).length == 0) {
      return;
    }

    this.sendSettingsPacket('controlMotorsSettings', [
      'motorsPorts',
      'motorsMultipliers',
      'motorsOffsetPositive',
      'motorsOffsetNegative',
      'yawPidI',
      'yawPidD',
      'yawPidStabMaxErr',
      'yawPidStabWaitMs',
    ]);

    this.sendSettingsPacket('controlBatterySettingsUpdate', [
      'fuelGaugeBattCapacity',
      'fuelGaugeTerminateVolts',
      'fuelGaugeTaperCurrent',
      'fuelGaugeSocMin',
      'fuelGaugeSocMax',
    ]);

    this.sendSettingsPacket('controlImuSettingsUpdate', [
      'imuTapTimeout',
      'imuTapThreshold',
    ]);

    setTimeout(() => mur.controlGetAllSettings(), 1000);
  }

  onDiagnosticLogReceived(info) {
    const text = `
- - -  FreeRTOS Stats  - - -
${info.text}
- - - Vehicle Revision - - -
Hardware rev:   0x${protocol.prettyHex([info.hardwareRev])}
Software rev:   ${info.softwareRevMajor}.${info.softwareRevMinor.toFixed(0).padStart(2, '0')}
Build date:     ${info.buildDate}
Build time:     ${info.buildTime}

- - -  Sensors Status  - - -
Imu started:    ${info.imuStarted}
Gauge started:  ${info.voltmeterStarted}

Bat Cap Remain: ${info.battRemainCapacity}
Bat Cap Full:   ${info.battFullCapacity}
Bat Cap Design: ${info.battDesignCapacity} mAh

Bat Power:      ${info.battPower} mW
Bat Health:     ${info.battHealth}%

`;
    this.q('#diag-log-text').innerText = text;
  }
}
