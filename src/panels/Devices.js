import Panel from './Panel'
import mur from '../vehicle/apiGameMur.js'
import { text } from 'hyperapp';

export default class Devices extends Panel {

  begin() {
    this.html = /*html*/`
      <div>
        Status - <span id="connStatus"></span>
      </div>

      <div id="connBluetoothPanel">

        <div>
          <div class="push-button" id="connScanDevices">Scan Devices</div>
          <div class="push-button" id="connScanCode">Scan Code</div>
          <div class="push-button" id="connDisconnect">Disconnect</div>
        </div>
        <br>

        <div id="connDevicesWrapper">
          <div id="connDevicesList"></div>
        </div>

      </div>
    `
  }


  init() {
    this.statusEl = this.q("#connStatus");
    this.statusEl.innerText = "waiting… type: " + mur.conn.type;

    this.devicesListEl = this.q("#connDevicesList");

    this.q("#connScanDevices").onclick = () => this.scanDevices();
    this.q("#connScanCode").onclick = () => this.scanCode();
    this.q("#connDisconnect").onclick = () => this.disconnect();

    if (mur.conn.type === "bluetooth") {
      mur.conn.onDeviceDiscovered = (devices) => this.onUpdateDevicesList(devices);
    } else {
      // this.q("#connBluetoothPanel").classList.add("hidden");
    }
  }


  scanDevices() {
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
    } else {
      tagEl.classList.add('device-tag');
      tagEl.classList.add('float-rigth');
      tagEl.innerText = tag;
    }

    if (!active) tagEl.classList.add('opacity-0');

    item.appendChild(tagEl);
  }


  onUpdateDevicesList(devices) {
    this.devicesListEl.innerHtml = "";
    this.devicesListEl.innerText = "";
    this.devicesListEl.textContent = "";

    devices.forEach(device => {
      let deviceEl = document.createElement("div");
      deviceEl.classList.add("device-item");

      this.addDeviceTag(deviceEl, "online", (device.isCompatible & device.isOnline) || (device.isActive && mur.conn.state == "open"));

      if (device.isCompatible) {
        let nameEl = document.createElement("span");
        nameEl.innerText = `${device.name.substring(0, device.name.search('-'))}`;
        nameEl.classList.add("text");
        deviceEl.appendChild(nameEl);

        let nameIdEl = document.createElement("span");
        nameIdEl.innerText = `${device.name.replace('ElementaryAUV-', '')}`;
        nameIdEl.classList.add("text");
        nameIdEl.classList.add("bold");
        deviceEl.appendChild(nameIdEl);

      } else if (device.name.length > 0) {
        let nameEl = document.createElement("span");
        nameEl.innerText = `${device.name}`;
        nameEl.classList.add("text");
        deviceEl.appendChild(nameEl);
      }

      let addrEl = document.createElement("span");
      addrEl.innerText = `[${device.address}]`;
      addrEl.classList.add("text");
      if (device.isCompatible) addrEl.classList.add("opacity-25");
      deviceEl.appendChild(addrEl);

      this.addDeviceTag(deviceEl, "💾", device.isPaired);
      this.addDeviceTag(deviceEl, "✅", device.isActive);

      if (!device.isCompatible) deviceEl.classList.add("inactive");
      if (device.isActive && mur.conn.state == "open") deviceEl.classList.add("active");

      deviceEl.onclick = () => mur.connect(device.address);

      this.devicesListEl.appendChild(deviceEl);
    });
  }


  onUpdateConnection() {}

}