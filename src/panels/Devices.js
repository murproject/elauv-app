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
    <!-- TODO ${Icon('package-down')} -->
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
    this.addTab = App.isCordova;

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
              <a href="#" onclick="cordova.InAppBrowser.open('${AppVersion.siteLink}', '_system')">
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
      // classes: 'button-vertical',
    });

    this.buttonScanDevices.inject(this.q('#scan-button-wrapper'));

    this.buttonDisconnect = new Button({
      name: 'disconnect',
      text: 'Отключить',
      action: () => this.disconnect(),
      icon: 'broadcast-off',
      // classes: 'button-vertical',
    });

    this.buttonDisconnect.inject(this.q('#disconnect-button-wrapper'));

    if (mur.conn.type === 'bluetooth') {
      mur.conn.onDeviceDiscovered = (devices) => this.onUpdateDevicesList(devices);
    } else {
      // this.q("#connBluetoothPanel").classList.add("hidden");
    }
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
    if (mur.conn.type !== 'bluetooth') {
      // TODO: remove //
      // const dev = `[{"type":"elauv","address":"D8:A0:1D:5C:FF:26","name":"ElementaryAUV-FF26","isCompatible":true,"isPaired":true,"isOnline":true,"isActive":true,"tag":"1-0-0-1-D8:A0:1D:5C:FF:26"},{"type":"elauv","address":"AC:0B:FB:74:1E:1E","name":"ElementaryAUV-1E1E","isCompatible":true,"isPaired":true,"isOnline":true,"isActive":false,"tag":"1-0-1-0-AC:0B:FB:74:1E:1E"},{"type":"elauv","address":"AC:0B:FB:74:1E:2A","name":"ElementaryAUV-1E2A","isCompatible":true,"isPaired":true,"isOnline":false,"isActive":false,"tag":"1-0-1-0-AC:0B:FB:74:1E:2A"},{"type":"unknown","address":"00:16:53:49:39:E5","name":"BRAT","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-00:16:53:49:39:E5"},{"type":"unknown","address":"44:9F:88:D4:73:B9","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-44:9F:88:D4:73:B9"},{"type":"unknown","address":"45:25:F9:9B:CC:CF","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-45:25:F9:9B:CC:CF"},{"type":"unknown","address":"49:77:40:32:22:1C","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-49:77:40:32:22:1C"},{"type":"unknown","address":"4A:60:26:F0:EE:23","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-4A:60:26:F0:EE:23"},{"type":"unknown","address":"4D:8C:A0:46:F4:9C","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-4D:8C:A0:46:F4:9C"},{"type":"unknown","address":"51:72:65:68:71:7C","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-51:72:65:68:71:7C"},{"type":"unknown","address":"59:BE:6C:2A:79:D6","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-59:BE:6C:2A:79:D6"},{"type":"unknown","address":"5F:82:19:EA:06:52","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-5F:82:19:EA:06:52"},{"type":"unknown","address":"5F:D3:0B:EA:06:FB","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-5F:D3:0B:EA:06:FB"},{"type":"unknown","address":"61:BA:01:DA:42:88","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-61:BA:01:DA:42:88"},{"type":"unknown","address":"62:43:B4:AE:B3:5D","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-62:43:B4:AE:B3:5D"},{"type":"unknown","address":"64:AA:FB:26:AB:BF","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-64:AA:FB:26:AB:BF"},{"type":"unknown","address":"6B:F7:52:C5:4A:CA","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-6B:F7:52:C5:4A:CA"},{"type":"unknown","address":"7C:BD:40:35:24:8E","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-7C:BD:40:35:24:8E"},{"type":"unknown","address":"90:E8:68:FA:C3:52","name":"LAPTOP-QO81TSJH","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-90:E8:68:FA:C3:52"},{"type":"unknown","address":"A4:17:31:DB:B0:B8","name":"OSIPOV-PC","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-A4:17:31:DB:B0:B8"},{"type":"unknown","address":"A6:20:46:B4:73:31","name":"BV4900Pro","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-A6:20:46:B4:73:31"},{"type":"unknown","address":"C0:E4:34:62:0F:D4","name":"network","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-C0:E4:34:62:0F:D4"},{"type":"unknown","address":"D9:3C:88:47:2A:32","name":"Mi Smart Band 4","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-D9:3C:88:47:2A:32"},{"type":"unknown","address":"E0:B6:55:2F:62:DF","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-E0:B6:55:2F:62:DF"}]`;
      const dev = `[{"type":"elauv","address":"D8:A0:1D:5C:FF:26","name":"ElementaryAUV-FF26","isCompatible":true,"isPaired":true,"isOnline":true,"isActive":true,"tag":"1-0-0-1-D8:A0:1D:5C:FF:26"},{"type":"elauv","address":"AC:0B:FB:74:1E:1E","name":"ElementaryAUV-1E1E","isCompatible":true,"isPaired":true,"isOnline":true,"isActive":false,"tag":"1-0-1-0-AC:0B:FB:74:1E:1E"}]`;
      this.onUpdateDevicesList(JSON.parse(dev));
    }

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
    this.q('#connDevicesListWrapper').classList.toggle('height-fill', devicesFound);
    this.q('#connDevicesListWrapper').classList.toggle('height-fit-content', !devicesFound);

    if (devices.length > 0) {
      // this.welcomeEl.classList.add('hidden');
    }

    devices.forEach((device) => {
      const deviceItem = new DeviceListItem(device, () => {
        if (AppVersion.isDevBuild) {
          mur.connect(device.address, true); // TODO: move pingCounter reset to mur.connect?
          mur.pingCounter = 0;
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

      // deviceItem.classList.toggle('pointer-events-none', !AppVersion.isDevBuild);
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
    // const connected = true;

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
    // console.log(t);
    // this.q('#telemetry-wrapper').innerText = JSON.stringify(t);
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
