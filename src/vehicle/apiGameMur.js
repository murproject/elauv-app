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

  oldImuTapState: false,

  telemetryUpdated: (t, f) => {},

  create: function () {
    console.info('Connecting to', this.url)

    this.conn.start()

    this.conn.onClose = (event) => {
      this.connect()
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
      case 'telemetry':
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

      case 'diagnostic-info':
        this.timePong = new Date();
        this.timePingDelta = this.timePong - this.timePing;
        // EventBus.$emit('log-received', message)
        break

      case 'script-output':
        // EventBus.$emit('output-received', message)
        break

      case 'script-highlight':
        // EventBus.$emit('script-highlight', message)
        break
    }
  },

  connect: function (address) {
    if (this.reconnecting) {
      return
    }

    // console.warn('WebSocket: connecting…')
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

  updateStatus: function () {
    this.status = this.conn.checkStatus()
    this.conn.onDeviceDiscovered(this.conn.devices.all)
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
      let result = ''
      for (const key in value) {
        if (typeof value[key] !== 'function') {
          result += key + ': ' + value[key] + '; '
        }
        // if (value[key] === true) {
        // result.push(key)
        // }
      }
      return result
    }

    return value
  },

  controlContext: function (data) {
    if (this.status === 'open') {
      this.conn.sendMessage(Protocol.packControlContext(data))
    }
    // this.context = data
  },

  controlActuator: function (data) {
    if (this.status === 'open') {
      this.conn.sendMessage(Protocol.packControlActuator(data))
    }
  },

  controlReboot: function () {
    if (this.status === 'open') {
      this.conn.sendMessage(Protocol.packControlReboot({ delay: 500 }))
    }
  },

  controlErase: function () {
    if (this.status === 'open') {
      this.conn.sendMessage(Protocol.packControlErase({ }))
    }
  },

  controlInfo: function () {
    if (this.status === 'open') {
      this.conn.sendMessage(Protocol.packControlInfo({ }))
      this.timePing = new Date();
    }
  },

  controlScriptRun: function (data) {
    if (this.status === 'open') {
      this.conn.sendMessage(Protocol.packControlScriptRun(data))
    }
  },

  controlScriptStop: function (data) {
    if (this.status === 'open') {
      this.conn.sendMessage(Protocol.packControlScriptStop(data))
    }
  }
}
