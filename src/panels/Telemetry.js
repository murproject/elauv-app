import Panel from './Panel'
import mur from '/src/vehicle/apiGameMur.js'
import Icon from '/src/components/Icon'
import Button from '../components/Button'
import Utils from '/src/utils/Utils'

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

    this.feedbacksStatesOld = {}

    /* TODO: only for testing during development! */

    this.rsocStats = JSON.parse(Utils.notNull(localStorage.rsocStats, "[]"));

    this.rsocStatscollector = setInterval(() => {
      if ((Date.now() - mur.lastUpdatedDate) < 1000) {
        const currentStats = [
          mur.lastUpdatedDate,
          mur.telemetry.battRsoc,
          mur.telemetry.battVolts,
          mur.telemetry.battAmps,
        ];
        this.rsocStats.push(currentStats);
        console.log(currentStats);
        localStorage.rsocStats = JSON.stringify(this.rsocStats);
      }
    }, 25 * 1000);

    /* TODO TODO TODO */

    // this.setInterval(this.updateFeedbacks, 1000);
  }

  makeFeedbackIcons() {
    // this.feedbackBox = document.createElement("div");
    // this.feedbackBox.classList.add("buttons-group");
    // this.feedbackBox.id = "telemetry-feedback-box";

    this.feedbackBox = document.querySelector('#telemetry-feedback-box');

    this.feedbackIcons = {};

    const feedbacks = [
      {name: 'solenoid',  color: 'light',   pulseOnce: false,  icon: '../magnet-off'},
      {name: 'motors',    color: 'light',   pulseOnce: false,  icon: '../fan-off'},
      {name: 'tap',       color: 'light',   pulseOnce: true,  icon: '../cursor-default-click'},
      {name: 'tap2x',     color: 'light',   pulseOnce: true,  icon: '../cursor-click-2x'},
    ];

    feedbacks.forEach(feedback => {
      const feedbackIcon = new Button({
        name: feedback.name,
        text: '',
        type: 'panel-feedback',
        action: undefined,
        icon: feedback.icon,
        iconClasses: `big ${feedback.pulseOnce ? 'pulse-once' : 'pulse'}`,
        iconColor: feedback.color,
        enabled: false,
      });

      // feedbackIcon.setIcon(feedback.icon, feedback.color, `big ${feedback.pulse ? 'pulse' : ''}`);
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

    this.textElement.innerHTML = telemetryText;
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
      // this.feedbackIcons.motors.setActive(mur.telemetry.battRsoc < 1); // TODO! //
      this.feedbackIcons.solenoid.setActive(mur.telemetry.feedback.solenoidRelaxing);

      // this.feedbackIcons.solenoid.setActive(true);

      if (mur.telemetry.feedback.imuDoubleTap) {
        this.feedbackIcons.tap2x.setActive(true);
        this.feedbackIcons.tap.setActive(false);
        if (!this.feedbacksStatesOld.tapDouble) {
          console.log("vibrate");
          navigator.vibrate(150);
        }
      } else if (mur.telemetry.feedback.imuTap) {
        this.feedbackIcons.tap2x.setActive(false);
        this.feedbackIcons.tap.setActive(true);
        if (!this.feedbacksStatesOld.tap) {
          console.log("vibrate");
          navigator.vibrate(150);
        }
      } else {
        this.feedbackIcons.tap2x.setActive(false);
        this.feedbackIcons.tap.setActive(false);
      }

      this.feedbacksStatesOld.tap = mur.telemetry.feedback.imuTap;
      this.feedbacksStatesOld.tapDouble = mur.telemetry.feedback.imuDoubleTap;
    }

  }

  update(telemetryText) {
    this.updateStats(telemetryText);
    this.updateBattery();
    this.updateFeedbacks();
  }

}






