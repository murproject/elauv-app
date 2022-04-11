import BlocklyWrapper from './blockly-wrapper/BlocklyWrapper.js'
import apiGameMur from './vehicle/apiGameMur.js'

const q = selector => document.querySelector(selector);

var app = {
  currentPanel: null,

  blockly: BlocklyWrapper,

  panels: {
    telemetry: q('#telemetryPanel'),
    blockly: q('#blocklyPanel'),
    joystick: q('#joystickPanel'),

    telemetryText: q('#telemetryText'),
  },

  panelSelect: function (target) {
    if (this.currentPanel) {
      this.currentPanel.classList.remove('active');
    }

    this.currentPanel = this.panels[target];
    this.currentPanel.classList.add('active');
  },

  blocklyAction: function (action) {
    console.log('blockly action: ' + action);
    this.blockly[action](); // TODO: if typeof === function
  },

  mur: apiGameMur,

  init: function () {
    this.panelSelect('blockly');
    this.blockly.start();
    this.blockly.mur = this.mur;

    this.mur.create();

    this.mur.telemetryUpdated = (t, f) => {
      const prettyTelemetry = JSON.stringify(f, null, '\t');
      this.panels.telemetryText.innerText = prettyTelemetry;
    };

    this.timerKeepAlive = setInterval(() => {
      this.mur.controlInfo();
    }, 1500);
  },
}

window.onload = function () {
  document.app = app;
  app.init();
};