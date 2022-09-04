import {encode, decode} from '@msgpack/msgpack';

const curProtoVer = 1; /* current protocol version */

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
  ControlGetAllSettings   : 0x21,
  ControlBatterySettings  : 0x22,
  ControlMotorsSettings   : 0x23,
  ControlImuSettings      : 0x24,

  /* General feedback */
  ReplyTelemetry          : 0xA1,

  /* Service reply */
  ReplyPing               : 0xB1,
  ReplyDiagnosticInfo     : 0xB2,

  /* Settings reply */
  ReplyAllSettings        : 0xC1,
};

/* Utils (bitwize, math) */

function checkBit(value, mask) {
  return ((value & mask) === mask);
}

function setBit(value, mask, state) {
  if (state === true) {
    value |= mask;
  } else {
    value &= ~mask;
  }

  return value;
}

function clamp(value, maxPower = 100) {
  return Math.min(Math.max(value, -maxPower), maxPower);
}

function packFixed(value, precision = 0.01) {
  return Math.round(value * (1.0 / precision));
}

/* Bitmasks */

const regulatorsMask = {
  yaw:        1 << 0,
  pitch:      1 << 1,
  roll:       1 << 2,
  depth:      1 << 3,
  isJoystick: 1 << 4,
};

const feedbackMask = {
  imuTap:           1 << 0,
  imuDoubleTap:     1 << 1,
  imuCalibrating:   1 << 2,
  colorStatus:      1 << 3,
  solenoidRelaxing: 1 << 4,
  pilotingMode:     1 << 5,
  yawStabilized:    1 << 6,
  pilotingBlocked:  1 << 7,
};

