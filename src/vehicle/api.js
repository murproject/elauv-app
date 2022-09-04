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

  websocketAddress: 'ws://127.0.0.1:8802/api',
  deviceAddress: null,

  conn: transport,
  status: 'connecting',

  telemetry: {timestamp: 0},
  formattedTelemetry: {},
  precision: 2,

  context: {},

  lastUpdated: '',
  lastUpdatedDate: null,

  pingCounter: 0,
  reconnecting: false,
  reconnectTimer: null,

  protocol: Protocol,

  onTelemetryUpdated: (t, f) => {},
  onStatusUpdated: (status) => {},
  onDiscard: () => {},
  onAllSettingsReceived: () => {},
  onDiagnosticLogReceived: () => {},

  create: function() {
    this.clearTelemetry();
    this.protocol.fillParsers();
    this.conn.start();

    this.conn.onClose = (event) => {
      this.clearTelemetry();
      this.pingCounter = 0;
      setTimeout(() => this.connect(), 1000);
    };

    this.conn.onScan = (event) => {
      this.updateStatus();
    };

    this.conn.onOpen = (event) => {
      this.updateStatus();
    };

    this.conn.onMessage = (event) => {
      event.data.arrayBuffer().then((buf) => {
        const raw = new Uint8Array(buf);
        const packets = Protocol.splitBufferToPackets(raw);
        packets.forEach((packet) => this.handlePacket(packet));
      });
    };

    this.reconnectTimer = setInterval(() => {
      const date = new Date();
      if (this.conn.state == 'scanning') {
        return;
      }

      if ((this.conn.state !== 'open' || ((date - this.lastUpdatedDate) > 5000)) && this.conn.state !== 'connecting' && !this.reconnecting) {
        this.connect();
      }
    }, 2500);
  },

  /* Connection handling */

  connect: function(address, force = false) {
    if (this.reconnecting && !force) {
      return;
    }

    if (address) {
      this.deviceAddress = address;
    } else if (this.deviceAddress) {
      address = this.deviceAddress;
    }

    this.clearTelemetry();

    this.authorized = false;
    this.pingSuccess = false;
    this.connectionTimeout = false;

    if (transport.type === 'websocket') {
      address = this.websocketAddress;
    }

    console.info('Connecting to', address);

    if (address) {
      this.deviceAddress = address;
      this.conn.connect(address);
    }

    this.updateStatus();

    setTimeout(() => {
      this.reconnecting = false;
      this.updateStatus();
    }, 250);
  },

  disconnect: function() {
    this.controlPing(-1);
    this.pingCounter = 0;
    this.authorized = false;
    this.pingSuccess = false;
    this.connectionTimeout = false;
    this.deviceAddress = null;
    this.conn.disconnect();
  },

  updateStatus: function() {
    this.status = this.conn.checkStatus();

    if (this.status === 'open' && !this.reconnecting && !this.authorized) {
      this.status = 'wait-ping';
    } else if (this.reconnecting) {
      this.status = 'reconnecting';
    } else if (this.connectionTimeout) {
      this.status = 'timeout';
    }

    this.onStatusUpdated(this.status);
  },

  /* Telemetry */

  updateTelemetry: function(data) {
    if (this.telemetry.running !== undefined) {
      this.formattedTelemetry.running = this.telemetry.running;
    }

    for (const item in this.telemetry) {
      this.formattedTelemetry[item] = this.getFormattedTelemetry(item);
    }

    this.onTelemetryUpdated(this.telemetry, this.formattedTelemetry);
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
      let result = '';

      for (const key in value) {
        if (typeof value[key] !== 'function') {
          const v = value[key] === true ? '1' :
                    value[key] === false ? '0' :
                    value[key];

          result += '\<br>     ' + key + ': ' + v + '; ';
        }
      }

      return result;
    }

    return value;
  },

  /* Incoming packets handling */

  handlePacket: function(raw) {
    const message = Protocol.parsePacket(raw);
    const date = new Date();
    this.lastUpdatedDate = date;

    switch (message.type) {
      case Protocol.packetTypes.ReplyTelemetry:
        if (message.timestamp < this.telemetry.timestamp) {
          console.warn(
              'inconsistent timestamps: old is ' + this.telemetry.timestamp +
              ', and new is ' + message.timestamp,
          );
        }

        this.telemetry = message;
        this.lastUpdated = date.toLocaleTimeString('ru-RU') + '.' + zeroPad(date.getMilliseconds(), 3);
        this.updateTelemetry();
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
        this.onDiagnosticLogReceived(message);
        break;

      default:
        console.warn('Unknown packet type');
        console.warn(JSON.stringify(message, null, ' '));
        break;
    }
  },

  /* API commands */

  sendMessage: function(data) {
    if (this.status === 'open') {
      this.conn.sendMessage(data);
    }
  },

  controlContext: function(data) {
    this.context = data;
    this.sendMessage(Protocol.packControlContext(data));
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
      // check previous ping
      if (this.pingSuccess) {
        this.connectionTimeout = false;
      } else if (this.authorized) {
        this.connectionTimeout = true;
      }

      if (this.status === 'open') {
        this.pingCounter++;
      } else if (this.status === 'wait-ping') {
        this.pingCounter = 0;
      }

      this.conn.sendMessage(Protocol.packControlPing({
        counter: counter == undefined ? this.pingCounter : counter,
      }));

      this.timePing = new Date();
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
