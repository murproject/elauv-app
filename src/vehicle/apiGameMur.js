import Protocol from './protocolGameMur'

let transport = null

if (typeof cordova !== 'undefined') {
  transport = require('./transportBluetooth').default
} else {
  transport = require('./transportWebsocket').default
}

const zeroPad = (num, places) => String(num).padStart(places, '0')


export default {
  name: 'mur',
  mur: this,
  ip: '127.0.0.1',
  deviceAddress: localStorage.lastDeviceAddress ? localStorage.lastDeviceAddress : null,
  port: '8802',
  page: 'api',
  url: null,
  conn: transport,
  telemetry: { timestamp: 0 },
  formattedTelemetry: {},
  precision: 2,
  status: 'connecting',
  remote: false,
  lastUpdated: '',
  lastUpdatedDate: null,
  reconnecting: false,
  reconnectTimer: null,
  context: {},

  protocol: Protocol,

  oldImuTapState: false,

  telemetryUpdated: (t, f) => {},
  onStatusUpdated: (status) => {},

  create: function () {
    this.conn.start()

    this.conn.onClose = (event) => {
      this.telemetry = { timestamp: 0 }
      setTimeout(() => this.connect(), 1000)
    }

    this.conn.onScan = (event) => {
      this.updateStatus()
    }

    this.conn.onOpen = (event) => {
      this.updateStatus()
      // EventBus.$emit('notify', { text: 'Установлено подключение' })
    }

    const mur = this

    // this.connect();

    this.conn.onMessage = (event) => {
      event.data.arrayBuffer().then((buf) => {
        const raw = new Uint8Array(buf)
        const packets = Protocol.splitBufferToPackets(raw)
        packets.forEach(packet => mur.handlePacket(packet));
      })
    }

    this.reconnectTimer = setInterval(() => {
      const date = new Date()
      if (this.conn.state == 'scanning') {
        return;
      }

      if ((this.conn.state !== 'open' || ((date - this.lastUpdatedDate) > 3000)) && this.conn.state !== 'connecting' && !this.reconnecting) {
        console.warn('Connection lost')
        console.warn(`status: ${this.conn.state}, timestamp delta: ${date - this.lastUpdatedDate}, reconn: ${this.reconnecting}`);
        // console.warn(`status: ${this.status}, timestamp delta: ${date - this.lastUpdatedDate}`);
        this.connect()
      } else if (this.status === 'open') {
        // EventBus.$emit('status-updated')
      }
    }, 2500)
  },


  handlePacket: function (raw) {
    const message = Protocol.parsePacket(raw)
    const date = new Date()
    this.lastUpdatedDate = date

    switch (message.type) {
      case Protocol.packetTypes.ReplyTelemetry:
        this.oldImuTapState = !this.oldImuTapState; // TODO: delete!
        // console.log(this.oldImuTapState);

        if (message.timestamp < this.telemetry.timestamp) {
          console.warn('inconsistent timestamps: old is ' + this.telemetry.timestamp + ', and new is ' + message.timestamp)
        }
        this.telemetry = message
        this.lastUpdated = date.toLocaleTimeString('ru-RU') + '.' + zeroPad(date.getMilliseconds(), 3)

        // this.telemetry.feedback.imuTap = this.oldImuTapState; // TODO: delete!

        // EventBus.$emit('telemetry-received')
        this.updateTelemetry()
        // console.log(mur.formattedTelemetry)
        this.telemetryUpdated(this.telemetry, this.formattedTelemetry)
        break

      case Protocol.packetTypes.ReplyPong:
        this.timePong = new Date();
        this.timePingDelta = this.timePong - this.timePing;
        // EventBus.$emit('log-received', message)
        break

      case Protocol.packetTypes.ReplyAllSettings:
        console.log(message);
        break;

      case Protocol.packetTypes.ReplyDiagnosticInfo:
        console.log("Diagnostic info:\n" + message.text);
        console.log(`Software rev: ${message.softwareRevMajor}.${message.softwareRevMinor}`);
        console.log(`Hardware rev: ${message.hardwareRev}`);
        break;

      default:
        console.warn("unknown")
        console.log(JSON.stringify(message, null, ' '));
        break;
    }
  },

  connect: function (address) {
    if (this.reconnecting) {
      return
    }

    if (!address) {
      address = localStorage.lastDeviceAddress
    } else {
      this.deviceAddress = address
      localStorage.lastDeviceAddress = address
    }

    // console.warn('WebSocket: connecting…')
    console.info('Connecting to', address)
    this.reconnecting = true

    if (transport.type === 'websocket') {
      address = 'ws://' + this.ip + ':' + this.port + '/' + this.page // TODO: костыль
    }

    // EventBus.$emit('notify', { text: 'Подключение…' })
    // if (this.conn !== null && this.conn.ws !== null) {
    //   this.conn.ws.close()
    // }
    // this.conn.connect(this.url)
    this.conn.connect(address)

    this.updateStatus()

    setTimeout(() => {
      this.reconnecting = false
      this.updateStatus()
    }, 250)

    // this.reconnecting = false
  },

  disconnect: function() {
    this.deviceAddress = null
    localStorage.lastDeviceAddress = null
    this.conn.disconnect()
    // conn.macAddress = null
  },

  updateStatus: function () {
    this.status = this.conn.checkStatus()
    this.conn.onDeviceDiscovered(this.conn.devices.all)
    this.onStatusUpdated(this.status)
    // EventBus.$emit('status-updated', { status: this.status })
    // console.log(this.status)
  },

  updateTelemetry: function (data) {
    if (this.telemetry.running !== undefined) {
      this.formattedTelemetry.running = this.telemetry.running
    }

    if (this.telemetry.remote !== undefined) {
      this.formattedTelemetry.remote = this.telemetry.remote
      this.remote = this.telemetry.remote
    }

    for (const item in this.telemetry) {
      this.formattedTelemetry[item] = this.getFormattedTelemetry(item)
    }
  },

  getFormattedTelemetry: function (name) {
    let value = this.telemetry[name]

    if (typeof value === 'number') {
      value = parseFloat(value)

      if (name === 'timestamp') {
        value *= 0.001
      }

      value = isNaN(value) ? (0).toFixed(this.precision) : value.toFixed(this.precision)
    }

    if (typeof value === 'object') {

      // if (name === 'feedback') {
      //   return JSON.stringify(value, null, ' ');
      // }

      let result = ''
      for (const key in value) {
        if (typeof value[key] !== 'function') {
          const v = value[key] === true  ? '1' :
                    value[key] === false ? '0' :
                    value[key];

          result += "\<br>     " + key + ': ' + v + '; '
        }
        // if (value[key] === true) {
        // result.push(key)
        // }
      }
      return result
    }

    return value
  },

  sendMessage: function (data) {
    if (this.status === 'open') {
      this.conn.sendMessage(data)
    }
  },

  controlContext: function (data) {
    this.sendMessage(Protocol.packControlContext(data))
    this.context = data
  },

  controlActuator: function (data) {
    this.sendMessage(Protocol.packControlActuator(data))
  },

  controlReboot: function () {
    this.sendMessage(Protocol.packControlReboot({ delay: 500 }))
  },

  controlErase: function () {
    this.sendMessage(Protocol.packControlErase({ }))
  },

  controlDiagnosticInfo: function () {
    this.sendMessage(Protocol.packControlDiagnosticInfo({ }))
  },

  controlPing: function () {
    if (this.status === 'open') {
      this.conn.sendMessage(Protocol.packControlPing({ }))
      this.timePing = new Date();
    }
  },

  controlGetAllSettings: function () {
    this.sendMessage(Protocol.packControlGetAllSettings());
  },

  controlMotorsSettings: function (data) {
    this.sendMessage(Protocol.packControlMotorsSettings(data))
  },

  controlBatterySettingsUpdate: function (data) {
    data.action = Protocol.battActions.UpdateSettings;
    this.sendMessage(Protocol.packControlBatterySettings(data))
  },

  controlBatterySettingsReset: function () {
    this.sendMessage(Protocol.packControlBatterySettings({
      action: Protocol.battActions.Reset,
      designCapacity: 0,
      ccGain: 0,
      terminateVoltage: 0,
      taperCurrent: 0,
      socMin: 0,
      socMax: 0,
    }))
  },

  controlImuSettingsUpdate: function (data) {
    data.action = Protocol.imuActions.UpdateSettings
    this.sendMessage(Protocol.packControlImuSettings(data))
  },

  controlImuSettingsRecalibrate: function () {
    this.sendMessage(Protocol.packControlImuSettings({
      action: Protocol.imuActions.Recalibrate,
      tapTimeout: 0,
      tapTreshold: 0
    }))
  },

  controlImuSettingsResetYaw: function () {
    this.sendMessage(Protocol.packControlImuSettings({
      action: Protocol.imuActions.ResetZero,
      tapTimeout: 0,
      tapTreshold: 0
    }))
  }
}
