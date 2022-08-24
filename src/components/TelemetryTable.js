
import TelemetryUtils from '../utils/TelemetryUtils.js';
import Element from './Element.js';
import SettingsStorage from '/src/utils/SettingsStorage.js';
import AppVersion from '/src/utils/AppVersion.js';

function row(name, value) {
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

function rowExtra(name, value) {
  return SettingsStorage.get('extendedTelemetry') ? row(name, value) : '';
}

function header(name) {
  return /*html*/`
  <tr>
    <td colspan="2" class="text-center">
      <h1>${name}</h1>
    </td>
  </tr>
`;
}

function tag(color, value, classes='') {
  return /*html*/`
    <span class="tag tag-${color} ${classes}">${value}</span>
  `;
}

function tagNum(color, value) {
  return tag(color, value, 'num');
}

export default class TelemetryPanel extends Element {
  static get defaultClasses() {
    return ['row', 'flex-equal', 'height-fill', 'margin-zero'];
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

    const extraTelemetry = SettingsStorage.get('extendedTelemetry');

    const uptimeText = this.formatUptime(t.timestamp);

    let batteryColor = TelemetryUtils.makeBatteryIcon().color;
    if (['green', 'yellow'].includes(batteryColor)) {
      batteryColor = 'white';
    }

    // console.log(t);
    // console.log(s);

    return /*html*/`
      <div class="display-flex flex-column flex-equal">
        <table class="telemetry-table margin-auto margin-top-zero">
          ${header( /*html*/`
            <span>ElementaryAUV</span><br>
            <span class="normal tag-address">${this.attrs.address}</span>
          `)}

          ${row('Время работы', tag('white', uptimeText))}
          ${row('Связь', tag('red', 'TODO!!!'))}

          ${header(extraTelemetry ? 'Доп. информация' : '')}

          ${rowExtra('Версия платы', tag('white', t.hardwareRev))}
          ${rowExtra('Версия протокола', tag('white', t.lastProtoVer))}

          ${rowExtra('&nbsp;', t.feedback.pilotingMode ? tag('yellow', 'Пилотирование') : '')}
          ${rowExtra('&nbsp;', t.feedback.imuCalibrating ? tag('yellow', 'Калибровка<br>нав. датчика') : '')}
          ${rowExtra('&nbsp;', t.feedback.pilotingMode && t.feedback.yawStabilized ? tag('green', 'Курс<br>стабилен') : '')}
        </table>

        <div class="text-center">
          <h1 class="normal tag-address">
            <!-- ${AppVersion.copyright} -->
          </h1>

          <div>
            <img src="/media/logo.png" height="40" />
          </div>

          <a href="#" onclick="cordova.InAppBrowser.open(AppVersion.siteLink, '_system');" class="tag-address">
            murproject.com/elauv
          </a>
        </div>
      </div>

      <div class="">
        <table class="telemetry-table margin-auto margin-top-zero">
          ${header('Датчики')}

          ${row('Курс', tagNum('white', t.imuYaw.toFixed(1) + '°'))}
          ${row('Крен', tagNum('white', t.imuRoll.toFixed(1) + '°'))}
          ${row('Дифферент', tagNum('white', t.imuPitch.toFixed(1) + '°'))}

          ${row('Стук',
            t.feedback.imuDoubleTap ? tag('orange', 'Двойной') :
            t.feedback.imuTap ? tag('yellow', 'Одиночный') : tag('white', '—'))}

          ${row('Лазер',
            t.feedback.colorStatus ? tag('dark', 'Темно') : tag('white', 'Светло'))}

          ${header('Питание')}

          ${row('Заряд', tag(batteryColor, t.battRsoc.toFixed(0) + '%'))}

          ${row('Состояние',
            t.battAmps > 0 ? tag('yellow', 'Заряжается') :
            t.battRsoc > 0 ? tag('white', 'Разряжается') : tag('red', 'Разряжен'))}

          ${row('Моторы',
            t.feedback.pilotingBlocked ? tag('red', 'Отключены') : tag('white', 'Активны'))}

          ${row('Магнит',
            t.feedback.pilotingBlocked ? tag('red', 'Отключен') :
            t.feedback.solenoidRelaxing ? tag('yellow', 'Остывает') : tag('white', 'Активен'))}

          ${rowExtra('Напряжение', tagNum('white', t.battVolts.toFixed(2) + ' В'))}
          ${rowExtra('Ток', tagNum('white', t.battAmps.toFixed(2) + ' А'))}
          ${rowExtra('Температура', tagNum('white', t.battTemp.toFixed(1) + ' °C'))}
        </table>

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
