import Element from './Element.js';
import Icon from '/src/components/Icon';
import Utils from '/src/utils/Utils';

export default class TelemetryPanel extends Element {
  static get defaultClasses() {
    return [];
  }

  static get tag() {
    return 'telemetry-table';
  }

  static get defaultAttrs() {
    return {
      address: null,
      telemetry: null,
      stats: null,
    };
  }

  makeRow(name, value) {
    return /*html*/`
      <tr>
        <td>
          ${name}
        </td>
        <td>
          ${value}
        </td>
      </tr>
    `;
  }

  makeHeader(name) {
    return /*html*/`
    <tr>
      <td colspan="2" class="text-center">
        <h1>${name}</h1>
      </td>
    </tr>
  `;
  }

  formatUptime(timestamp) {
    function formatTime(value) {
      return Math.floor(value).toFixed(0).padStart(2, '0');
    };

    const uptime = {
      hours:    formatTime(timestamp / 1000 / 60 / 60),
      minutes:  formatTime((timestamp / 1000 / 60) % 60),
      seconds:  formatTime((timestamp / 1000) % 60),
    };

    return `${uptime.hours}:${uptime.minutes}:${uptime.seconds}`;
  }

  render() {
    const t = this.attrs.telemetry;
    const s = this.attrs.stats;

    const uptimeText = this.formatUptime(t.timestamp);

    // console.log(t);
    // console.log(s);

    return /*html*/`
      <div class="monospace">
        <table class="telemetry-table">
          ${this.makeRow('Адрес', this.attrs.address)}
          ${this.makeHeader(this.attrs.address)}

          ${this.makeRow('Курс', t.imuYaw.toFixed(1) + '°')}
          ${this.makeRow('Крен', t.imuRoll.toFixed(1) + '°')}
          ${this.makeRow('Дифферент', t.imuPitch.toFixed(1) + '°')}

          ${this.makeRow('Стук', t.feedback.imuDoubleTap ? 'Двойной' :
                                 t.feedback.imuTap ? 'Одиночный' : '&nbsp;—&nbsp;')}

          ${this.makeRow('Лазер', t.feedback.colorStatus ?
                         '<span class="tag-dark">Темно</span>' :
                         '<span class="tag-light">Светло</span>')}

          ${this.makeHeader('Test')}

          ${this.makeRow('Заряд батареи', t.battRsoc.toFixed(0) + '%')}
          ${this.makeRow('Время работы', uptimeText)}

        </table>

        <br><br>

        <!-- <pre>${ JSON.stringify(t, null, ' ') }</pre> -->
      </div>
    `;
  }
}

TelemetryPanel.register();

/*
battAmps: 1.3900000000000001
battRsoc: 76
battTemp: 51.550000000000004
battVolts: 4.14
depth: 0
depthTemp: 0
feedback: {imuTap: false, imuDoubleTap: false, imuCalibrating: false, colorStatus: true, solenoidRelaxing: false, …}
hardwareRev: "00"
imuPitch: -0.8
imuRoll: -0.5
imuYaw: 15.4
lastProtoVer: "00"
macAddress: "AC:0B:FB:74:1E:1E"
memFree: 131
motorsPower: (4) [0, 0, 0, 0]
timestamp: 3902111
type: 161
*/
