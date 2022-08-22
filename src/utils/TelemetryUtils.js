import mur from '/src/vehicle/api';
import App from '/src/App';
import Icon from '/src/components/Icon';
import Button from '../components/Button';

export default {
  feedbackBox: undefined,

  rsocLevels: {
    low: 10,
    medium: 40,
    high: 70,
  },

  makeBatteryIcon() {
    const rsoc = forced !== undefined ? forced : ('telemetry' in mur) ? mur.telemetry.battRsoc : -1;

    const batteryIcon = mur.conn.state != 'open' ? 'unknown' :
      rsoc < rsocLevels.low ? 'outline' :
      rsoc < rsocLevels.medium ? 'low' :
      rsoc < rsocLevels.high ? 'medium' :
      rsoc >= rsocLevels.high ? 'high' : 'unknown';

    const batteryColor = mur.conn.state != 'open' ? 'blue-dark' :
      rsoc < rsocLevels.low ? 'red' :
      rsoc < rsocLevels.medium ? 'orange' :
      rsoc < rsocLevels.high ? 'yellow' :
      rsoc >= rsocLevels.high ? 'green' : 'blue-dark';

    const batteryCharge = mur.telemetry.battAmps > 0 ? 'charging-' : '';

    return {
      iconName: `battery-${batteryCharge}${batteryIcon}`,
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
    // mur.telemetry.feedback = {imuTap: true};
    // this.feedbackIcons.solenoid.setActive(true);
    // this.feedbackIcons.motors.setActive(true);
    // if (!'tap' in this.feedbackIcons) {
    //   return;
    // }

    if ('feedback' in mur.telemetry) {
      this.feedbackIcons.motors.setActive(mur.telemetry.feedback.pilotingBlocked);
      // this.feedbackIcons.motors.attrs.iconColor = mur.telemetry.feedback.pilotingBlocked && mur.telemetry.feedback.pilotingMode ? 'red' : 'light';
      this.feedbackIcons.solenoid.setActive(mur.telemetry.feedback.solenoidRelaxing);

      // this.feedbackIcons.solenoid.setActive(true);

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
