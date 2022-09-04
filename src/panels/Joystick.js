import nipplejs from 'nipplejs';

import mur from '/src/vehicle/api.js';
import protocol from '/src/vehicle/protocol';

import App from '/src/App';
import Panel from './Panel';
import SettingsStorage from '/src/utils/SettingsStorage';
import Button from '/src/components/Button.js';
import VizAuv from '/src/panels/VizAuv.js';

/* Math utils */

function clamp(value, min, max) {
  return Math.min(Math.max(min, Math.round(value)), max);
}

function clampPower(value) {
  const maxPower = 100;
  return clamp(value, -maxPower, maxPower);
}

function limitAxis(val) {
  const threshold = 10;
  return Math.abs(val) >= threshold ? val : 0.0;
}

function calcRowOpacity(value) {
  value = Math.abs(value);
  return (value > 0 ? value + 50 : 30);
}

function toNum(value) {
  return typeof(value) !== 'number' || value === NaN ? 0 : value;
}

/* Context for 3D model of vehicle */

const contextVizAuv = {
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

export default class Joystick extends Panel {
  begin() {
    this.name = 'Телеуправление';

    this.html = /*html*/`
      <div class="container">
        <div class="row">
          <textarea id="axesFormula" spellcheck="false" class="hidden"
                    rows="15" cols="20" name="text" style="margin-right: 1em; width: 48%;">
          </textarea>
          <div id="thrusters-speed-feedback" class="margin-auto width-fill"></div>
        </div>

        <div class="vertical-filler"></div>

        <canvas class="zdog-canvas" width="350" height="350"></canvas>

        <div class="vertical-filler"></div>

        <div id="nipples-container" class="row justify-content-center joystick-outer-margin">
          <div class="nipple-wrapper" id="nipple-left"></div>
          <div class="nipple-wrapper" id="nipple-right"></div>
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

    this.speedFeedbackEl = this.q('#thrusters-speed-feedback');
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
    }

    this.updateVizAuvContext();

    setInterval(() => {
      if (this.active) {
        this.updateVizAuvContext();
      }
    }, 100);
  }

  onActiveChanged(active) {
    const blockControls = 'blockly' in App.panels ?
      App.panels.blockly.scriptStatus == 'running' : false;

    this.q('#nipples-container').classList.toggle('disabled', blockControls);
    this.q('#nipples-container').classList.toggle('opacity-0', blockControls);
    this.q('#solenoid-button-row').classList.toggle('disabled', blockControls);
    this.q('#solenoid-button-row').classList.toggle('opacity-0', blockControls);
  }


  normalizeAxis(val) {
    return Math.round(val * 100);
  }


  initNipples() {
    this.nippleleft = nipplejs.create({
      zone: this.q('#nipple-left'),
      mode: 'static',
      position: {left: '50%', top: '50%'},
      color: '#006688',
      restOpacity: 1.0,
      size: 150,

    });

    this.nippleright = nipplejs.create({
      zone: this.q('#nipple-right'),
      mode: 'static',
      position: {left: '50%', top: '50%'},
      color: '#006688',
      lockY: true,
      restOpacity: 1.0,
      size: 150,

    });

    this.nippleleft.on('move', (evt, data) => {
      this.axes.yaw = this.normalizeAxis(data.vector.x);
      this.axes.forward = this.normalizeAxis(data.vector.y);
    });

    this.nippleright.on('move', (evt, data) => {
      this.axes.side = this.normalizeAxis(data.vector.x);
      this.axes.vertical = this.normalizeAxis(data.vector.y);
    });

    this.nippleleft.on('end', (evt) => {
      this.axes.yaw = 0;
      this.axes.forward = 0;
    });

    this.nippleright.on('end', (evt) => {
      this.axes.side = 0;
      this.axes.vertical = 0;
    });
  }


  computePowers() {
    const yaw = limitAxis(this.axes.yaw);
    const forward = limitAxis(this.axes.forward);
    const depth = limitAxis(this.axes.vertical);

    const a = clampPower(+ yaw + forward);
    const b = clampPower(- yaw + forward);
    const c = clampPower(+ depth);
    const d = clampPower(+ depth);

    const pretty = {
      a: String(contextVizAuv.motors.hl),
      b: String(contextVizAuv.motors.hr),
      c: String(contextVizAuv.motors.vf),
      d: String(contextVizAuv.motors.vb),
    };

    this.speedFeedbackEl.innerHTML = /*html*/`
      <h3 class="normal">Тяга на<br>движителях:</h3>

      <div class="display-flex width-fill">
        <table class="motor-power-table">
          <tr style="opacity: ${calcRowOpacity(pretty.c)}%;">
            <td>C:</td>
            <td>${pretty.c}</td>
          </tr>
          <tr style="opacity: ${calcRowOpacity(pretty.a)}%;">
            <td>A:</td>
            <td>${pretty.a}</td>
          </tr>
        </table>

        <table class="motor-power-table">
          <tr style="opacity: ${calcRowOpacity(pretty.d)}%;">
            <td>D:</td>
            <td>${pretty.d}</td>
          </tr>
          <tr style="opacity: ${calcRowOpacity(pretty.b)}%;">
            <td>B:</td>
            <td>${pretty.b}</td>
          </tr>
        </table>
      </div>
    `;

    return {
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
      regs.yaw = false;
      regs.pitch = false;
      regs.roll = false;
      regs.depth = false;
      regs.isJoystick = true;

      const solenoidPower = this.solenoidTriggered ? 100 : 0;

      const data = {
        direct_power: [
          powers.motors[0],
          powers.motors[1],
          powers.motors[2],
          powers.motors[3],
        ],
        direct_mode: 0b00001111,
        axes_speed: [
          0,
          0,
          0,
          0,
        ],
        axes_regulators: regs.pack(),
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
    } else {
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


  checkDirectMode(motorBitmask) {
    return Boolean(mur.context.direct_mode & motorBitmask);
  }


  getLedColor(index) {
    return [
      mur.context.leds[index * 3 + 0],
      mur.context.leds[index * 3 + 1],
      mur.context.leds[index * 3 + 0 + 2],
    ];
  }


  makeLedMotorFeedback(power) {
    return [
      0,
      power > 0 ? 0 : power * 2.55,
      power < 0 ? 0 : power * 2.55,
    ];
  }


  updateVizAuvContext() {
    if ('direct_power' in mur.context) {
      contextVizAuv.motors.hl = toNum(mur.context.direct_power[0]);
      contextVizAuv.motors.hr = toNum(mur.context.direct_power[1]);
      contextVizAuv.motors.vf = toNum(mur.context.direct_power[2]);
      contextVizAuv.motors.vb = toNum(mur.context.direct_power[3]);

      contextVizAuv.auto_axes.hl = false;
      contextVizAuv.auto_axes.hr = false;
      contextVizAuv.auto_axes.vf = false;
      contextVizAuv.auto_axes.vb = false;

      let speedYaw = mur.context.axes_speed[0];
      const speedForward = mur.context.axes_speed[1];
      const speedVertical = mur.context.axes_speed[2];
      const isYawRegulatorActive = Boolean(mur.context.axes_regulators & protocol.regulatorsMask.yaw);

      if (isYawRegulatorActive) {
        /* Yaw axis speed is used for P coefficient of PID regulator when regualtor is active */
        speedYaw = 0;
      }

      /* Calculate powers for motors in auto speed axis mode (not direct mode) */

      if (!this.checkDirectMode(protocol.motorIndexMask.hl)) {
        contextVizAuv.auto_axes.hl = true;
        contextVizAuv.motors.hl = clampPower(+ speedYaw + speedForward);
      }

      if (!this.checkDirectMode(protocol.motorIndexMask.hr)) {
        contextVizAuv.auto_axes.hr = true;
        contextVizAuv.motors.hr = clampPower(- speedYaw + speedForward);
      }

      if (!this.checkDirectMode(protocol.motorIndexMask.vf)) {
        contextVizAuv.auto_axes.vf = true;
        contextVizAuv.motors.vf = clampPower(+ speedVertical);
      }

      if (!this.checkDirectMode(protocol.motorIndexMask.vb)) {
        contextVizAuv.auto_axes.vb = true;
        contextVizAuv.motors.vb = clampPower(+ speedVertical);
      }

      if (isYawRegulatorActive && 'motorsPower' in mur.telemetry) {
        /* Use motors power feedback from vehicle if yaw regulator is active and telemetry is available */
        contextVizAuv.motors.hl = toNum(mur.telemetry.motorsPower[0]);
        contextVizAuv.motors.hr = toNum(mur.telemetry.motorsPower[1]);
      }

      if (App.panels.blockly.scriptStatus === 'running') {
        for (let led = 0; led < 4; led++) {
          contextVizAuv.leds[led] = this.getLedColor(led);
        }
      } else {
        contextVizAuv.leds[0] = this.makeLedMotorFeedback(contextVizAuv.motors.vf);
        contextVizAuv.leds[1] = this.makeLedMotorFeedback(contextVizAuv.motors.hr);
        contextVizAuv.leds[2] = this.makeLedMotorFeedback(contextVizAuv.motors.hl);
        contextVizAuv.leds[3] = this.makeLedMotorFeedback(contextVizAuv.motors.vb);
      }
    }

    if ('imuYaw' in mur.telemetry) {
      contextVizAuv.rot.yaw = mur.telemetry.imuYaw;
      contextVizAuv.rot.pitch = mur.telemetry.imuPitch;
      contextVizAuv.rot.roll = mur.telemetry.imuRoll;
    }

    if (this.vizauv) {
      this.vizauv.updContext(contextVizAuv);
    }
  }
}
