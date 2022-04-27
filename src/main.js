import mur from './vehicle/apiGameMur.js'

import DevicesPanel from './panels/Devices.js';
import TelemetryPanel from './panels/Telemetry.js';
import JoystickPanel from './panels/Joystick.js';
import BlocklyPanel from './panels/Blockly.js';


const app = {

  html: /*html*/`
    <header id="head">
      <div class="buttons-group" id="buttons-main">
        <!-- <div class="panel-logo">ElAUV</div> -->
      </div>
    </header>
    <section id="panel-wrapper"></section>
  `,

  container: document.querySelector("#app"),
  panels: {},
  currentPanel: null,


  panelSelect: function (target) {
    if (this.currentPanel) {
      this.currentPanel.setActive(false);
    }

    this.currentPanel = target;
    this.currentPanel.setActive(true);
  },


  createPanels: function () {
    if (this.panels.length > 0) {
      return;
    }

    this.panels = {
      devices: new DevicesPanel(),
      telemetry: new TelemetryPanel(),
      joystick: new JoystickPanel(),
      blockly: new BlocklyPanel(),
    };

    this.panelSelect(this.panels.blockly);
  },


  init: function () {
    this.container.innerHTML = this.html;
    this.createPanels();

    mur.create();

    mur.telemetryUpdated = (t, f) => {
      const prettyTelemetry = JSON.stringify(f, null, '\t');
      this.panels.telemetry.update(prettyTelemetry);
      this.panels.blockly.updateTelemetry(t);
    };

    this.timerKeepAlive = setInterval(() => {
      mur.controlInfo();
    }, 1500);
  },

}


if (typeof cordova !== 'undefined') {
  document.addEventListener('deviceready', () => {
    window.IsekaiFakeSplash.hide()
    main();
  }, false)
} else {
  window.onload = () => main();
}


function main() {
  document.app = app;
  document.app.init();
}