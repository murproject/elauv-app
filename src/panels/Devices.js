import Panel from './Panel'
import mur from '/src/vehicle/apiGameMur.js'
import Icon from '/src/components/Icon'
import Button from '../components/Button';

export default class Devices extends Panel {

  begin() {
    this.name = "Доступные устройства";

    this.html = /*html*/`
      <div id="connDevicesWrapper" class="list-wrapper">

        <div id="devices-welcome" class="opacity-50">
            Устройств ещё нет!<br><br>
            Включите ElementaryAUV<br>
            и отсканируйте код.
          </div>

          <div id="connDevicesList" class="width-fill"></div>
        </div>

      </div>
      <div id="buttonsRow" class="row"></div>

      <!-- <div class="row"><span id="connStatus"></span></div> -->
    `
  }


  init() {
    // this.statusEl = this.q("#connStatus");
    // this.statusEl.innerText = "Connection type: " + mur.conn.type;

    this.devicesListEl = this.q("#connDevicesList");
    this.welcomeEl = this.q("#devices-welcome");
    this.buttonsWrapper = this.q('#buttonsRow');

    new Button({
      name: 'scan-code',
      text: 'Сканировать код',
      action: () => this.scanCode(),
      icon: 'qrcode-scan',
      // classes: 'button-vertical',
    }).inject(this.buttonsWrapper);

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

    // this.q("#connScanDevices").onclick = () => this.scanDevices();
    // this.q("#connScanCode").onclick = () => this.scanCode();
    // this.q("#connDisconnect").onclick = () => this.disconnect();

    if (mur.conn.type === "bluetooth") {
      mur.conn.onDeviceDiscovered = (devices) => this.onUpdateDevicesList(devices);
    } else {
      // this.q("#connBluetoothPanel").classList.add("hidden");
    }

    this.setIcon('bluetooth-connect'); // TODO //
  }


