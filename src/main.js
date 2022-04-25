import BlocklyWrapper from './blockly-wrapper/BlocklyWrapper.js'
import apiGameMur from './vehicle/apiGameMur.js'
import joystick from './joystick.js';
import protocol from './vehicle/protocolGameMur.js'

const q = selector => document.querySelector(selector);

function clamp (value, min, max) {
  return Math.round(Math.min(Math.max(min, value), max))
}

var app = {
  currentPanel: null,
  currentPanelName: "",

  panels: {
    telemetry: q('#telemetryPanel'),
    blockly: q('#blocklyPanel'),
    joystick: q('#joystickPanel'),

    telemetryText: q('#telemetryText'),
  },
  // TODO: combine with panels? as object like {el: …, obj: …}
  blockly: BlocklyWrapper,
  joystick: joystick,

  formulaInput: q("#axesFormula"),
  formulaStatusText: q("#formulaStatus"),

  panelSelect: function (target) {
    this.currentPanelName = target;

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

      this.blockly.updateTelemetry(t);
    };

    this.timerKeepAlive = setInterval(() => {
      this.mur.controlInfo();
    }, 1500);

    this.joystick.init();

    this.formulaInput.value = this.joystick.axisFormulaDefault;

    this.joystickTimer = setInterval(() => {
      if (this.currentPanelName === "joystick") {
        var max_power = 50

        // console.log(JSON.stringify(this.joystick.axes))

        var yaw = this.joystick.axes.yaw
        var forward =  this.joystick.axes.forward
        var depth =  this.joystick.axes.vertical

        /* short aliases for axes */
        var x = yaw
        var y = forward
        var z = depth

        var a = 0
        var b = 0
        var c = 0
        var d = 0

        var axisFormulaOk = false

        try {
          eval(this.formulaInput.value)
          axisFormulaOk = true
        } catch (e) {
          a = +yaw + forward
          b = +yaw - forward
          c = +depth
          d = -depth
          axisFormulaOk = false
        }

        a = clamp(a, -max_power, max_power)
        b = clamp(b, -max_power, max_power)
        c = clamp(c, -max_power, max_power)
        d = clamp(d, -max_power, max_power)

        this.formulaStatusText.innerText = axisFormulaOk ? "formula ok" : "formula error";
        this.formulaStatusText.innerText += `\npowers: ${a}, ${b}, ${c}, ${d}`

        var regs = protocol.regulators
        regs.yaw = false // TODO
        regs.depth = false // TODO

        const data = {
          direct_power: [
            a,
            b,
            c,
            d
          ],
          direct_mode: true ? 0b00001111 : 0x00, // TODO
          axes_speed: [
            x,
            y,
            0,
            z
          ],
          axes_regulators: regs.pack(), // TODO
          target_yaw: null,
          actuator_power: [0, 0]
        }

        this.mur.controlContext(data)
        // console.log("send " + JSON.stringify(data))
      }
    }, 100);
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