import nipplejs from 'nipplejs'

import Panel from './Panel'
import mur from '../vehicle/apiGameMur.js'
import protocol from '../vehicle/protocolGameMur'

import VizAuv from '/src/panels/VizAuv.js';
import App from '../App';

function clamp (value, min, max) {
  return Math.min(Math.max(min, Math.round(value)), max)
}

const axesFormulaDefault = `max_power = 100
threshold = 10
solenoid_time = 3000000

x = limit(x)
y = limit(y)
z = limit(z)

a = - x + y
b = + z
c = + z
d = + x + y

// x = yaw
// y = forward
// z = depth
`;

const nippleConfig = {};

export default class Joystick extends Panel {

  begin() {
    this.name = "Телеуправление";

    this.html = /*html*/`
      <div class="container">
        <div class="row">
          <div class="push-button" id="buttonSolenoidOn">Включить<br>магнит</div>
          <div class="push-button" id="buttonSolenoidOff">Выключить<br>магнит</div>
        </div>

        <div class="row">
          <textarea id="axesFormula" spellcheck="false" class="hidden"
                    rows="15" cols="20" name="text" style="margin-right: 1em; width: 48%;">
          </textarea>
          <div style="margin:auto" id="formulaStatus"></div>
        </div>

        <div class="vertical-filler"></div>

        <canvas class="zdog-canvas" width="350" height="350"></canvas>

        <div class="vertical-filler"></div>

        <div class="row justify-content-center joystick-outer-margin">
          <div class="nipple-wrapper" id="nipple0"></div>
          <div class="nipple-wrapper" id="nipple1"></div>
        </div>

        <div class="vertical-filler"></div>

      </div>
    `
  }


  init() {
    this.setIcon('gamepad');

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
      // TODO: bug, need to clear timer on solenoidOff!!
      // setTimeout(() => this.solenoidButton.classList.remove('disabled'), this.solenoidTime + 10000);
    };

    this.solenoidOffButton = this.q("#buttonSolenoidOff");
    this.solenoidOffButton.onclick = () => {
      this.solenoidButton.classList.remove('disabled');
      this.solenoidTriggered = false;
    };

    this.vizauv = VizAuv.makeVizauv(this);

    setInterval(() => {
      let context = {
        motors: {
          hl: 0,
          hr: 0,
          vl: 0,
          vr: 0,
        },

        rot: {
          yaw: 0,
          pitch: 0,
          roll: 0,
        },

        leds: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ]
      };

      if ('direct_power' in mur.context) {
        context.motors.hl = mur.context.direct_power[0];
        context.motors.vl = mur.context.direct_power[1];
        context.motors.vr = mur.context.direct_power[2];
        context.motors.hr = mur.context.direct_power[3];

        if (App.panels.blockly.scriptStatus === 'running') {
          context.leds[0] = [mur.context.leds[0 * 3 + 0], mur.context.leds[0 * 3 + 1], mur.context.leds[0 * 3 + 0 + 2]];
          context.leds[1] = [mur.context.leds[1 * 3 + 0], mur.context.leds[1 * 3 + 1], mur.context.leds[1 * 3 + 0 + 2]];
          context.leds[2] = [mur.context.leds[2 * 3 + 0], mur.context.leds[2 * 3 + 1], mur.context.leds[2 * 3 + 0 + 2]];
          context.leds[3] = [mur.context.leds[3 * 3 + 0], mur.context.leds[3 * 3 + 1], mur.context.leds[3 * 3 + 0 + 2]];
        } else {
          context.leds[1] = [0, context.motors.hl > 0 ? 0 : context.motors.hl * 2.55, context.motors.hl < 0 ? 0 : context.motors.hl * 2.55];
          context.leds[0] = [0, context.motors.vl > 0 ? 0 : context.motors.vl * 2.55, context.motors.vl < 0 ? 0 : context.motors.vl * 2.55];
          context.leds[3] = [0, context.motors.vr > 0 ? 0 : context.motors.vr * 2.55, context.motors.vr < 0 ? 0 : context.motors.vr * 2.55];
          context.leds[2] = [0, context.motors.hr > 0 ? 0 : context.motors.hr * 2.55, context.motors.hr < 0 ? 0 : context.motors.hr * 2.55];
        }

        // console.log(context.leds[0]);
      }

      if ('imuYaw' in mur.telemetry) {
        context.rot.yaw = mur.telemetry.imuYaw;
        context.rot.pitch = mur.telemetry.imuPitch;
        context.rot.roll = mur.telemetry.imuRoll;
      }

      this.vizauv.updContext(context);
    }, 100);
  }


  normalizeAxis(val) {
    return Math.round(val * 100);
  }


  initNipples() {
    this.nipple0 = nipplejs.create({
        zone: this.q('#nipple0'),
        mode: 'static',
        position: {left: '50%', top: '50%'},
        color: '#006688',
        restOpacity: 1.0,
        size: 150,

    });

    this.nipple1 = nipplejs.create({
        zone: this.q('#nipple1'),
        mode: 'static',
        position: {left: '50%', top: '50%'},
        color: '#006688',
        lockY: true,
        restOpacity: 1.0,
        size: 150,

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

    var threshold = 0;

    function limit(val) {
      return Math.abs(val) >= threshold ? val : 0.0;
    }

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

    a = a / 100 * max_power;
    b = b / 100 * max_power;
    c = c / 100 * max_power;
    d = d / 100 * max_power;

    max_power = Math.min(max_power, 100);

    a = clamp(a, -max_power, max_power);
    b = clamp(b, -max_power, max_power);
    c = clamp(c, -max_power, max_power);
    d = clamp(d, -max_power, max_power);

    const pretty = {
      a: String(a).padStart(4),
      b: String(b).padStart(4),
      c: String(c).padStart(4),
      d: String(d).padStart(4),
    };

    // this.formulaStatusText.innerText = axisFormulaOk ? "formula ok" : "formula error";
    // this.formulaStatusText.innerText = ""
    this.formulaStatusText.innerText =
      `
  Тяга на
движителях:

  A:${pretty.a}
  B:${pretty.b}
  C:${pretty.c}
  D:${pretty.d}`;

    this.solenoidTime = solenoid_time;

    return {
      axes: {x: x, y: y, z: z},
      motors: [a, b, c, d],
    }
  }


  update() {
    if (this.active) {
      const powers = this.computePowers();

      if (App.panels.blockly.scriptStatus === 'running') {
        return;
      }

      var regs = protocol.regulators;
      regs.yaw = false; // TODO
      regs.pitch = false;
      regs.roll = false;
      regs.depth = false; // TODO
      regs.isJoystick = true;

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
          0, // TODO: rearrange
          powers.axes.z
        ],
        axes_regulators: regs.pack(), // TODO
        target_yaw: null,
        actuator_power: [solenoidPower, solenoidPower],
        leds: [0,0,0,0,0,0,0,0,0,0,0,0],
      };

      mur.controlContext(data);
    }
  }

}