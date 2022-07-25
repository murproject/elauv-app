import { encode, decode } from '@msgpack/msgpack'

const curProtoVer = 0; // current protocol version

const packetId = {
  /* General user control */
  ControlContext          : 0x01,
  ControlContextStop      : 0x02,

  /* Service control */
  ControlPing             : 0x11,
  ControlDiagnosticInfo   : 0x12,
  ControlReboot           : 0x13,
  ControlErase            : 0x14,

  /* Settings control */
  ControlBatterySettings  : 0x21,
  ControlMotorsSettings   : 0x22,
  ControlImuSettings      : 0x23,

  /* General feedback */
  ReplyTelemetry          : 0xA1,

  /* Service reply */
  ReplyPong               : 0xB1,
  ReplyDiagnosticInfo     : 0xB2,

  /* Settings reply */
  ReplyBatterySettings    : 0xC1,
  ReplyMotorsSettings     : 0xC2,
  ReplyImuSettings        : 0xC3,
}

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

function clamp(value, maxPower = 100) {
  return Math.min(Math.max(value, -maxPower), maxPower)
}

function packFloat (value, precision = 0.01) {
  return Math.round(value * (1.0 / precision))
}

var regulatorsMask = {
  yaw:        1 << 0,
  pitch:      1 << 1,
  roll:       1 << 2,
  depth:      1 << 3,
  isJoystick: 1 << 4,
}

var feedbackMask = {
  imuTap: 1 << 0,
  colorStatus: 1 << 1
}

export default {
  name: 'Protocol',
  protocol: this,
  packetTypes: packetId,

  imuActions: {
    UpdateSettings: 0,
    Recalibrate: 1,
    ResetZero: 2,
  },

  regulators: {
    yaw: false,
    pitch: false,
    roll: false,
    depth: false,
    isJoystick: false,

    unpack: function (data) {
      this.yaw = checkBit(data, regulatorsMask.yaw)
      this.pitch = checkBit(data, regulatorsMask.pitch)
      this.roll = checkBit(data, regulatorsMask.roll)
      this.depth = checkBit(data, regulatorsMask.depth)
      this.isJoystick = checkBit(data, regulatorsMask.isJoystick)
      return this
    },

    pack: function () {
      var data = 0
      data = setBit(data, regulatorsMask.depth, this.depth)
      data = setBit(data, regulatorsMask.yaw, this.yaw)
      data = setBit(data, regulatorsMask.pitch, this.pitch)
      data = setBit(data, regulatorsMask.roll, this.roll)
      data = setBit(data, regulatorsMask.isJoystick, this.isJoystick)
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

  splitBufferToPackets: function(buffer) {
    // TODO: split buffer to packets, respecting 2-bytes size header
    let chunk = buffer;
    let packets = [];

    for (let i = 0; i < 20; i++) { // no more than 20 packets per buffer
      const packetSize = (chunk[1] << 8) + chunk[0];
      // console.log('packet size: ' + packet_size);
      const currentPacket = chunk.slice(2, 2 + packetSize);
      // console.log(packet);

      if (packetSize > 0 && packetSize === currentPacket.length) {
        packets.push(currentPacket);
        chunk = chunk.slice(2 + packetSize);
      } else {
        break;
      }

      if (packetSize !== currentPacket.length) {
        console.log(`packet_size: ${packetSize}; currentPacket.length: ${currentPacket.length}`);
      }
    }

    if (packets.length !== 1) {
      console.log('unusal packets count: ' + packets.length);
      console.log(buffer);
      console.log(packets);
    }

    return packets;
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

    var result = {}

    if (packet.type === packetId.ReplyTelemetry) {
      result = this.parseTelemetry(packet)
    }

    if (packet.type === packetId.ReplyDiagnosticInfo) {
      result = this.parseDiagnosticInfo(packet)
    }

    if (packet.type === packetId.ReplyPong) {
      result = this.parsePong(packet)
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
      type: packet.type,
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
      battAmps: data[11] * 0.01,
      battRsoc: data[12] * 0.01,
      battTemp: data[13] * 0.01,
      memFree: data[14]
    }

    // debug(telemetry)
    return telemetry
  },

  parseDiagnosticInfo: function (packet) {
    var data = packet.payload
    var info = {
      type: packet.type,
      text: data[0]
    }
    // writeLog(info)
    return info
  },

  parsePong: function (packet) {
    var data = packet.payload
    var info = {
      type: packet.type,
      counter: data[0]
    }

    return info
  },

  makePacket: function (protoVer, type, payload) {
    var packet = [
      'MUR',
      protoVer,
      type,
      payload
    ]

    // TODO: fill first bytes with packet size

    const encoded = encode(packet)
    const len = encoded.length
    const buffer = new Uint8Array(2 + len)
    buffer.set([len & 0xFF, len >> 8], 0)
    buffer.set(encoded,2)
    // console.log("sending packet:")
    // console.log(buffer)

    return buffer
  },

  packControlContext: function (data) {
    for (const i in data.direct_power) {
      data.direct_power[i] = clamp(data.direct_power[i]);
    }

    for (const i in data.axes_speed) {
      data.axes_speed[i] = clamp(data.axes_speed[i]);
    }

    for (const i in data.actuator_power) {
      data.actuator_power[i] = clamp(data.actuator_power[i]);
    }

    var payload = [
      data.direct_power,
      data.direct_mode,
      data.axes_speed,
      data.axes_regulators,
      data.target_yaw !== null ? packFloat(data.target_yaw) : packFloat(-9900),
      data.actuator_power,
      data.leds,
    ]

    // debug("control payload:")
    // debug(payload)
    // console.log(payload);

    var packet = this.makePacket(curProtoVer, packetId.ControlContext, payload)
    return packet
  },

  // packControlActuator: function (data) {
  //   var payload = [
  //     data.index,
  //     data.power,
  //     data.duration
  //   ]

  //   var packet = this.makePacket(curProtoVer, packetId., payload)
  //   return packet
  // },

  packControlReboot: function (data) {
    var payload = [
      data.delay
    ]

    var packet = this.makePacket(curProtoVer, packetId.ControlReboot, payload)
    return packet
  },

  packControlDiagnosticInfo: function (data) {
    var payload = []

    var packet = this.makePacket(curProtoVer, packetId.ControlDiagnosticInfo, payload)
    console.log(packet);
    return packet
  },

  packControlErase: function (data) {
    var payload = []

    var packet = this.makePacket(curProtoVer, packetId.ControlErase, payload)
    return packet
  },

  packControlPing: function (data) {
    var payload = []

    var packet = this.makePacket(curProtoVer, packetId.ControlPing, payload)
    return packet
  },

  packControlBatterySettings: function (data) {
    var payload = [
      data.designCapacity,
      data.ccGain,
      data.terminateVoltage,
      data.taperCurrent,
    ]

    var packet = this.makePacket(curProtoVer, packetId.ControlBatterySettings, payload)
    return packet
  },

  packControlMotorsSettings: function (data) {
    var payload = [
      data.motorsPorts,
      data.motorsMultipliers,
    ]

    var packet = this.makePacket(curProtoVer, packetId.ControlMotorsSettings, payload)
    return packet
  },

  packControlImuSettings: function (data) {
    var payload = [
      data.action,
      data.tapTimeout,
      data.tapTreshold,
    ]

    var packet = this.makePacket(curProtoVer, packetId.ControlImuSettings, payload)
    return packet
  }

}
