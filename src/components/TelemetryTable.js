
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

function tag(color = 'white', value = undefined, postfix = '', classes='') {
  if (value === undefined || value === null) {
    return /*html*/`
      <span class="tag tag-ghost">—</span>
    `;
  }

  return /*html*/`
    <span class="tag tag-${color} ${classes}">${value}${postfix}</span>
  `;
}

function tagNum(color = 'white', value = undefined, postfix = '') {
  return tag(color, value, postfix, 'num');
}

function checkValue(value) {
  return value;
  // return value === undefined ? '—' : value;
}

function formatFixed(value, precision = 1) {
  if (typeof(value) !== 'number') {
    return value;
  }

  return value.toFixed(precision);
}

function formatUptime(timestamp) {
  if (timestamp === undefined) {
    return undefined;
  }

  function formatTime(value) {
    return Math.floor(value).toFixed(0).padStart(2, '0');
  };

  const uptime = {
    hours:    formatTime(timestamp / 1000 / 60 / 60),
    minutes:  formatTime((timestamp / 1000 / 60) % 60),
    seconds:  formatTime((timestamp / 1000) % 60),
    ms:       Math.floor((timestamp % 1000) / 100),
  };

  return `${uptime.hours}:${uptime.minutes}:${uptime.seconds}<span class="opacity-50">.${uptime.ms}</span>`;
}

function formatValues(t) {
  Object.keys(t).forEach((key) => t[key] = checkValue(t[key]));

  let batteryColor = TelemetryUtils.makeBatteryIcon().color;
  if (['green', 'yellow'].includes(batteryColor)) {
    batteryColor = 'white';
  }

  return {
    'type': undefined,
    'lastProtoVer': tag('white', t.hardwareRev),
    'hardwareRev': tag('white', t.lastProtoVer),

    'macAddress': t.macAddress,
    'timestamp': tag('white', formatUptime(t.timestamp)),
    'connection':
      t.connection === 'open' ? tag('green', 'ОК') :
      t.connection === 'wait-ping' ? tag('white', 'Ожидание…') :
      t.connection === 'connecting' ? tag('yellow', 'Соединение…') :
      t.connection === 'reconnecting' ? tag('yellow', 'Ожидание…') :
      t.connection === 'timeout' ? tag('yellow', 'Нет сигнала…') :
      t.connection === 'closed' ? tag('red', 'Нет сигнала…') : tag('white', t.connection),

    'ping':
      t.connection === 'open' ? tag('white', t.ping, ' мс') : tag(),

    'feedback': {
      'imuTap':
        t.feedback.imuDoubleTap ? tag('orange', 'Двойной') :
        t.feedback.imuTap ? tag('yellow', 'Одиночный') :
        t.feedback.imuTap !== undefined ? tag('white', '—') : tag(),

      'imuDoubleTap':
        t.feedback.imuDoubleTap ? tag('orange', 'Двойной удар') : tag(),

      'imuCalibrating':
        t.feedback.imuCalibrating ? tag('yellow', 'Калибровка<br>нав. датчика') : '',

      'colorStatus':
        t.feedback.colorStatus === undefined ? tag() :
        t.feedback.colorStatus ? tag('dark', 'Темно') : tag('white', 'Светло'),

      'solenoidRelaxing':
        t.feedback.solenoidRelaxing ? tag('yellow', 'Магнит<br>остывает') : '',

      'pilotingMode':
        t.feedback.pilotingMode ? tag('yellow', 'Управление<br>активно') : '',

      'yawStabilized':
        t.feedback.pilotingMode && t.feedback.yawStabilized ? tag('green', 'Курс<br>стабилен') : '',

      'pilotingBlocked': undefined,
    },

    'depth': undefined,
    'depthTemp': undefined,

    'imuYaw':     tagNum('white', formatFixed(t.imuYaw), '°'),
    'imuPitch':   tagNum('white', formatFixed(t.imuPitch), '°'),
    'imuRoll':    tagNum('white', formatFixed(t.imuRoll), '°'),
    'battVolts':  tagNum('white', formatFixed(t.battVolts, 2), ' В'),
    'battAmps':   tagNum('white', formatFixed(t.battAmps, 2), ' А'),
    'battRsoc':   tag(batteryColor, formatFixed(t.battRsoc, 0), '%'),
    'battTemp':   tagNum('white', formatFixed(t.battTemp), ' °C'),

    'battStatus':
      t.battAmps === undefined ? tag() :
      t.battAmps > 0 ? tag('yellow', 'Заряжается') :
      t.battRsoc > 0 ? tag('white', 'Разряжается') : tag('red', 'Разряжен'),

    'motorsStatus':
      t.feedback.pilotingBlocked === undefined ? tag() :
      t.feedback.pilotingBlocked ? tag('red', 'Отключены') : tag('white', 'Активны'),

    'magnetStatus':
      t.feedback.pilotingBlocked === undefined ? tag() :
      t.feedback.pilotingBlocked ? tag('red', 'Отключен') :
      t.feedback.solenoidRelaxing ? tag('yellow', 'Остывает') : tag('white', 'Активен'),

    'memFree': undefined,
  };
}

export default class TelemetryPanel extends Element {
  static get defaultClasses() {
    return ['row', 'flex-equal', 'height-fill', 'margin-zero', 'flex-adaptive'];
  }

  static get tag() {
    return 'telemetry-table';
  }

  static get defaultAttrs() {
    return {
      address: null,
      telemetry: null,
      stats: null,
      connection: null,
      ping: null,
    };
  }

  render() {
    const telemetry = this.attrs.telemetry;
    const extraTelemetryMode = SettingsStorage.get('extendedTelemetry');

    if (telemetry === null) {
      return '';
    }

    telemetry.macAddress = this.attrs.address ? this.attrs.address :
                   telemetry.macAddress ? telemetry.macAddress : '...';

    telemetry.connection = this.attrs.connection;
    telemetry.ping = this.attrs.ping;

    const info = formatValues(telemetry);


    return /*html*/`
      <div class="display-flex flex-column">
        <table class="telemetry-table margin-auto margin-top-zero">
          ${header( /*html*/`
            <span>ElementaryAUV</span><br>
            <span class="normal tag-address">${info.macAddress}</span>
          `)}

          ${row('Связь', info.connection)}
          ${row('Время работы', info.timestamp)}
          ${rowExtra('Задержка', info.ping)}

          ${header(extraTelemetryMode ? 'Доп. информация' : '')}

          ${rowExtra('Плата', info.hardwareRev)}
          ${rowExtra('Протокол', info.lastProtoVer)}

          ${rowExtra('', info.feedback.pilotingMode)}
          ${rowExtra('', info.feedback.imuCalibrating)}
          ${rowExtra('', info.feedback.yawStabilized)}
        </table>
      </div>

      <div class="">
        <table class="telemetry-table margin-auto margin-top-zero">
          ${header('Датчики')}

          ${row('Курс', info.imuYaw)}
          ${row('Крен', info.imuRoll)}
          ${row('Дифферент', info.imuPitch)}

          ${row('Стук', info.feedback.imuTap)}

          ${row('Лазер', info.feedback.colorStatus)}

          ${header('Питание')}

          ${row('Заряд', info.battRsoc)}
          ${row('Состояние', info.battStatus)}

          ${row('Моторы', info.motorsStatus)}

          ${row('Магнит', info.magnetStatus)}

          ${rowExtra('Напряжение', info.battVolts)}
          ${rowExtra('Ток', info.battAmps)}
          ${rowExtra('Температура', info.battTemp)}
        </table>

      </div>
    `;
  }
}

TelemetryPanel.register();
