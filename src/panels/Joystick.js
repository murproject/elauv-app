/* eslint-disable prefer-const */
import nipplejs from 'nipplejs';

import Panel from './Panel';
import mur from '../vehicle/api.js';
import protocol from '../vehicle/protocol';

import VizAuv from '/src/panels/VizAuv.js';
import SettingsStorage from '/src/utils/SettingsStorage';
import Button from '/src/components/Button.js';
import App from '../App';

function clamp(value, min, max) {
  return Math.min(Math.max(min, Math.round(value)), max);
}

const axesFormulaDefault = `max_power = 100
threshold = 10

x = limit(x)
y = limit(y)
z = limit(z)

a = + x + y
b = - x + y
c = + z
d = + z

// x = yaw
// y = forward
// z = depth
`;

const nippleConfig = {};

export default class Joystick extends Panel {
  begin() {
    this.name = 'Телеуправление';

    this.html = /*html*/`
      <div class="container">
        <div class="row">
          <textarea id="axesFormula" spellcheck="false" class="hidden"
                    rows="15" cols="20" name="text" style="margin-right: 1em; width: 48%;">
          </textarea>
          <div style="margin:auto" id="formulaStatus"></div>
        </div>

        <div class="vertical-filler"></div>

        <canvas class="zdog-canvas" width="350" height="350"></canvas>

        <div class="vertical-filler"></div>

        <div id="nipples-container" class="row justify-content-center joystick-outer-margin">
          <div class="nipple-wrapper" id="nipple0"></div>
          <div class="nipple-wrapper" id="nipple1"></div>
        </div>

        <div id='solenoid-button-row' class="row buttons-collapsed"></div>
      </div>
    `;
  }


  init() {
    this.setIcon('gamepad');

    this.axes = {
      yaw: 0,
      forward: 0,
      side: 0,
      vertical: 0,
    };

    this.formulaStatusText = this.q('#formulaStatus');
    this.formulaInput = this.q('#axesFormula');
    this.formulaInput.value = axesFormulaDefault;

    this.updateTimer = this.setInterval(this.update, 100);

    this.solenoidButton = new Button({
      name: 'solenoidButton',
      text: 'Включить<br>магнит',
      icon: 'magnet',
      classes: 'button-vertical',
      action: () => this.triggerSolenoid(),
      enabled: true,
    });

    this.solenoidButton.style.minWidth = '5em';
    this.solenoidTriggered = false;
    this.solenoidButton.inject(this.q('#solenoid-button-row'));
    this.setInterval(this.updateSolenoidButton, 500);
    this.updateSolenoidButton();

    this.initNipples();

    if (SettingsStorage.get('enableVizAuv')) {
      this.vizauv = VizAuv.makeVizauv(this);
      this.updateVizAuvContext();

      setInterval(() => {
        if (this.active) {
          this.updateVizAuvContext();
        }
      }, 100);
    }
  }

  onActiveChanged(active) {
    const blockControls = 'blockly' in App.panels ?
      App.panels.blockly.scriptStatus == 'running' : false;

    this.q('#nipples-container').classList.toggle('disabled', blockControls);
    this.q('#nipples-container').classList.toggle('opacity-0', blockControls);
    this.q('#solenoid-button-row').classList.toggle('disabled', blockControls);
    this.q('#solenoid-button-row').classList.toggle('opacity-0', blockControls);
  }

