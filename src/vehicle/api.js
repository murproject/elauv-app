import AppVersion from '../utils/AppVersion';
import Protocol from './protocol';

let transport = null;

if (typeof cordova !== 'undefined') {
  transport = require('./transportBluetooth').default;
} else {
  transport = require('./transportWebsocket').default;
}

const zeroPad = (num, places) => String(num).padStart(places, '0');


export default {
  name: 'mur',
  mur: this,
  ip: '127.0.0.1',
  deviceAddress: null,
  port: '8802',
  page: 'api',
  url: null,
  conn: transport,
  telemetry: {timestamp: 0},
  formattedTelemetry: {},
  precision: 2,
  status: 'connecting',
  remote: false,
  lastUpdated: '',
  lastUpdatedDate: null,
  pingCounter: 0,
  reconnecting: false,
  reconnectTimer: null,
  context: {},

  protocol: Protocol,

  oldImuTapState: false, // TODO: delete!

  telemetryUpdated: (t, f) => {},
  onStatusUpdated: (status) => {},
  onDiscard: () => {},
  onAllSettingsReceived: () => {},
  onDiagnosticLogReceived: () => {},

  create: function() {
    this.clearTelemetry();

    this.protocol.fillParsers();

    this.conn.start();

    this.conn.onClose = (event) => {
      // this.telemetry = {timestamp: 0};
      this.clearTelemetry();
      this.pingCounter = 0;
      setTimeout(() => this.connect(), 1000);
    };

    this.conn.onScan = (event) => {
      this.updateStatus();
    };

    this.conn.onOpen = (event) => {
      this.updateStatus();
      // EventBus.$emit('notify', { text: 'Установлено подключение' })
    };

    // setTimeout(() => {
    //   this.reconnecting = false
    //   this.updateStatus()
    // }, 250)

    const mur = this;

    // this.connect();

    this.conn.onMessage = (event) => {
      event.data.arrayBuffer().then((buf) => {
        const raw = new Uint8Array(buf);
        const packets = Protocol.splitBufferToPackets(raw);
        packets.forEach((packet) => mur.handlePacket(packet));
      });
    };

    this.reconnectTimer = setInterval(() => {
      const date = new Date();
      if (this.conn.state == 'scanning') {
        return;
      }

      if ((this.conn.state !== 'open' || ((date - this.lastUpdatedDate) > 5000)) && this.conn.state !== 'connecting' && !this.reconnecting) {
        console.warn('Connection lost');
        console.warn(`status: ${this.conn.state}, timestamp delta: ${date - this.lastUpdatedDate}, reconn: ${this.reconnecting}`);
        // console.warn(`status: ${this.status}, timestamp delta: ${date - this.lastUpdatedDate}`);
        this.connect();
      } else if (this.status === 'open') {
        // EventBus.$emit('status-updated')
      }
    }, 2500);

    if (AppVersion.isDevBuild) {
      // this.conn.scanAll();
    }
  },

  handlePacket: function(raw) {
    const message = Protocol.parsePacket(raw);
    const date = new Date();
    this.lastUpdatedDate = date;

    switch (message.type) {
      case Protocol.packetTypes.ReplyTelemetry:
        // this.oldImuTapState = !this.oldImuTapState; // TODO: delete!
        // console.log(this.oldImuTapState);

        if (message.timestamp < this.telemetry.timestamp) {
          console.warn('inconsistent timestamps: old is ' + this.telemetry.timestamp + ', and new is ' + message.timestamp);
        }
        this.telemetry = message;
        this.lastUpdated = date.toLocaleTimeString('ru-RU') + '.' + zeroPad(date.getMilliseconds(), 3);

        // console.log(this.telemetry);

        // this.telemetry.feedback.imuTap = this.oldImuTapState; // TODO: delete!

        // EventBus.$emit('telemetry-received')
        this.updateTelemetry();
        // console.log(mur.formattedTelemetry)

        break;

      case Protocol.packetTypes.ReplyPing:
        if (message.counter == -1) {
          console.warn('This client was discarded by vehicle!');
          this.disconnect();
          this.onDiscard();
          break;
        }

        this.timePingDelta = Date.now() - this.timePing;
        this.timePing = Date.now();
        this.authorized = true;
        this.pingSuccess = this.timePingDelta < 500;
        this.updateStatus();
        break;

      case Protocol.packetTypes.ReplyAllSettings:
        this.onAllSettingsReceived(message);
        break;

      case Protocol.packetTypes.ReplyDiagnosticInfo:
        console.log(`Software rev:  ${message.softwareRevMajor}.${message.softwareRevMinor}`);
        console.log(`Hardware rev:  ${message.hardwareRev}`);
        console.log(`Imu start:     ${message.imuStarted}`);
        console.log(`Gauge start:   ${message.voltmeterStarted}`);
        console.log('Diagnostic info:\n' + message.text);
        this.onDiagnosticLogReceived(message);
        break;

      default:
        console.warn('unknown packet type');
        console.log(JSON.stringify(message, null, ' '));
        break;
    }
  },

  connect: function(address, force = false) {
    if (this.reconnecting && !force) {
      return;
    }

    // if (!address) {
    //   address = localStorage.lastDeviceAddress;
    // } else {
    //   this.deviceAddress = address;
    //   localStorage.lastDeviceAddress = address;
    // }

    if (address) {
      this.deviceAddress = address;
    } else if (this.deviceAddress) {
      address = this.deviceAddress;
    }

    this.clearTelemetry();

    this.authorized = false;
    this.pingSuccess = false;
    this.connectionTimeout = false;
    // console.warn('WebSocket: connecting…')
    console.info('Connecting to', address);

    if (transport.type === 'websocket') {
      // address = 'ws://' + this.ip + ':' + this.port + '/' + this.page; // TODO: костыль
    }

    // EventBus.$emit('notify', { text: 'Подключение…' })
    // if (this.conn !== null && this.conn.ws !== null) {
    //   this.conn.ws.close()
    // }
    // this.conn.connect(this.url)

    if (address) {
      this.deviceAddress = address;
      this.conn.connect(address);
    }

    this.updateStatus();

    setTimeout(() => {
      this.reconnecting = false;
      this.updateStatus();
    }, 250);

    // this.reconnecting = false
  },

  disconnect: function() {
    this.controlPing(-1);
    this.pingCounter = 0;
    this.authorized = false;
    this.pingSuccess = false;
    this.connectionTimeout = false;
    this.deviceAddress = null;
    localStorage.lastDeviceAddress = null; // TODO: delete!
    this.conn.disconnect();
  },

  updateStatus: function() {
    this.status = this.conn.checkStatus();

    if (this.connectionTimeout) {
      // console.error('connectionTimeout'); // TODO: remove
    }

    if (this.status === 'open' && !this.reconnecting && !this.authorized) {
      this.status = 'wait-ping';
    } else if (this.reconnecting) {
      this.status = 'reconnecting';
    } else if (this.connectionTimeout) {
      this.status = 'timeout';
    }

    this.onStatusUpdated(this.status);
  },

  updateTelemetry: function(data) {
    if (this.telemetry.running !== undefined) {
      this.formattedTelemetry.running = this.telemetry.running;
    }

    if (this.telemetry.remote !== undefined) {
      this.formattedTelemetry.remote = this.telemetry.remote;
      this.remote = this.telemetry.remote;
    }

    for (const item in this.telemetry) {
      this.formattedTelemetry[item] = this.getFormattedTelemetry(item);
    }

    this.telemetryUpdated(this.telemetry, this.formattedTelemetry);
  },

  clearTelemetry: function() {
    this.telemetry = {
      'type': undefined,
      'lastProtoVer': undefined,
      'hardwareRev': undefined,
      'macAddress': undefined,
      'timestamp': undefined,
      'feedback': {
        'imuTap': undefined,
        'imuDoubleTap': undefined,
        'imuCalibrating': undefined,
        'colorStatus': undefined,
        'solenoidRelaxing': undefined,
        'pilotingMode': undefined,
        'yawStabilized': undefined,
        'pilotingBlocked': undefined,
      },
      'depth': undefined,
      'depthTemp': undefined,
      'imuYaw': undefined,
      'imuPitch': undefined,
      'imuRoll': undefined,
      'battVolts': undefined,
      'battAmps': undefined,
      'battRsoc': undefined,
      'battTemp': undefined,
      'memFree': undefined,
      'motorsPower': [
        undefined,
        undefined,
        undefined,
        undefined,
      ],
    };

    // this.telemetry = {
    //   'type': 161,
    //   'lastProtoVer': '00',
    //   'hardwareRev': '00',
    //   'macAddress': '...',
    //   'timestamp': 0,
    //   'feedback': {
    //     'imuTap': false,
    //     'imuDoubleTap': false,
    //     'imuCalibrating': false,
    //     'colorStatus': false,
    //     'solenoidRelaxing': false,
    //     'pilotingMode': false,
    //     'yawStabilized': false,
    //     'pilotingBlocked': false,
    //   },
    //   'depth': 0,
    //   'depthTemp': 0,
    //   'imuYaw': 0.0,
    //   'imuPitch': 0.0,
    //   'imuRoll': 0,
    //   'battVolts': 0.0,
    //   'battAmps': 0.0,
    //   'battRsoc': 0,
    //   'battTemp': 0,
    //   'memFree': 0,
    //   'motorsPower': [
    //     0,
    //     0,
    //     0,
    //     0,
    //   ],
    // };

    this.updateTelemetry(this.telemetry);
  },

  getFormattedTelemetry: function(name) {
    let value = this.telemetry[name];

    if (typeof value === 'number') {
      value = parseFloat(value);

      if (name === 'timestamp') {
        value *= 0.001;
      }

      value = isNaN(value) ? (0).toFixed(this.precision) : value.toFixed(this.precision);
    }

    if (typeof value === 'object') {
      // if (name === 'feedback') {
      //   return JSON.stringify(value, null, ' ');
      // }

      let result = '';
      for (const key in value) {
        if (typeof value[key] !== 'function') {
          const v = value[key] === true ? '1' :
                    value[key] === false ? '0' :
                    value[key];

          result += '\<br>     ' + key + ': ' + v + '; ';
        }
        // if (value[key] === true) {
        // result.push(key)
        // }
      }
      return result;
    }

    return value;
  },

  sendMessage: function(data) {
    if (this.status === 'open') {
      this.conn.sendMessage(data);
    }
  },

  controlContext: function(data) {
    this.sendMessage(Protocol.packControlContext(data));
    this.context = data;
  },

  controlActuator: function(data) {
    this.sendMessage(Protocol.packControlActuator(data));
  },

  controlReboot: function() {
    this.sendMessage(Protocol.packControlReboot({delay: 500}));
  },

  controlErase: function() {
    this.sendMessage(Protocol.packControlErase({ }));
  },

  controlDiagnosticInfo: function() {
    this.sendMessage(Protocol.packControlDiagnosticInfo({ }));
  },

  controlPing: function(counter = undefined) {
    if (this.status === 'open' || this.status === 'wait-ping' || this.status === 'timeout') {
      console.log('Ping when status is ' + this.status);

      this.conn.sendMessage(Protocol.packControlPing({
        counter: counter == undefined ? this.pingCounter : counter,
      }));

      console.log(this.pingSuccess);

      if (this.pingSuccess) {
        this.connectionTimeout = false;
      } else if (this.authorized) {
        this.connectionTimeout = true;
        console.error('PING TIMEOUT');
      }

      this.timePing = new Date();
      this.pingCounter++;
      this.pingSuccess = false;
    }

    this.updateStatus();
  },

  controlGetAllSettings: function() {
    this.sendMessage(Protocol.packControlGetAllSettings());
  },

  controlMotorsSettings: function(data) {
    this.sendMessage(Protocol.packControlMotorsSettings(data));
  },

  controlBatterySettingsUpdate: function(data) {
    data.action = Protocol.battActions.UpdateSettings;
    this.sendMessage(Protocol.packControlBatterySettings(data));
  },

  controlBatteryReset: function() {
    this.sendMessage(Protocol.packControlBatterySettings({
      action: Protocol.battActions.Reset,
      fuelGaugeBattCapacity: 0,
      fuelGaugeTerminateVolts: 0,
      fuelGaugeTaperCurrent: 0,
      fuelGaugeSocMin: 0,
      fuelGaugeSocMax: 0,
    }));
  },

  controlImuSettingsUpdate: function(data) {
    data.action = Protocol.imuActions.UpdateSettings;
    this.sendMessage(Protocol.packControlImuSettings(data));
  },

  controlImuRecalibrate: function() {
    this.sendMessage(Protocol.packControlImuSettings({
      action: Protocol.imuActions.Recalibrate,
      imuTapTimeout: 0,
      imuTapThreshold: 0,
    }));
  },

  controlImuResetYaw: function() {
    this.sendMessage(Protocol.packControlImuSettings({
      action: Protocol.imuActions.ResetZero,
      imuTapTimeout: 0,
      imuTapThreshold: 0,
    }));
  },
};
