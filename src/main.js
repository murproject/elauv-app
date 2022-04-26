import apiGameMur from './vehicle/apiGameMur.js'

import DevicesPanel from './panels/Devices.js';
import TelemetryPanel from './panels/Telemetry.js';
import JoystickPanel from './panels/Joystick.js';
import BlocklyPanel from './panels/Blockly.js';

import protocol from './vehicle/protocolGameMur.js'

const q = selector => document.querySelector(selector);

function clamp (value, min, max) {
  return Math.round(Math.min(Math.max(min, value), max))
}

var app = {
  currentPanel: null,
  currentPanelName: "",

  panels: {
    devices: new DevicesPanel(),
    telemetry: new TelemetryPanel(),
    joystick: new JoystickPanel(),
    blockly: new BlocklyPanel(),
  },

  panelSelect: function (target) {
    if (this.currentPanel) {
      this.currentPanel.setActive(false);
    }

    this.currentPanel = target;
    this.currentPanel.setActive(true);
  },

  blocklyAction: function (action) {
    console.log('blockly action: ' + action);
    this.blockly[action](); // TODO: if typeof === function
  },

  mur: apiGameMur,

  init: function () {
    this.panelSelect(this.panels.telemetry);

    this.mur.create();

    // this.blockly.start();
    // this.blockly.mur = this.mur;

    this.mur.telemetryUpdated = (t, f) => {
      const prettyTelemetry = JSON.stringify(f, null, '\t');
      this.panels.telemetry.update(prettyTelemetry);
    //   this.blockly.updateTelemetry(t);
    };

    this.timerKeepAlive = setInterval(() => {
      this.mur.controlInfo();
    }, 1500);
  },
}


if (typeof cordova !== 'undefined') {
  document.addEventListener('deviceready', () => {
    window.IsekaiFakeSplash.hide()
  }, false)
}


window.onload = function () {
  document.app = app;
  app.init();
};