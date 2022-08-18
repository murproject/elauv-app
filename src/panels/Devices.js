import Panel from './Panel';
import mur from '/src/vehicle/apiGameMur.js';
import Icon from '/src/components/Icon';
import Button from '../components/Button';
import DeviceListItem from '../components/DeviceItem';
import GlobalDialog from '/src/components/GlobalDialog.js';
import App from '/src/App';

export default class Devices extends Panel {
  begin() {
    this.name = 'Устройства';

    this.html = /*html*/`
      <div class="container">
        <div class="row">
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
        </div>

        <div class="list-wrapper soft-edges-vertical">
          <div id="connDevicesList" class="width-fill row"></div>
        </div>

        <div class="row" id="scan-button-wrapper"></div>

        <div class="vertical-filler"></div>

        <div id="buttonsRow" class="row"></div>
      </div>

      <!-- <div class="row"><span id="connStatus"></span></div> -->
    `;
  }

  init() {
    // this.statusEl = this.q("#connStatus");
    // this.statusEl.innerText = "Connection type: " + mur.conn.type;

    mur.onDiscard = () => this.onClientDiscard();

    this.devicesListEl = this.q('#connDevicesList');
    this.welcomeEl = this.q('#devices-welcome');
    this.buttonsWrapper = this.q('#buttonsRow');

    new Button({
      name: 'scan-code',
      text: 'Сканировать код',
      action: () => this.scanCode(),
      icon: 'qrcode',
      iconClasses: 'giant opacity-75',
      classes: ['button-vertical', 'extra-padding'],
      scanHelper: true,
      scanHelperBounce: true,
    }).inject(this.q('#scan-button-wrapper'));

    new Button({
      name: 'scan-bluetooth',
      text: 'Поиск устройств',
      action: () => this.scanDevices(),
      icon: 'broadcast',
      // classes: 'button-vertical',
    }).inject(this.buttonsWrapper);

    new Button({
      name: 'disconnect',
      text: 'Отключить',
      action: () => this.disconnect(),
      icon: 'broadcast-off',
      // classes: 'button-vertical',
    }).inject(this.buttonsWrapper);

    if (mur.conn.type === 'bluetooth') {
      mur.conn.onDeviceDiscovered = (devices) => this.onUpdateDevicesList(devices);
    } else {
      // this.q("#connBluetoothPanel").classList.add("hidden");
    }

    this.setIcon('bluetooth-connect'); // TODO //
    // setTimeout(() => this.scanDevices(), 200  )
  }

  onClientDiscard() {
    App.showGlobalDialog(
        new GlobalDialog({
          closable: true,
          title: 'Соединение отклонено',
          text: /*html*/`
          ${Icon('cancel', 'giant text-center margin-top-zero')}<br>
          Аппарат отклонил текущее соединение.<br>
          Возможно, что подключился кто-то другой.
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
      const dev = `[{"type":"elauv","address":"D8:A0:1D:5C:FF:26","name":"ElementaryAUV-FF26","isCompatible":true,"isPaired":true,"isOnline":true,"isActive":true,"tag":"1-0-0-1-D8:A0:1D:5C:FF:26"},{"type":"elauv","address":"AC:0B:FB:74:1E:1E","name":"ElementaryAUV-1E1E","isCompatible":true,"isPaired":true,"isOnline":true,"isActive":false,"tag":"1-0-1-0-AC:0B:FB:74:1E:1E"},{"type":"elauv","address":"AC:0B:FB:74:1E:2A","name":"ElementaryAUV-1E2A","isCompatible":true,"isPaired":true,"isOnline":false,"isActive":false,"tag":"1-0-1-0-AC:0B:FB:74:1E:2A"},{"type":"unknown","address":"00:16:53:49:39:E5","name":"BRAT","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-00:16:53:49:39:E5"},{"type":"unknown","address":"44:9F:88:D4:73:B9","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-44:9F:88:D4:73:B9"},{"type":"unknown","address":"45:25:F9:9B:CC:CF","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-45:25:F9:9B:CC:CF"},{"type":"unknown","address":"49:77:40:32:22:1C","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-49:77:40:32:22:1C"},{"type":"unknown","address":"4A:60:26:F0:EE:23","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-4A:60:26:F0:EE:23"},{"type":"unknown","address":"4D:8C:A0:46:F4:9C","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-4D:8C:A0:46:F4:9C"},{"type":"unknown","address":"51:72:65:68:71:7C","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-51:72:65:68:71:7C"},{"type":"unknown","address":"59:BE:6C:2A:79:D6","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-59:BE:6C:2A:79:D6"},{"type":"unknown","address":"5F:82:19:EA:06:52","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-5F:82:19:EA:06:52"},{"type":"unknown","address":"5F:D3:0B:EA:06:FB","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-5F:D3:0B:EA:06:FB"},{"type":"unknown","address":"61:BA:01:DA:42:88","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-61:BA:01:DA:42:88"},{"type":"unknown","address":"62:43:B4:AE:B3:5D","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-62:43:B4:AE:B3:5D"},{"type":"unknown","address":"64:AA:FB:26:AB:BF","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-64:AA:FB:26:AB:BF"},{"type":"unknown","address":"6B:F7:52:C5:4A:CA","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-6B:F7:52:C5:4A:CA"},{"type":"unknown","address":"7C:BD:40:35:24:8E","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-7C:BD:40:35:24:8E"},{"type":"unknown","address":"90:E8:68:FA:C3:52","name":"LAPTOP-QO81TSJH","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-90:E8:68:FA:C3:52"},{"type":"unknown","address":"A4:17:31:DB:B0:B8","name":"OSIPOV-PC","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-A4:17:31:DB:B0:B8"},{"type":"unknown","address":"A6:20:46:B4:73:31","name":"BV4900Pro","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-A6:20:46:B4:73:31"},{"type":"unknown","address":"C0:E4:34:62:0F:D4","name":"network","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-C0:E4:34:62:0F:D4"},{"type":"unknown","address":"D9:3C:88:47:2A:32","name":"Mi Smart Band 4","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-D9:3C:88:47:2A:32"},{"type":"unknown","address":"E0:B6:55:2F:62:DF","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-E0:B6:55:2F:62:DF"}]`;
      this.onUpdateDevicesList(JSON.parse(dev));
    }

    this.disconnect();
    mur.conn.scanAll();
  }


  scanCode() {
    mur.conn.scanCode();
  }


  disconnect() {
    mur.disconnect();
  }


  onUpdateDevicesList(devices) {
    this.devicesListEl.innerText = '';

    if (devices.length > 0) {
      // this.welcomeEl.classList.add('hidden');
    }

    devices.forEach((device) => {
      device.isOnline = (device.isOnline || (device.isActive && mur.conn.state == 'open'));
      device.isConnected = device.isActive && mur.conn.state == 'open';

      this.devicesListEl.appendChild(new DeviceListItem(device, () => {
        mur.connect(device.address);
        mur.pingCounter = 0;
        // mur.conn.scanPaired();
      }));
    });

    const emptyEl = document.createElement('div');
    emptyEl.classList.add('device-item');
    emptyEl.classList.add('list-item');
    emptyEl.classList.add('opacity-0');
    this.devicesListEl.appendChild(emptyEl);
  }

  onUpdateConnection() {}
}
