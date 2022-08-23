import mur from '/src/vehicle/api';
import App from '/src/App';
import Icon from '/src/components/Icon';
import Button from '../components/Button';
import SettingsStorage from '/src/utils/SettingsStorage';
import Utils from './Utils';
import AppVersion from '/src/utils/AppVersion';

export default {
  feedbackBox: undefined,
  feedbacksStatesOld: {},

  stats: {},
  solenoidWasTurnedOn: 0,
  solenoidWasRelaxing: 0,

  rsocStats: JSON.parse(Utils.notNull(localStorage.rsocStats, '[]')),
  rsocStatscollector: AppVersion.isDevBuild ? setInterval(() => this.collectRsocStats(), 30 * 1000) : undefined,

  rsocLevels: {
    low: 10,
    medium: 40,
    high: 70,
  },

  collectRsocStats() {
    if ((Date.now() - mur.lastUpdatedDate) < 1000) {
      const currentStats = [
        mur.lastUpdatedDate,
        mur.telemetry.battRsoc.toFixed(2),
        mur.telemetry.battVolts.toFixed(2),
        mur.telemetry.battAmps.toFixed(2),
        mur.telemetry.battTemp.toFixed(2),
        this.solenoidWasTurnedOn,
        this.solenoidWasRelaxing,
      ];
      this.rsocStats.push(currentStats);
      console.log(currentStats);
      localStorage.rsocStats = JSON.stringify(this.rsocStats);

      this.solenoidWasTurnedOn = 0;
      this.solenoidWasRelaxing = 0;
    }
  },

  makeBatteryIcon(forced = undefined) {
    if (!('battRsoc' in mur.telemetry) || !(mur.conn.state == 'open')) {
      return {
        name: 'bluetooth',
        color: 'blue-dark',
      };
    }

    const rsoc = forced !== undefined ? forced : mur.telemetry.battRsoc;

    const batteryIcon = rsoc < this.rsocLevels.low ? 'outline' :
                        rsoc < this.rsocLevels.medium ? 'low' :
                        rsoc < this.rsocLevels.high ? 'medium' :
                        rsoc >= this.rsocLevels.high ? 'high' : 'unknown';

    const batteryColor = rsoc < this.rsocLevels.low ? 'red' :
                         rsoc < this.rsocLevels.medium ? 'orange' :
                         rsoc < this.rsocLevels.high ? 'yellow' :
                         rsoc >= this.rsocLevels.high ? 'green' : 'blue-dark';

    const batteryCharge = mur.conn.state === 'open' && mur.telemetry.battAmps > 0 ? 'charging-' : '';
    const iconName = mur.conn.state === 'open' ? `battery-${batteryCharge}${batteryIcon}` : 'bluetooth';

    return {
      name: iconName,
      color: batteryColor,
    };
  },

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
    telemetryText += JSON.stringify(mur.context, null, '  ');

    this.telemetryText = telemetryText;
  },

  makeFeedbackIcons() {
    this.feedbackBox = document.querySelector('#telemetry-feedback-box');

    this.feedbackIcons = {};

    const feedbacks = [
      {name: 'solenoid', color: 'light', pulseOnce: false, icon: '../magnet-off'},
      {name: 'motors', color: 'light', pulseOnce: false, icon: '../fan-off'},
      {name: 'tap', color: 'light', pulseOnce: true, icon: '../cursor-default-click'},
      {name: 'tap2x', color: 'light', pulseOnce: true, icon: '../cursor-click-2x'},
    ];

    feedbacks.forEach((feedback) => {
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

      feedbackIcon.inject(this.feedbackBox);
      this.feedbackIcons[feedback.name] = feedbackIcon;
    });
  },

  updateFeedbacks() {
    if ('feedback' in mur.telemetry) {
      this.feedbackIcons.motors.setActive(mur.telemetry.feedback.pilotingBlocked);
      this.feedbackIcons.solenoid.setActive(mur.telemetry.feedback.solenoidRelaxing);

      const vibrateEnabled = SettingsStorage.get('vibrateOnTap');

      if (mur.telemetry.feedback.imuDoubleTap) {
        this.feedbackIcons.tap2x.setActive(true);
        this.feedbackIcons.tap.setActive(false);
        if (!this.feedbacksStatesOld.tapDouble && vibrateEnabled) {
          console.log('vibrate');
          navigator.vibrate(150);
        }
      } else if (mur.telemetry.feedback.imuTap) {
        this.feedbackIcons.tap2x.setActive(false);
        this.feedbackIcons.tap.setActive(true);
        if (!this.feedbacksStatesOld.tap && vibrateEnabled) {
          console.log('vibrate');
          navigator.vibrate(150);
        }
      } else {
        this.feedbackIcons.tap2x.setActive(false);
        this.feedbackIcons.tap.setActive(false);
      }

      this.feedbacksStatesOld.tap = mur.telemetry.feedback.imuTap;
      this.feedbacksStatesOld.tapDouble = mur.telemetry.feedback.imuDoubleTap;
    } else {
      this.feedbackIcons.motors.setActive(false);
      this.feedbackIcons.solenoid.setActive(false);
      this.feedbackIcons.tap2x.setActive(false);
      this.feedbackIcons.tap.setActive(false);
    }
  },

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
  },

  update(telemetryText) {
    if ('actuator_power' in mur.context) {
      this.solenoidWasTurnedOn |= mur.context.actuator_power[0] > 0;
    }

    if ('feedback' in mur.telemetry) {
      this.solenoidWasRelaxing |= mur.telemetry.feedback.solenoidRelaxing;
    }

    this.updateStats(telemetryText);
    this.updateFeedbacks();
  },

};
