import Panel from './Panel'
import mur from '/src/vehicle/apiGameMur.js'
import icon from '/src/utils/icon'

export default class Telemetry extends Panel {

  begin() {
    this.html = /*html*/`
      <div id="telemetryText">Waiting for connection…</div>
    `
  }


  init() {
    this.textElement = this.q("#telemetryText");

    this.stats = {
      maxVolts: -Infinity,
      minVolts:  Infinity,
      maxAmps: -Infinity,
      minAmps:  Infinity,
      maxRsoc: -Infinity,
      minRsoc:  Infinity,
      maxTemp: -Infinity,
      minTemp:  Infinity,
      battState: null,
      lastTimestamp: null,
      ping: null,
    };

    this.setIcon('battery-high');
  }


  update(telemetryText) {
    if (this.active) {
      this.stats.maxVolts = Math.max(this.stats.maxVolts, mur.telemetry.battVolts).toFixed(2);
      this.stats.minVolts = Math.min(this.stats.minVolts, mur.telemetry.battVolts).toFixed(2);

      this.stats.maxAmps = Math.max(this.stats.maxAmps, mur.telemetry.battAmps).toFixed(2);
      this.stats.minAmps = Math.min(this.stats.minAmps, mur.telemetry.battAmps).toFixed(2);

      this.stats.maxRsoc = Math.max(this.stats.maxRsoc, mur.telemetry.battRsoc).toFixed(2);
      this.stats.minRsoc = Math.min(this.stats.minRsoc, mur.telemetry.battRsoc).toFixed(2);

      this.stats.maxTemp = Math.max(this.stats.maxTemp, mur.telemetry.battTemp).toFixed(2);
      this.stats.minTemp = Math.min(this.stats.minTemp, mur.telemetry.battTemp).toFixed(2);

      this.stats.battState = mur.telemetry.battAmps > 0 ? 'charging' : 'discharging';

      this.stats.lastTimestamp = mur.lastUpdatedDate.toLocaleString();
      this.stats.ping = mur.timePingDelta;


      telemetryText += '\n\n';
      telemetryText += JSON.stringify(this.stats, null, '\t');

      this.textElement.innerText = telemetryText;
    }
  }

}