  scanDevices() {
    if (mur.conn.type !== 'bluetooth') {
      // TODO: remove //
      const dev = `[{"type":"elauv","address":"D8:A0:1D:5C:FF:26","name":"ElementaryAUV-FF26","isCompatible":true,"isPaired":true,"isOnline":true,"isActive":true,"tag":"1-0-0-1-D8:A0:1D:5C:FF:26"},{"type":"elauv","address":"AC:0B:FB:74:1E:1E","name":"ElementaryAUV-1E1E","isCompatible":true,"isPaired":true,"isOnline":true,"isActive":false,"tag":"1-0-1-0-AC:0B:FB:74:1E:1E"},{"type":"elauv","address":"AC:0B:FB:74:1E:2A","name":"ElementaryAUV-1E2A","isCompatible":true,"isPaired":true,"isOnline":false,"isActive":false,"tag":"1-0-1-0-AC:0B:FB:74:1E:2A"},{"type":"unknown","address":"00:16:53:49:39:E5","name":"BRAT","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-00:16:53:49:39:E5"},{"type":"unknown","address":"44:9F:88:D4:73:B9","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-44:9F:88:D4:73:B9"},{"type":"unknown","address":"45:25:F9:9B:CC:CF","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-45:25:F9:9B:CC:CF"},{"type":"unknown","address":"49:77:40:32:22:1C","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-49:77:40:32:22:1C"},{"type":"unknown","address":"4A:60:26:F0:EE:23","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-4A:60:26:F0:EE:23"},{"type":"unknown","address":"4D:8C:A0:46:F4:9C","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-4D:8C:A0:46:F4:9C"},{"type":"unknown","address":"51:72:65:68:71:7C","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-51:72:65:68:71:7C"},{"type":"unknown","address":"59:BE:6C:2A:79:D6","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-59:BE:6C:2A:79:D6"},{"type":"unknown","address":"5F:82:19:EA:06:52","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-5F:82:19:EA:06:52"},{"type":"unknown","address":"5F:D3:0B:EA:06:FB","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-5F:D3:0B:EA:06:FB"},{"type":"unknown","address":"61:BA:01:DA:42:88","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-61:BA:01:DA:42:88"},{"type":"unknown","address":"62:43:B4:AE:B3:5D","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-62:43:B4:AE:B3:5D"},{"type":"unknown","address":"64:AA:FB:26:AB:BF","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-64:AA:FB:26:AB:BF"},{"type":"unknown","address":"6B:F7:52:C5:4A:CA","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-6B:F7:52:C5:4A:CA"},{"type":"unknown","address":"7C:BD:40:35:24:8E","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-7C:BD:40:35:24:8E"},{"type":"unknown","address":"90:E8:68:FA:C3:52","name":"LAPTOP-QO81TSJH","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-90:E8:68:FA:C3:52"},{"type":"unknown","address":"A4:17:31:DB:B0:B8","name":"OSIPOV-PC","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-A4:17:31:DB:B0:B8"},{"type":"unknown","address":"A6:20:46:B4:73:31","name":"BV4900Pro","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-A6:20:46:B4:73:31"},{"type":"unknown","address":"C0:E4:34:62:0F:D4","name":"network","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-C0:E4:34:62:0F:D4"},{"type":"unknown","address":"D9:3C:88:47:2A:32","name":"Mi Smart Band 4","isCompatible":false,"isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-D9:3C:88:47:2A:32"},{"type":"unknown","address":"E0:B6:55:2F:62:DF","name":"","isPaired":false,"isOnline":true,"isActive":false,"tag":"1-1-0-1-E0:B6:55:2F:62:DF"}]`
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


  addDeviceTag(item, tag, active = true) {
    let tagEl = document.createElement("span");

    if (tag === 'online') {
      tagEl.classList.add('device-tag-online');
    } else if (tag ==='offline') {
      tagEl.classList.add('device-tag-offline');
    } else {
      tagEl.classList.add('device-tag');
      // tagEl.classList.add('float-rigth');
      tagEl.innerHTML = tag;
    }

    if (!active) tagEl.classList.add('opacity-0');

    item.appendChild(tagEl);
  }


  onUpdateDevicesList(devices) {
    this.devicesListEl.innerHtml = "";
    this.devicesListEl.innerText = "";
    this.devicesListEl.textContent = "";

    if (devices.length > 0) {
      this.welcomeEl.classList.add('hidden');
    }

    devices.forEach(device => {
      let deviceEl = document.createElement("div");
      deviceEl.classList.add("device-item");

      const isOnline = (device.isOnline || (device.isActive && mur.conn.state == "open"));
      // this.addDeviceTag(deviceEl, isOnline ? "online" : "offline", ('isCompatible' in device & device.isCompatible));
      this.addDeviceTag(deviceEl, isOnline ? `${Icon('antenna', 'green-bright')}` : `${Icon('checkbox-blank-circle-outline', 'dark', 'opacity-25')}`, ('isCompatible' in device & device.isCompatible));

      let titleDiv = document.createElement("div");
      titleDiv.classList.add("device-title");

      if (device.isCompatible) {
        let nameEl = document.createElement("div");
        nameEl.innerText = `${device.name.substring(0, device.name.search('-'))}`;
        nameEl.classList.add("text");
        titleDiv.appendChild(nameEl);

        let nameIdEl = document.createElement("div");
        nameIdEl.innerText = `${device.name.replace('ElementaryAUV-', '')}`;
        nameIdEl.classList.add("text");
        nameIdEl.classList.add("bold");
        titleDiv.appendChild(nameIdEl);

      } else if (device.name.length > 0) {
        let nameEl = document.createElement("div");
        nameEl.innerText = `${device.name}`;
        nameEl.classList.add("text");
        titleDiv.appendChild(nameEl);
      }


      let addrEl = document.createElement("div");
      addrEl.innerText = `[${device.address}]`;
      addrEl.classList.add("text");
      addrEl.classList.add("text-tiny");
      if (device.isCompatible) addrEl.classList.add("opacity-25");
      titleDiv.appendChild(addrEl);

      deviceEl.appendChild(titleDiv);

      // this.addDeviceTag(deviceEl, `${Icon('checkbox-marked-outline')}`, device.isActive);
      // this.addDeviceTag(deviceEl, `${Icon('content-save')}`, device.isPaired);

      // this.addDeviceTag(deviceEl, `${Icon('checkbox-marked-outline')}`, device.isActive);
      this.addDeviceTag(deviceEl, device.isActive ? `${Icon('checkbox-marked-outline')}` : `${Icon('content-save')}`, device.isPaired || device.isActive);

      if (!device.isCompatible) deviceEl.classList.add("inactive");
      if (device.isActive && mur.conn.state == "open") deviceEl.classList.add("active");

      deviceEl.onclick = () => mur.connect(device.address);

      this.devicesListEl.appendChild(deviceEl);
    });

    let emptyEl = document.createElement("div");
    emptyEl.classList.add("device-item");
    emptyEl.classList.add("opacity-0");
    this.devicesListEl.appendChild(emptyEl);
  }


  onUpdateConnection() {}

}