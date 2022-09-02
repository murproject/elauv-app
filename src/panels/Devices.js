import Panel from './Panel';
import mur from '/src/vehicle/api.js';
import Icon from '/src/components/Icon';
import Button from '/src/components/Button';
import DeviceListItem from '/src/components/DeviceItem';
import GlobalDialog from '/src/components/GlobalDialog';
import App from '/src/App';
import AppVersion from '/src/utils/AppVersion';
import TelemetryUtils from '/src/utils/TelemetryUtils';
import TelemetryTable from '/src/components/TelemetryTable';
import QrCodes from '/src/utils/QrCodes';

const welcomeIntro = /*html*/`
<div id="devices-welcome" class="opacity-75 margin-auto">

  <div class="text-center">
    <h1>Для начала работы:</h1>
  </div>

  <p>
    ${Icon('table-furniture')}
    Поставьте аппарат<br>
    на ровную поверхность.
  </p>

  <p>
    ${Icon('power')}
    Включите ElementaryAUV.
  </p>

  <p>
    ${Icon('timer-sand')}
    Подождите 5 секунд.
  </p>

  <p>
    ${Icon('qrcode-scan')}
    Отсканируйте код.<br>
  </p>

</div>
`;

export default class Devices extends Panel {
  begin() {
    this.name = 'Устройства';
    this.addTab = App.isMobile;

    this.html = /*html*/`
      <div class="container">

        <div id="device-connect" class="display-flex flex-column height-fill justify-content-center">
          <div class="row">
            ${welcomeIntro}
          </div>

          <div id="connDevicesListWrapper" class="list-wrapper soft-edges-vertical height-fit-content margin-zero">
            <div id="connDevicesList" class="width-fill row"></div>
          </div>

          <div id="scan-button-wrapper" class="display-flex flex-column align-items-center"></div>
        </div>

        <div id="device-info" class="display-flex flex-column height-fill hidden">
          <div class="display-flex flex-column height-fill list-wrapper soft-edges-vertical">
            <img class="vehicle-img" src="media/vehicle.png"/>
            <div id="telemetry-wrapper" class=""></div>
          </div>

          <div id="disconnect-button-wrapper" class="row buttons-collapsed justify-content-space-around align-items-center">
            <div class="telemetry-logo display-flex flex-column flex-equal text-center">
              <a href="#" id="mur-site-link">
                <img src="media/logo.png" />
                <br>
                murproject.com/elauv
              </a>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  init() {
    this.wasConnected = false;

    mur.onDiscard = () => this.onClientDiscard();

    this.battIconName = 'bluetooth';
    this.oldBattIconName = this.battIconName;
    this.setIcon(this.battIconName);

    this.devicesListEl = this.q('#connDevicesList');
    this.welcomeEl = this.q('#devices-welcome');
    this.buttonsWrapper = this.q('#buttonsRow');
    this.telemetryTable = new TelemetryTable();
    this.telemetryTable.inject(this.q('#telemetry-wrapper'));

    this.buttonScanCode = new Button({
      name: 'scan-code',
      text: 'Сканировать код',
      action: () => this.scanCode(),
      icon: 'qrcode',
      iconClasses: 'giant opacity-75',
      classes: ['button-vertical', 'extra-padding'],
      scanHelper: true,
      scanHelperBounce: true,
    });

    this.buttonScanCode.inject(this.q('#scan-button-wrapper'));

    this.buttonScanDevices = new Button({
      name: 'scan-bluetooth',
      text: 'Поиск устройств',
      action: () => this.scanDevices(),
      icon: 'broadcast',
    });

    this.buttonScanDevices.inject(this.q('#scan-button-wrapper'));

    this.buttonDisconnect = new Button({
      name: 'disconnect',
      text: 'Отключить',
      action: () => this.disconnect(),
      icon: 'broadcast-off',
    });

    this.buttonDisconnect.inject(this.q('#disconnect-button-wrapper'));

    if (mur.conn.type === 'bluetooth') {
      mur.conn.onDeviceDiscovered = (devices) => this.onUpdateDevicesList(devices);
    }

    this.q('#mur-site-link').onclick = () => AppVersion.openSite();
  }

  onClientDiscard() {
    App.showGlobalDialog(
        new GlobalDialog({
          closable: true,
          title: 'Соединение отклонено',
          text: /*html*/`
          ${Icon('cancel', 'giant text-center margin-top-zero')}<br>
          Аппарат отклонил текущее соединение.<br>
          Возможно, подключился кто-то другой,<br>
          или соединение оборвалось.
        `,
          classes: 'text-center',
          buttons: [
            new Button({
              text: 'Закрыть',
              icon: 'keyboard-return',
            }, () => App.closeGlobalDialog()),
          ],
        }),
    );
  }

  scanDevices() {
    this.disconnect();
    mur.conn.scanAll();
  }

  scanCode() {
    QrCodes.scanCode();
  }

  disconnect() {
    mur.disconnect();
    this.onUpdateDevicesList([]);
  }

  onUpdateDevicesList(devices) {
    this.devicesListEl.innerText = '';

    const devicesFound = devices.length > 0;
    // TODO: don't query each time
    this.q('#connDevicesListWrapper').classList.toggle('height-fill', devicesFound);
    this.q('#connDevicesListWrapper').classList.toggle('height-fit-content', !devicesFound);

    devices.forEach((device) => {
      const deviceItem = new DeviceListItem(device, () => {
        if (AppVersion.isDevBuild) {
          mur.connect(device.address, true);
        } else {
          App.showGlobalDialog(
              new GlobalDialog({
                closable: true,
                title: 'Нужно сканировать код',
                text: /*html*/`
                  Для подключения к аппарату<br>
                  необходимо отсканировать QR-код.
                `,
                classes: ['text-center'],
                buttons: [
                  new Button({
                    text: 'Сканировать',
                    icon: 'qrcode-scan',
                  }, () => {
                    App.closeGlobalDialog();
                    this.scanCode();
                  }),
                  new Button({
                    text: 'Назад',
                    icon: 'keyboard-return',
                  }, () => App.closeGlobalDialog()),
                ],
              }),
          );
        }
      });

      this.devicesListEl.appendChild(deviceItem);
    });

    const emptyEl = document.createElement('div');
    emptyEl.classList.add('device-item');
    emptyEl.classList.add('list-item');
    emptyEl.classList.add('opacity-0');
    this.devicesListEl.appendChild(emptyEl);
  }

  onStatusUpdated(status) {
    const connected = mur.deviceAddress != null;

    if (this.wasConnected !== connected) {
      App.setLoading(true);
      setTimeout(() => {
        App.setLoading(false);
        this.q('#device-connect').classList.toggle('hidden', connected);
        this.q('#device-info').classList.toggle('hidden', !connected);
        this.updateIcon();
      }, 1500);
    }

    this.wasConnected = connected;
    this.updateTelemetry(mur.telemetry);
  }

  updateTelemetry(t) {
    this.updateIcon();

    if (this.active) {
      this.telemetryTable.attrs.address = mur.deviceAddress;
      this.telemetryTable.attrs.telemetry = t;
      this.telemetryTable.attrs.stats = TelemetryUtils.stats;
      this.telemetryTable.attrs.connection = mur.status;
      this.telemetryTable.attrs.ping = mur.timePingDelta;
      this.telemetryTable.update();
    }
  }

  updateIcon() {
    const icon = TelemetryUtils.makeBatteryIcon();
    if (icon && this.oldIcon != icon.name) {
      this.setIcon(icon.name, icon.color);
      console.log(`updated icon from ${this.oldIcon} to ${icon.name}`);
      this.oldIcon = icon.name;
    }
  }
}
