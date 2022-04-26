import apiGameMur from './vehicle/apiGameMur.js'

import DevicesPanel from './panels/Devices.js';
import TelemetryPanel from './panels/Telemetry.js';
import JoystickPanel from './panels/Joystick.js';
import BlocklyPanel from './panels/Blockly.js';

import protocol from './vehicle/protocolGameMur.js'

const q = selector => document.querySelector(selector);

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

  mur: apiGameMur,

  init: function () {
    this.container.innerHTML = this.html;
    console.log(this.container);

    this.panels = {
      devices: new DevicesPanel(),
      telemetry: new TelemetryPanel(),
      joystick: new JoystickPanel(),
      blockly: new BlocklyPanel(),
    };

    this.panelSelect(this.panels.telemetry);

    this.mur.create();

    // this.blockly.start();
    // this.blockly.mur = this.mur;

    this.mur.telemetryUpdated = (t, f) => {
      const prettyTelemetry = JSON.stringify(f, null, '\t');
      this.panels.telemetry.update(prettyTelemetry);
      this.panels.blockly.updateTelemetry(t);
    };

    this.timerKeepAlive = setInterval(() => {
      this.mur.controlInfo();
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
  app.init();
}