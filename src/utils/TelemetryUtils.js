import mur from '/src/vehicle/api';
import App from '/src/App';
import Icon from '/src/components/Icon';
import Button from '../components/Button';
import SettingsStorage from '/src/utils/SettingsStorage';

export default {
  feedbackBox: undefined,
  feedbacksStatesOld: {},

  rsocLevels: {
    low: 10,
    medium: 40,
    high: 70,
  },

  makeBatteryIcon(forced = undefined) {
    const rsoc = forced !== undefined ? forced : ('telemetry') ? mur.telemetry.battRsoc : -1;

    if (!('telemetry' in mur) || !('battRsoc' in mur.telemetry) || !(mur.conn.state == 'open')) {
      return {
        name: 'bluetooth',
        color: 'blue-dark',
      };
    }

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

      // feedbackIcon.setIcon(feedback.icon, feedback.color, `big ${feedback.pulse ? 'pulse' : ''}`);
      feedbackIcon.inject(this.feedbackBox);
      this.feedbackIcons[feedback.name] = feedbackIcon;
    });

    // document.querySelector("#head").appendChild(this.feedbackBox);
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

};
