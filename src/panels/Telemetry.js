import Panel from './Panel'
import mur from '/src/vehicle/apiGameMur.js'
import Icon from '/src/components/Icon'
import Button from '../components/Button'

export default class Telemetry extends Panel {

  begin() {
    this.name = "Телеметрия";

    this.html = /*html*/`
      <div class="container">
        <div id="telemetryText" class="monospace soft-edges-vertical">Waiting for connection…</div>
        <div class="push-button" id="resetStats">Reset stats</div>
      </div>
    `
  }


  init() {
    this.battIconName = 'battery-unknown';
    this.oldBattIconName = this.battIconName;
    this.setIcon(this.battIconName);
    this.textElement = this.q("#telemetryText");

    this.stats = {};

    this.resetStatsButton = this.q("#resetStats");
    this.resetStatsButton.onclick = () => this.resetStats();

    this.makeFeedbackIcons()

    this.resetStats();

    setInterval(() => {
      if ('direct_power' in mur.context) {
        context.motors.hl = mur.context.direct_power[0];
        context.motors.vl = mur.context.direct_power[1];
        context.motors.vr = mur.context.direct_power[2];
        context.motors.hr = mur.context.direct_power[3];
      }

      if ('imuYaw' in mur.telemetry) {
        context.rot.yaw = mur.telemetry.imuYaw;
        context.rot.pitch = mur.telemetry.imuPitch;
        context.rot.roll = mur.telemetry.imuRoll;
      }

    }, 100);


    // this.setInterval(this.updateFeedbacks, 1000);
  }

  makeFeedbackIcons() {
    // this.feedbackBox = document.createElement("div");
    // this.feedbackBox.classList.add("buttons-group");
    // this.feedbackBox.id = "telemetry-feedback-box";

    this.feedbackBox = document.querySelector('#telemetry-feedback-box');

    this.feedbackIcons = {};

    const feedbacks = [
      {name: 'solenoid',  color: 'light',   pulse: true,  icon: '../magnet-off'},
      {name: 'motors',    color: 'light',   pulse: true,  icon: '../fan-off'},
      {name: 'tap',       color: 'light',  pulse: true,  icon: '../cursor-default-click'},
    ];

    feedbacks.forEach(feedback => {
      const feedbackIcon = new Button({
        name: feedback.name,
        text: '',
        type: 'panel-feedback',
        action: undefined,
        icon: feedback.icon,
        enabled: false,
      });

      feedbackIcon.setIcon(feedback.icon, feedback.color, `big ${feedback.pulse ? 'pulse' : ''}`);
      feedbackIcon.inject(this.feedbackBox);
      this.feedbackIcons[feedback.name] = feedbackIcon;
    });

    // document.querySelector("#head").appendChild(this.feedbackBox);
  }

  resetStats() {
    this.stats = {
      maxVolts: -Infinity,
      minVolts:  Infinity,
      maxAmps: -Infinity,
      minAmps:  Infinity,
      maxRsoc: -Infinity,
      minRsoc:  Infinity,
      maxTemp: -Infinity,
      minTemp:  Infinity,
      battState: null,
      lastTimestamp: null,
      ping: null,
    };

    this.update('');
  }

  updateStats(telemetryText) {
    if (this.active && telemetryText) {
      this.stats.maxVolts = Math.max(this.stats.maxVolts, mur.telemetry.battVolts).toFixed(2);
      this.stats.minVolts = Math.min(this.stats.minVolts, mur.telemetry.battVolts).toFixed(2);

      this.stats.maxAmps = Math.max(this.stats.maxAmps, mur.telemetry.battAmps).toFixed(2);
      this.stats.minAmps = Math.min(this.stats.minAmps, mur.telemetry.battAmps).toFixed(2);

      this.stats.maxRsoc = Math.max(this.stats.maxRsoc, mur.telemetry.battRsoc).toFixed(2);
      this.stats.minRsoc = Math.min(this.stats.minRsoc, mur.telemetry.battRsoc).toFixed(2);

      this.stats.maxTemp = Math.max(this.stats.maxTemp, mur.telemetry.battTemp).toFixed(2);
      this.stats.minTemp = Math.min(this.stats.minTemp, mur.telemetry.battTemp).toFixed(2);

      this.stats.battState = mur.telemetry.battAmps > 0 ? 'charging' : 'discharging';

      this.stats.lastTimestamp = mur.lastUpdatedDate.toLocaleString();
      this.stats.ping = mur.timePingDelta;


      telemetryText += '\n\n';
      telemetryText += JSON.stringify(this.stats, null, '  ');
    }

    telemetryText += '\n\ncontext = ';
    telemetryText += JSON.stringify(mur.context, null, '  ')

    this.textElement.innerText = telemetryText;
  }

  updateBattery() {
    const rsoc = ('telemetry' in mur) ? mur.telemetry.battRsoc : -1;

    const batteryText = mur.conn.state != 'open' || rsoc < 0 ? 'unknown' :
                        rsoc < 10 ? 'outline' :
                        rsoc < 40 ? 'low'     :
                        rsoc < 70 ? 'medium'  : 'high';

    const batteryColor = mur.conn.state != 'open' || rsoc < 0 ? 'dark' :
                         rsoc < 10 ? 'red'    :
                         rsoc < 40 ? 'orange' :
                         rsoc < 70 ? 'yellow' : 'green';

    const batteryCharge = mur.telemetry.battAmps > 0 ? 'charging-' : '';

    this.battIconName = `battery-${batteryCharge}${batteryText}`;

    if (this.oldBattIconName != this.battIconName) {
      this.setIcon(this.battIconName, batteryColor);
      this.oldBattIconName = this.battIconName;
    }
  }

  updateFeedbacks() {
    // mur.telemetry.feedback = {imuTap: true};
    // this.feedbackIcons.solenoid.setActive(true);
    // this.feedbackIcons.motors.setActive(true);
    // if (!'tap' in this.feedbackIcons) {
    //   return;
    // }

    if ('feedback' in mur.telemetry) {
      // mur.telemetry.feedback.motors.setActive(mur.telemetry.feedback.motorsDisabled);
      // mur.telemetry.feedback.solenoid.setActive(mur.telemetry.feedback.solenoidRelaxing);

      if (mur.telemetry.feedback.imuTap) {
        this.feedbackIcons.tap.setActive(true);
        setTimeout(() => this.feedbackIcons.tap.setActive(false), 500);
        navigator.vibrate(125);
      }
    }
  }

  update(telemetryText) {
    this.updateStats(telemetryText);
    this.updateBattery();
    this.updateFeedbacks();
  }

}