export default {
  name: 'Protocol',
  protocol: this,
  packetTypes: packetId,
  parsers: {},

  /* Enums, structs, utils */

  imuActions: {
    UpdateSettings: 0,
    Recalibrate: 1,
    ResetZero: 2,
  },

  battActions: {
    UpdateSettings: 0,
    Reset: 1,
  },

  regulators: {
    yaw: false,
    pitch: false,
    roll: false,
    depth: false,
    isJoystick: false,

    unpack: function(data) {
      this.yaw = checkBit(data, regulatorsMask.yaw);
      this.pitch = checkBit(data, regulatorsMask.pitch);
      this.roll = checkBit(data, regulatorsMask.roll);
      this.depth = checkBit(data, regulatorsMask.depth);
      this.isJoystick = checkBit(data, regulatorsMask.isJoystick);
      return this;
    },

    pack: function() {
      let data = 0;
      data = setBit(data, regulatorsMask.depth, this.depth);
      data = setBit(data, regulatorsMask.yaw, this.yaw);
      data = setBit(data, regulatorsMask.pitch, this.pitch);
      data = setBit(data, regulatorsMask.roll, this.roll);
      data = setBit(data, regulatorsMask.isJoystick, this.isJoystick);
      return data;
    },
  },

  feedback: {
    imuTap: false,
    imuDoubleTap: false,
    imuCalibrating: false,
    colorStatus: false,
    solenoidRelaxing: false,
    pilotingMode: false,
    yawStabilized: false,
    pilotingBlocked: false,

    unpack: function(data) {
      this.imuTap = checkBit(data, feedbackMask.imuTap);
      this.imuDoubleTap = checkBit(data, feedbackMask.imuDoubleTap);
      this.imuCalibrating = checkBit(data, feedbackMask.imuCalibrating);
      this.colorStatus = checkBit(data, feedbackMask.colorStatus);
      this.solenoidRelaxing = checkBit(data, feedbackMask.solenoidRelaxing);
      this.pilotingMode = checkBit(data, feedbackMask.pilotingMode);
      this.yawStabilized = checkBit(data, feedbackMask.yawStabilized);
      this.pilotingBlocked = checkBit(data, feedbackMask.pilotingBlocked);

      return this;
    },

    pack: function() {
      let data = 0;

      data = setBit(data, this.feedbackMask.imuTap, this.imuTap);
      data = setBit(data, this.feedbackMask.imuDoubleTap, this.imuDoubleTap);
      data = setBit(data, this.feedbackMask.imuCalibrating, this.imuCalibrating);
      data = setBit(data, this.feedbackMask.colorStatus, this.colorStatus);
      data = setBit(data, this.feedbackMask.solenoidRelaxing, this.solenoidRelaxing);
      data = setBit(data, this.feedbackMask.pilotingMode, this.pilotingMode);
      data = setBit(data, this.feedbackMask.yawStabilized, this.yawStabilized);
      data = setBit(data, this.feedbackMask.pilotingBlocked, this.pilotingBlocked);

      return data;
    },
  },

  prettyHex: function(raw, dots = false) {
    if (!(raw instanceof Uint8Array)) {
      raw = new Uint8Array(raw);
    }

    let hexString = Buffer.from(raw).toString('hex').toUpperCase();

    if (dots) {
      hexString = hexString.replace(/(.{2})/g, '$1:');
      hexString = hexString.substring(0, hexString.length - 1);
    }

    return hexString;
  },

  /* Packet parsing */

  splitBufferToPackets: function(buffer) {
    /* split buffer to packets, respecting 2-bytes size header */
    let chunk = buffer;
    const packets = [];

    for (let i = 0; i < 20; i++) { // no more than 20 packets per buffer
      const packetSize = (chunk[1] << 8) + chunk[0];
      const currentPacket = chunk.slice(2, 2 + packetSize);

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

  parsePacket: function(raw) {
    const data = decode(raw);

    if (!Array.isArray(data) || data.length < 4) {
      return;
    }

    const packet = {
      header: data[0],
      protoVer: data[1],
      type: data[2],
      payload: data[3],
    };

    let result = {};

    if (packet.type in this.parsers) {
      result = this.parsers[packet.type](packet);
    }

    return result;
  },

  fillParsers: function() {
    this.parsers[packetId.ReplyTelemetry] = (p) => this.parseTelemetry(p);
    this.parsers[packetId.ReplyDiagnosticInfo] = (p) => this.parseDiagnosticInfo(p);
    this.parsers[packetId.ReplyPing] = (p) => this.parsePing(p);
    this.parsers[packetId.ReplyAllSettings] = (p) => this.parseAllSettings(p);
  },

  parseTelemetry: function(packet) {
    const data = packet.payload;

    const telemetry = {
      type: packet.type,
      lastProtoVer: this.prettyHex([data[0]]),
      hardwareRev:  this.prettyHex([data[1]]),
      macAddress:   this.prettyHex(data[2], true),
      timestamp:    data[3],
      feedback:     this.feedback.unpack(data[4]),
      depth:        data[5] * 0.01,
      depthTemp:    data[6] * 0.01,
      imuYaw:       data[7] * 0.01,
      imuPitch:     data[8] * 0.01,
      imuRoll:      data[9] * 0.01,
      battVolts:    data[10] * 0.01,
      battAmps:     data[11] * 0.01,
      battRsoc:     data[12] * 0.01,
      battTemp:     data[13] * 0.01,
      memFree:      data[14],
      motorsPower:  data[15],
    };

    return telemetry;
  },

  parseDiagnosticInfo: function(packet) {
    const data = packet.payload;
    const info = {
      type: packet.type,
      softwareRevMajor:   data[0],
      softwareRevMinor:   data[1],
      hardwareRev:        data[2],
      buildDate:          data[3],
      buildTime:          data[4],
      imuStarted:         Boolean(data[5]),
      voltmeterStarted:   Boolean(data[6]),
      battRemainCapacity: data[7],
      battFullCapacity:   data[8],
      battDesignCapacity: data[9],
      battPower:          data[10],
      battHealth:         data[11],
      text:               data[12],
    };
    return info;
  },

  parsePing: function(packet) {
    const data = packet.payload;
    const info = {
      type: packet.type,
      counter: data[0],
    };

    return info;
  },

  parseAllSettings: function(packet) {
    const data = packet.payload;

    const settings = {
      type: packet.type,
      startupsCount:            data[0],
      motorsPorts:              data[1],
      motorsMultipliers:        data[2],
      motorsOffsetPositive:     data[3] * 0.01,
      motorsOffsetNegative:     data[4] * 0.01,
      fuelGaugeBattCapacity:    data[5],
      fuelGaugeTerminateVolts:  data[6],
      fuelGaugeTaperCurrent:    data[7],
      fuelGaugeSocMin:          data[8],
      fuelGaugeSocMax:          data[9],
      imuTapTimeout:            data[10],
      imuTapThreshold:          data[11] * 0.01,
      yawPidI:                  data[12] * 0.01,
      yawPidD:                  data[13] * 0.01,
      yawPidStabMaxErr:         data[14] * 0.01,
      yawPidStabWaitMs:         data[15],
    };

    return settings;
  },

  makePacket: function(protoVer, type, payload) {
    const packet = [
      'MUR',
      protoVer,
      type,
      payload,
    ];

    const encoded = encode(packet);
    const len = encoded.length;
    const buffer = new Uint8Array(2 + len);
    buffer.set([len & 0xFF, len >> 8], 0);
    buffer.set(encoded, 2);

    return buffer;
  },

  packControlContext: function(data) {
    for (const i in data.direct_power) {
      data.direct_power[i] = clamp(data.direct_power[i]);
    }

    for (const i in data.axes_speed) {
      data.axes_speed[i] = clamp(data.axes_speed[i]);
    }

    for (const i in data.actuator_power) {
      data.actuator_power[i] = clamp(data.actuator_power[i]);
    }

    const payload = [
      data.direct_power,
      data.direct_mode,
      data.axes_speed,
      data.axes_regulators,
      data.target_yaw !== null ? packFixed(data.target_yaw) : packFixed(0),
      data.actuator_power,
      data.leds,
    ];

    const packet = this.makePacket(curProtoVer, packetId.ControlContext, payload);
    return packet;
  },

  packControlReboot: function(data) {
    const payload = [
      data.delay,
    ];

    const packet = this.makePacket(curProtoVer, packetId.ControlReboot, payload);
    return packet;
  },

  packControlDiagnosticInfo: function(data) {
    const payload = [];

    const packet = this.makePacket(curProtoVer, packetId.ControlDiagnosticInfo, payload);
    console.log(packet);
    return packet;
  },

  packControlErase: function(data) {
    const payload = [];

    const packet = this.makePacket(curProtoVer, packetId.ControlErase, payload);
    return packet;
  },

  packControlPing: function(data) {
    const payload = [
      data.counter,
    ];

    const packet = this.makePacket(curProtoVer, packetId.ControlPing, payload);
    return packet;
  },

  packControlGetAllSettings: function(data) {
    const payload = [];

    const packet = this.makePacket(curProtoVer, packetId.ControlGetAllSettings, payload);
    return packet;
  },

  packControlBatterySettings: function(data) {
    const payload = [
      data.action,
      data.fuelGaugeBattCapacity,
      data.fuelGaugeTerminateVolts,
      data.fuelGaugeTaperCurrent,
      data.fuelGaugeSocMin,
      data.fuelGaugeSocMax,
    ];

    const packet = this.makePacket(curProtoVer, packetId.ControlBatterySettings, payload);
    return packet;
  },

  packControlMotorsSettings: function(data) {
    const payload = [
      data.motorsPorts,
      data.motorsMultipliers,
      packFixed(data.motorsOffsetPositive),
      packFixed(data.motorsOffsetNegative),
      packFixed(data.yawPidI),
      packFixed(data.yawPidD),
      packFixed(data.yawPidStabMaxErr),
      data.yawPidStabWaitMs,
    ];

    const packet = this.makePacket(curProtoVer, packetId.ControlMotorsSettings, payload);
    console.log(payload);
    return packet;
  },

  packControlImuSettings: function(data) {
    const payload = [
      data.action,
      data.imuTapTimeout,
      packFixed(data.imuTapThreshold),
    ];

    const packet = this.makePacket(curProtoVer, packetId.ControlImuSettings, payload);
    return packet;
  },

};
