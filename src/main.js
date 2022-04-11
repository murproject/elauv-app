import BlocklyWrapper from './blockly-wrapper/BlocklyWrapper.js'

const q = selector => document.querySelector(selector);

var app = {
  currentPanel: null,

  panels: {
    telemetry: q('#telemetryPanel'),
    blockly: q('#blocklyPanel'),
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
  },
}

window.onload = function () {
  document.app = app;
  app.panelSelect('blockly');
  BlocklyWrapper.start();
};