  updateVizAuvContext() {
    const context = {
      motors: {
        hl: 0,
        hr: 0,
        vf: 0,
        vb: 0,
      },

      auto_axes: {
        hl: false,
        hr: false,
        vf: false,
        vb: false,
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
      ],
    };

    if ('direct_power' in mur.context) {
      context.motors.hl = mur.context.direct_power[0];
      context.motors.hr = mur.context.direct_power[1];
      context.motors.vf = mur.context.direct_power[2];
      context.motors.vb = mur.context.direct_power[3];

      let speed_yaw = mur.context.axes_speed[0];
      const speed_forward = mur.context.axes_speed[1];
      const speed_vertical = mur.context.axes_speed[2];

      if (Boolean(mur.context.axes_regulators & (1 << 0))) {
        speed_yaw = 0;
      }

      if (!Boolean(mur.context.direct_mode & (1 << 0))) {
        context.auto_axes.hl = true;
        context.motors.hl = (+ speed_yaw + speed_forward);
      }

      if (!Boolean(mur.context.direct_mode & (1 << 1))) {
        context.auto_axes.hr = true;
        context.motors.hr = (- speed_yaw + speed_forward);
      }

      if (!Boolean(mur.context.direct_mode & (1 << 2))) {
        context.auto_axes.vf = true;
        context.motors.vf = (+ speed_vertical);
      }

      if (!Boolean(mur.context.direct_mode & (1 << 3))) {
        context.auto_axes.vb = true;
        context.motors.vb = (+ speed_vertical);
      }

      if (Boolean(mur.context.axes_regulators & (1 << 0)) && 'motorsPower' in mur.telemetry) {
        context.motors.hl = mur.telemetry.motorsPower[0];
        context.motors.hr = mur.telemetry.motorsPower[1];
      }

      if (App.panels.blockly.scriptStatus === 'running') {
        context.leds[0] = [mur.context.leds[0 * 3 + 0], mur.context.leds[0 * 3 + 1], mur.context.leds[0 * 3 + 0 + 2]];
        context.leds[1] = [mur.context.leds[1 * 3 + 0], mur.context.leds[1 * 3 + 1], mur.context.leds[1 * 3 + 0 + 2]];
        context.leds[2] = [mur.context.leds[2 * 3 + 0], mur.context.leds[2 * 3 + 1], mur.context.leds[2 * 3 + 0 + 2]];
        context.leds[3] = [mur.context.leds[3 * 3 + 0], mur.context.leds[3 * 3 + 1], mur.context.leds[3 * 3 + 0 + 2]];
      } else {
        context.leds[0] = [0, context.motors.vf > 0 ? 0 : context.motors.vf * 2.55, context.motors.vf < 0 ? 0 : context.motors.vf * 2.55];
        context.leds[1] = [0, context.motors.hr > 0 ? 0 : context.motors.hr * 2.55, context.motors.hr < 0 ? 0 : context.motors.hr * 2.55];
        context.leds[2] = [0, context.motors.hl > 0 ? 0 : context.motors.hl * 2.55, context.motors.hl < 0 ? 0 : context.motors.hl * 2.55];
        context.leds[3] = [0, context.motors.vb > 0 ? 0 : context.motors.vb * 2.55, context.motors.vb < 0 ? 0 : context.motors.vb * 2.55];
      }
    }

    if ('imuYaw' in mur.telemetry) {
      context.rot.yaw = mur.telemetry.imuYaw;
      context.rot.pitch = mur.telemetry.imuPitch;
      context.rot.roll = mur.telemetry.imuRoll;
    }

    this.vizauv.updContext(context);
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

    this.nipple0.on('move', (evt, data) => {
      this.axes.yaw = this.normalizeAxis(data.vector.x);
      this.axes.forward = this.normalizeAxis(data.vector.y);
    });

    this.nipple1.on('move', (evt, data) => {
      this.axes.side = this.normalizeAxis(data.vector.x);
      this.axes.vertical = this.normalizeAxis(data.vector.y);
    });

    this.nipple0.on('end', (evt) => {
      this.axes.yaw = 0;
      this.axes.forward = 0;
    });

    this.nipple1.on('end', (evt) => {
      this.axes.side = 0;
      this.axes.vertical = 0;
    });
  }


  computePowers() {
    let max_power = 0;

    let yaw = this.axes.yaw;
    let forward = this.axes.forward;
    let depth = this.axes.vertical;

    /* short aliases for axes */
    let x = yaw;
    let y = forward;
    let z = depth;

    let a = 0;
    let b = 0;
    let c = 0;
    let d = 0;

    let threshold = 0;

    function limit(val) {
      return Math.abs(val) >= threshold ? val : 0.0;
    }

    let axisFormulaOk = false;

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
    // TODO: don't wok with speed axes!!!
      `
  Тяга на
движителях:

  A:${pretty.a}
  B:${pretty.b}
  C:${pretty.c}
  D:${pretty.d}`;

    return {
      axes: {x: x, y: y, z: z},
      motors: [a, b, c, d],
    };
  }


  update() {
    if (this.active) {
      const powers = this.computePowers();

      if (App.panels.blockly.scriptStatus === 'running') {
        return;
      }

      const regs = protocol.regulators;
      regs.yaw = false; // TODO
      regs.pitch = false;
      regs.roll = false;
      regs.depth = false; // TODO
      regs.isJoystick = true;

      const solenoidPower = this.solenoidTriggered ? 100 : 0;

      // TODO: use axes_speed instead of "manual" calculating

      const data = {
        direct_power: [
          powers.motors[0],
          powers.motors[1],
          powers.motors[2],
          powers.motors[3],
        ],
        direct_mode: true ? 0b00001111 : 0x00, // TODO
        axes_speed: [
          powers.axes.x,
          powers.axes.y,
          powers.axes.z,
          0, // TODO: rearrange
        ],
        axes_regulators: regs.pack(), // TODO
        target_yaw: 0,
        actuator_power: [solenoidPower, 0],
        leds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };

      mur.controlContext(data);
    }
  }

  triggerSolenoid() {
    this.solenoidTriggered = !this.solenoidTriggered;
    this.updateSolenoidButton();
  }

  updateSolenoidButton() {
    if (!this.active) {
      return;
    }

    const relaxing = 'feedback' in mur.telemetry && mur.telemetry.feedback.solenoidRelaxing;

    if (!this.solenoidTriggered) {
      this.solenoidButton.setEnabled(!relaxing);
    } else if (!this.solenoidTriggered) {
      this.solenoidButton.setEnabled(true);
    }

    this.solenoidButton.attrs.text =
      relaxing ? 'Магнит<br>остывает…' :
      this.solenoidTriggered ? 'Выключить<br>магнит' : 'Включить<br>магнит';

    this.solenoidButton.setIcon(
      this.solenoidTriggered || relaxing ? 'magnet-off' : 'magnet-on',
      this.solenoidTriggered ? 'orange' : 'cyan',
    );
  }
}
