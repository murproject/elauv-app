import Panel from './Panel'
import mur from '../vehicle/apiGameMur.js'

export default class Devices extends Panel {

  begin() {
    this.html = /*html*/`
      <div>
        Status - <span id="connStatus"></span>
      </div>
      <br>

      <div id="connBluetoothPanel">

        <div>
          <div class="panel-button push-button" id="connScanDevices">Scan Devices</div>
          <div class="panel-button push-button" id="connScanCode">Scan Code</div>
          <div class="panel-button push-button" id="connDisconnect">Disconnect</div>
        </div>
        <br>

        <div>
          Available devices: <span id="connDevicesList"></span>
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
    mur.conn.disconnect();
    mur.conn.macAddress = null;
  }


  onUpdateDevicesList(devices) {
    this.devicesListEl.innerText = JSON.stringify(devices);
  }


  onUpdateConnection() {}

}