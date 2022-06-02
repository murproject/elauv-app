import nipplejs from 'nipplejs'

import Panel from './Panel'
import mur from '../vehicle/apiGameMur.js'
import protocol from '../vehicle/protocolGameMur'

function clamp (value, min, max) {
  return Math.round(Math.min(Math.max(min, value), max))
}

const axesFormulaDefault = `max_power = 75
solenoid_time = 30000

a = - x + y
b = + z
c = + z
d = + x + y

// x = yaw
// y = forward
// z = depth
`;

export default class Joystick extends Panel {

  begin() {
    this.name = "Joystick";

    this.html = /*html*/`
      <div class="nipple-wrapper" id="nipple0"></div>
      <div class="nipple-wrapper" id="nipple1"></div>
      <br>

      <textarea id="axesFormula" spellcheck="false" rows="15" cols="40" name="text"></textarea>
      <div id="formulaStatus"></div>
      <br>

      <div class="push-button" id="buttonSolenoidOn">Solenoid on</div>
    `
  }


  init() {
    this.axes = {
      yaw: 0,
      forward: 0,
      side: 0,
      vertical: 0,
    };

    this.formulaStatusText = this.q("#formulaStatus");
    this.formulaInput = this.q("#axesFormula");
    this.formulaInput.value = axesFormulaDefault;

    this.initNipples();
    this.updateTimer = this.setInterval(this.update, 100);
    this.solenoidTriggered = false;
    this.solenoidTime = 1000;

    this.solenoidButton = this.q("#buttonSolenoidOn");
    this.solenoidButton.onclick = () => {
      this.solenoidButton.classList.add('disabled');
      this.solenoidTriggered = true;
      setTimeout(() => this.solenoidTriggered = false, this.solenoidTime);
      setTimeout(() => this.solenoidButton.classList.remove('disabled'), this.solenoidTime + 10000);
    };
  }


  normalizeAxis(val) {
    return Math.round(val * 100);
  }


  initNipples() {
    this.nipple0 = nipplejs.create({
        zone: this.q('#nipple0'),
        mode: 'static',
        position: {left: '50%', top: '50%'},
        color: 'black'
    });

    this.nipple1 = nipplejs.create({
        zone: this.q('#nipple1'),
        mode: 'static',
        position: {left: '50%', top: '50%'},
        color: 'black',
        lockY: true
    });

    this.nipple0.on("move", (evt, data) => {
        this.axes.yaw = this.normalizeAxis(data.vector.x);
        this.axes.forward = this.normalizeAxis(data.vector.y);
    })

    this.nipple1.on("move", (evt, data) => {
        this.axes.side = this.normalizeAxis(data.vector.x);
        this.axes.vertical = this.normalizeAxis(data.vector.y);
    })

    this.nipple0.on("end", (evt) => {
        this.axes.yaw = 0;
        this.axes.forward = 0;
    })

    this.nipple1.on("end", (evt) => {
        this.axes.side = 0;
        this.axes.vertical = 0;
    })
  }


  computePowers() {
    var max_power = 0;

    var yaw = this.axes.yaw;
    var forward = this.axes.forward;
    var depth = this.axes.vertical;

    var solenoid_time = 0;

    /* short aliases for axes */
    var x = yaw;
    var y = forward;
    var z = depth;

    var a = 0;
    var b = 0;
    var c = 0;
    var d = 0;

    var axisFormulaOk = false;

    try {
      eval(this.formulaInput.value);
      axisFormulaOk = true;
    } catch (e) {
      a = 0;
      b = 0;
      c = 0;
      d = 0;
      axisFormulaOk = false;
    }

    a = clamp(a, -max_power, max_power);
    b = clamp(b, -max_power, max_power);
    c = clamp(c, -max_power, max_power);
    d = clamp(d, -max_power, max_power);

    this.formulaStatusText.innerText = axisFormulaOk ? "formula ok" : "formula error";
    this.formulaStatusText.innerText += `\npowers: ${a}, ${b}, ${c}, ${d}`;

    this.solenoidTime = solenoid_time;

    return {
      axes: {x: x, y: y, z: z},
      motors: [a, b, c, d],
    }
  }


  update() {
    if (this.active) {
      const powers = this.computePowers();

      var regs = protocol.regulators;
      regs.yaw = false; // TODO
      regs.depth = false; // TODO

      let solenoidPower = this.solenoidTriggered ? 100 : 0;

      const data = {
        direct_power: [
          powers.motors[0],
          powers.motors[1],
          powers.motors[2],
          powers.motors[3]
        ],
        direct_mode: true ? 0b00001111 : 0x00, // TODO
        axes_speed: [
          powers.axes.x,
          powers.axes.y,
          0,
          powers.axes.z
        ],
        axes_regulators: regs.pack(), // TODO
        target_yaw: null,
        actuator_power: [solenoidPower, solenoidPower]
      };

      mur.controlContext(data);
    }
  }

}