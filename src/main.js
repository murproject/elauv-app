import BlocklyWrapper from './blockly-wrapper/BlocklyWrapper.js'
import apiGameMur from './vehicle/apiGameMur.js'
import joystickPanel from './panels/Joystick.js';
import protocol from './vehicle/protocolGameMur.js'

const q = selector => document.querySelector(selector);

function clamp (value, min, max) {
  return Math.round(Math.min(Math.max(min, value), max))
}

var app = {
  currentPanel: null,
  currentPanelName: "",

  panels: {
    // telemetry: q('#telemetryPanel'),
    // blockly: q('#blocklyPanel'),
    joystick: new joystickPanel(),

    // telemetryText: q('#telemetryText'),
  },

  blockly: BlocklyWrapper,

  formulaInput: q("#axesFormula"),
  formulaStatusText: q("#formulaStatus"),

  panelSelect: function (target) {
    this.currentPanelName = target;

    if (this.currentPanel) {
      this.currentPanel.setActive(false);
    }

    this.currentPanel = this.panels[target];
    this.currentPanel.setActive(true);
  },

  blocklyAction: function (action) {
    console.log('blockly action: ' + action);
    this.blockly[action](); // TODO: if typeof === function
  },

  mur: apiGameMur,

  init: function () {
    // for (const key in this.panels) {
    //   this.panels[key].init();
    // }

    // this.panels.joystick.init();

    // this.panelSelect('joystick');

    console.log(this.panels.joystick);

    // this.blockly.start();
    // this.blockly.mur = this.mur;

    this.mur.create();

    // this.mur.telemetryUpdated = (t, f) => {
    //   const prettyTelemetry = JSON.stringify(f, null, '\t');
    //   this.panels.telemetryText.innerText = prettyTelemetry;

    //   this.blockly.updateTelemetry(t);
    // };

    // this.timerKeepAlive = setInterval(() => {
    //   this.mur.controlInfo();
    // }, 1500);
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