import Panel from './Panel'

export default class Devices extends Panel {

  begin() {
    this.html = /*html*/`
      <div>
        Status - <span id="connStatus"></span>
      </div>
      <br>
      <div>
        <div class="panel-button push-button" id="connScanDevices">Scan Devices</div>
        <div class="panel-button push-button" id="connScanCode">Scan Code</div>
      </div>
      <br>
      <div>
        Available devices:
      </div>
    `
  }


  init() {
    this.statusEl = this.q("#connStatus");
    this.statusEl.innerText = "waiting…";

    this.q("#connScanDevices").onclick = () => this.scanDevices();
    this.q("#connScanCode").onclick = () => this.scanCode();
  }


  scanDevices() {}


  scanCode() {}


  updateDevicesList() {}


  updateConectedDevice() {}

}