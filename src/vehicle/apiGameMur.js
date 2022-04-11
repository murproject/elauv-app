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

    this.conn.onMessage = (event) => {
      const mur = this

      event.data.arrayBuffer().then(function (buf) {
        const raw = new Uint8Array(buf)
        const message = Protocol.parsePacket(raw)
        const date = new Date()
        mur.lastUpdatedDate = date

        switch (message.type) {
          case 'telemetry':
            if (message.timestamp < mur.telemetry.timestamp) {
              console.warn('inconsistent timestamps: old is ' + mur.telemetry.timestamp + ', and new is ' + message.timestamp)
            }
            mur.telemetry = message
            mur.lastUpdated = date.toLocaleTimeString('ru-RU') + '.' + zeroPad(date.getMilliseconds(), 3)
            // EventBus.$emit('telemetry-received')
            mur.updateTelemetry()
            // console.log(mur.formattedTelemetry)
            mur.telemetryUpdated(mur.telemetry, mur.formattedTelemetry)
            break

          case 'diagnostic-info':
            // EventBus.$emit('log-received', message)
            break

          case 'script-output':
            // EventBus.$emit('output-received', message)
            break

          case 'script-highlight':
            // EventBus.$emit('script-highlight', message)
            break
        }
      })
    }

    this.reconnectTimer = setInterval(() => {
      const date = new Date()
      if (this.status !== 'open' || (((date - this.lastUpdatedDate) > 3000) && this.status !== 'connecting')) {
        console.warn('Connection lost')
        this.connect()
      } else if (this.status === 'open') {
        // EventBus.$emit('status-updated')
      }
    }, 1500)
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
          result += key + ': ' + value[key] + '\n'
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
