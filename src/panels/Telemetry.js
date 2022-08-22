import Panel from './Panel';
import mur from '/src/vehicle/api.js';
import Utils from '/src/utils/Utils';
import SettingsStorage from '/src/utils/SettingsStorage';
import TelemetryUtils from '/src/utils/TelemetryUtils';

export default class Telemetry extends Panel {
  begin() {
    this.name = 'Телеметрия';

    this.html = /*html*/`
      <div class="container">
        <div id="telemetryText" class="monospace soft-edges-vertical">Waiting for connection…</div>
        <div class="vertical-filler"></div>
        <div class="push-button" id="resetStats">Reset stats</div>
      </div>
    `;
  }

  init() {
    this.battIconName = 'battery-unknown';
    this.oldBattIconName = this.battIconName;
    this.setIcon(this.battIconName);
    this.textElement = this.q('#telemetryText');
  }
}
