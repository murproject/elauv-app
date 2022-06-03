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
        <img class="logo" src="/media/logo.png" />
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

    this.panelSelect(this.panels.devices);
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
      mur.controlInfo(); // TODO: use separate keepalive packet?
    }, 1500);
  },

}


if (typeof cordova !== 'undefined') {
  document.addEventListener('deviceready', () => {
    window.cutout.has().then(hasCutout => {
      if (hasCutout) {
        // TODO: make it better?
        document.addEventListener("resume", triggerStatusbar, false);
        triggerStatusbar();
      }
    });

    window.IsekaiFakeSplash.hide()
    main();
  }, false)
} else {
  window.onload = () => main();
}


function triggerStatusbar() {
  setTimeout(() => {
    window.StatusBar.overlaysWebView(false);
    window.StatusBar.show();
    window.StatusBar.backgroundColorByHexString("FFF");
    window.StatusBar.styleDefault();
  }, 250);
}


function main() {
  document.app = app;
  document.app.init();
}