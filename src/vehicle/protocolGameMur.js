import { encode, decode } from '@msgpack/msgpack'
// import MessagePack from '@msgpack/msgpack'
// const MessagePack = require('@msgpack/msgpack')

function checkBit (value, mask) {
  return ((value & mask) === mask)
}

function setBit (value, mask, state) {
  if (state === true) {
    value |= mask
  } else {
    value &= ~mask
  }

  return value
}

function packFloat (value, precision = 0.01) {
  return Math.round(value * (1.0 / precision))
}

var regulatorsMask = {
  yaw: 1 << 0,
  pitch: 1 << 1,
  roll: 1 << 2,
  depth: 1 << 3
}

var feedbackMask = {
  imuTap: 1 << 0,
  colorStatus: 1 << 1
}

export default {
  name: 'Protocol',
  protocol: this,

  clamp: function (value, maxPower = 100) {
    return Math.min(Math.max(value, -maxPower), maxPower)
  },

  regulators: {
    yaw: false,
    pitch: false,
    roll: false,
    depth: false,

    unpack: function (data) {
      this.depth = checkBit(data, regulatorsMask.depth)
      this.yaw = checkBit(data, regulatorsMask.yaw)
      this.pitch = checkBit(data, regulatorsMask.pitch)
      this.roll = checkBit(data, regulatorsMask.roll)
      return this
    },

    pack: function () {
      var data = 0
      data = setBit(data, regulatorsMask.depth, this.depth)
      data = setBit(data, regulatorsMask.yaw, this.yaw)
      data = setBit(data, regulatorsMask.pitch, this.pitch)
      data = setBit(data, regulatorsMask.roll, this.roll)
      return data
    }
  },

  feedback: {
    imuTap: false,
    colorStatus: false,

    unpack: function (data) {
      this.imuTap = checkBit(data, feedbackMask.imuTap)
      this.colorStatus = checkBit(data, feedbackMask.colorStatus)
      return this
    },

    pack: function () {
      var data = 0
      data = setBit(data, this.feedbackMask.imuTap, this.imuTap)
      data = setBit(data, this.feedbackMask.colorStatus, this.colorStatus)

      return data
    }
  },

  parsePacket: function (raw) {
    var data = decode(raw)

    if (!Array.isArray(data) || data.length < 4) {
      // debug("incorrect packet")
    }

    var packet = {
      header: data[0],
      protoVer: data[1],
      type: data[2],
      payload: data[3]
    }

    // debug(packet)

    var result = {}

    if (packet.type === 't') {
      result = this.parseTelemetry(packet)
    }

    if (packet.type === 'i') {
      result = this.parseDiagnosticInfo(packet)
    }

    if (packet.type === 'o') {
      result = this.parseScriptOutput(packet)
    }

    if (packet.type === 'h') {
      result = this.parseScriptHighlight(packet)
    }

    return result
  },

  prettyHex: function (raw, dots = false) {
    if (!(raw instanceof Uint8Array)) {
      raw = new Uint8Array(raw)
    }

    var hexString = Buffer.from(raw).toString('hex').toUpperCase()

    if (dots) {
      hexString = hexString.replace(/(.{2})/g, '$1:')
      hexString = hexString.substring(0, hexString.length - 1)
    }

    return hexString
  },

  parseTelemetry: function (packet) {
    var data = packet.payload

    var telemetry = {
      type: 'telemetry',
      lastProtoVer: this.prettyHex([data[0]]),
      hardwareRev: this.prettyHex([data[1]]), // TODO: should do formatting outisde
      macAddress: this.prettyHex(data[2], true),
      timestamp: data[3],
      feedback: this.feedback.unpack(data[4]), // TODO: should do formatting outisde
      depth: data[5] * 0.01,
      depthTemp: data[6] * 0.01,
      imuYaw: data[7] * 0.01,
      imuPitch: data[8] * 0.01,
      imuRoll: data[9] * 0.01,
      battVolts: data[10] * 0.01,
      battRsoc: data[11] * 0.01,
      battTemp: data[12] * 0.01,
      memFree: data[13]
    }

    // debug(telemetry)
    return telemetry
  },

  parseDiagnosticInfo: function (packet) {
    var data = packet.payload
    var info = {
      type: 'diagnostic-info',
      text: data[0]
    }
    // writeLog(info)
    return info
  },

  parseScriptOutput: function (packet) {
    var data = packet.payload
    var info = {
      type: 'script-output',
      text: data[0]
    }
    // writeLog(info)
    return info
  },

  parseScriptHighlight: function (packet) {
    var data = packet.payload
    var info = {
      type: 'script-highlight',
      blockId: data[0]
    }
    // writeLog(info)
    return info
  },

  makePacket: function (protoVer, type, payload) {
    var packet = [
      'MUR',
      protoVer,
      type,
      payload
    ]

    return encode(packet)
  },

  packControlContext: function (data) {
    var payload = [
      data.direct_power,
      data.direct_mode,
      data.axes_speed,
      data.axes_regulators,
      data.target_yaw !== null ? packFloat(data.target_yaw) : packFloat(-9900),
      data.actuator_power
    ]

    // debug("control payload:")
    // debug(payload)

    var packet = this.makePacket(0, 'C', payload)
    return packet
  },

  packControlActuator: function (data) {
    var payload = [
      data.index,
      data.power,
      data.duration
    ]

    var packet = this.makePacket(0, 'A', payload)
    return packet
  },

  packControlReboot: function (data) {
    var payload = [
      data.delay
    ]

    var packet = this.makePacket(0, 'R', payload)
    return packet
  },

  packControlInfo: function (data) {
    var payload = []

    var packet = this.makePacket(0, 'I', payload)
    return packet
  },

  packControlErase: function (data) {
    var payload = []

    var packet = this.makePacket(0, 'E', payload)
    return packet
  },

  packControlScriptRun: function (data) {
    var binData = new TextEncoder().encode(data.script)

    var payload = [
      binData
    ]

    var packet = this.makePacket(0, 'S', payload)
    return packet
  },

  packControlScriptStop: function (data) {
    var payload = []

    var packet = this.makePacket(0, 'P', payload)
    return packet
  }

}