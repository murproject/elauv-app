"use strict";

var state = null
var script = null
var scripts = []
var telemetry = {}
var highlightedBlocks = {}
var msgToSend = {}

var contextUpdater = null
var highlightUpdater = null

const motorsIndex = {
  hl: 0,
  hr: 1,
  vf: 2,
  vb: 3,
};

const ledIndex = {
  0: 3,
  1: 0,
  2: 1,
  3: 2,
}

var context = {
  axes_speed: [0, 0, 0, 0],
  regulators: 0b00000000,
  motor_powers: [0, 0, 0, 0],
  direct_mode: 0b00001111,
  actuators: [0, 0],
  target_yaw: 0,
  leds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}

function checkBit (value, mask) {
  return ((value & mask) === mask)
}


function setBit (value, mask, state) {
  if (state === true || state == 1) {
    value |= mask
  } else {
    value &= ~mask
  }

  return value
}


function clamp(value, minPower = -100, maxPower = 100) {
  return Math.min(Math.max(value, minPower), maxPower)
}


function sendContext () {
  self.postMessage({ type: 'context', context: context })
}

function sendHighlight (bold = false) {
  for (const key in highlightedBlocks) {
    if (highlightedBlocks[key][1] < 100) {
      highlightedBlocks[key][1] += 5;
    }

    if (bold) {
      highlightedBlocks[key][1] = 100;
    }
  }

  self.postMessage({ type: 'mur.h', blocks: highlightedBlocks })

  if (Object.keys(msgToSend).length > 0) {
    self.postMessage({ type: 'print', msg: msgToSend })
    for (const key in msgToSend) {
      delete msgToSend[key];
    }
  }

}

function setDirectMode(index, mode) {
  context.direct_mode = setBit(context.direct_mode, 1 << index, mode);
  console.log(`index = ${index}, mode = ${mode}, mask = ${1 << index}, new val: ${context.direct_mode}`);
}

const mur = {
  threadsStates: {},
  mainThreadState: true,
  lastActiveBlock: {},
  timeOfStart: new Date(),
  vars: {},

  h: async function (threadId, blockId) {
    highlightedBlocks[threadId] = [blockId, 5]
    // console.log(`mur.h( "${threadId}", "${blockId}" )`);

    await mur.delay(3)
  },

  stop_all: async function() {
    for (let i = 0; i < 4; i++) {
      context.axes_speed[i] = 0;
    }

    for (let i = 0; i < 4; i++) {
      await this.set_power(i, 0);
    }
  },

  // TODO: clamp here or in context handler?

  set_axis: async function (index, speed) {
    // TODO: check index and constrain power
    speed = clamp(speed);
    context.axes_speed[index] = Math.round(speed);

    if (index == 0) { // AXIS_YAW
      setDirectMode(motorsIndex.hl, false);
      setDirectMode(motorsIndex.hr, false);
      context.regulators = 0; // disable yaw regulator if set speed on yaw axis
    } else if (index == 1) { // AXIS_MARCH
      setDirectMode(motorsIndex.hl, false);
      setDirectMode(motorsIndex.hr, false);
    } else if (index == 2) { // AXIS_DEPTH
      setDirectMode(motorsIndex.vf, false);
      setDirectMode(motorsIndex.vb, false);
    }
  },

  set_yaw: async function(yaw, power, absolute = true) {
    power = clamp(power, 0, 100);

    if (absolute) {
      context.target_yaw = yaw;
    } else {
      context.target_yaw = this.angle_norm(context.target_yaw + yaw);
    }

    context.axes_speed[0] = power;

    // disable direct mode on horizontal motors
    setDirectMode(motorsIndex.hl, false);
    setDirectMode(motorsIndex.hr, false);

    context.regulators = 1;
    telemetry.feedback.yawStabilized = false; // force, to prevent accidentally claiming as already stabilized

    await this.delay(200);

    const _wait_yaw_begin_timestamp = Date.now();
    while (Date.now() - _wait_yaw_begin_timestamp < (10 * 1000)) {
      await this.delay(150);
      if (telemetry.feedback.yawStabilized === true) {
        break;
      }
      console.log("not stabilized, need to wait! " + Math.round(Date.now() - _wait_yaw_begin_timestamp));
    }
  },

  set_power: async function (index, power) {
    // TODO: check index and constrain power
    power = clamp(power);
    context.motor_powers[index] = Math.round(power)
    setDirectMode(index, true)

    if (index == 0 || index == 1) {
      context.regulators = 0;
    }
  },

  set_led: async function (index, colour) {
    if (typeof(index) === 'number' && index >= 0 && index <= 3) {
      index = ledIndex[index];
      const rawColour = Number("0x" + colour.substring(1))
      context.leds[index * 3 + 0] = (rawColour >> (8 * 2)) & 0xFF
      context.leds[index * 3 + 1] = (rawColour >> (8 * 1)) & 0xFF
      context.leds[index * 3 + 2] = (rawColour >> (8 * 0)) & 0xFF
    }
  },

  actuator: async function (index, power) {
    power = clamp(power);
    context.actuators[index] = Math.round(power)
  },

  delay: function (sleepMs) {
    // TODO: should not create dozens of timers by calling setTimeout() lots times per second,
    // TODO: create one timer with setInterval to control ticks? (but will block other async threads)
    if (sleepMs <= 0) {
      return;
    }
    return new Promise(resolve => setTimeout(resolve, sleepMs))
  },

  get_imu_axis: function (mode) {
    switch (mode) {
      case 0:
      case 'IMU_AXIS_YAW':
        return telemetry.imuYaw
      case 1:
      case 'IMU_AXIS_PITCH':
        return telemetry.imuPitch
      case 2:
      case 'IMU_AXIS_ROLL':
        return telemetry.imuRoll
    }
    return 0.0
  },

  get_imu_tap: function (mode) {
    return mode == 1 ? telemetry.feedback.imuDoubleTap : telemetry.feedback.imuTap;
  },

  get_color_status: function (mode) {
    return !!(telemetry.feedback.colorStatus ^ (mode === 'SENSOR_COLOR_WHITE'))
  },

  thread_end: async function (scriptId, end_script = false, wait_forever = true) {
    // return /* TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO */

    // console.log(`thread_end: ${scriptId} ${end_script} ${wait_forever}`);

    if (end_script) {
      for (const i in this.threadsStates) {
        this.thread_end(i, false);
      }
      // TODO: stop all motors and sendContext here? Or in BlocklyPanel before terminate?
    }

    this.threadsStates[scriptId] = false;

    sendHighlight(true);
    self.postMessage({ type: 'thread_end', id: scriptId })

    // console.log(this.threadsStates)

    if (!Object.values(this.threadsStates).includes(true) && !this.mainThreadState) {
      setState('done');
    }

    if (wait_forever) {
      await new Promise(() => {});
    }
  },

  get_timestamp: function(isMilliseconds = false) {
    if (isMilliseconds) {
      return Math.round(Number(new Date - this.timeOfStart));
    }
    return Math.round(Number(new Date - this.timeOfStart) / 1000);
  },

  print: function(name, value) {
    if (typeof(value) === 'number') {
      value = Math.round(value * 1e8) / 1e8;
    }
    msgToSend[name] = value;
  },

  angle_norm: function(angle) {
    return (Math.abs(((angle) + 180) % 360 ) - 180) * ((angle % 360) >= -180 ? 1.0 : - 1.0);
  }

}


function setState (newState) {
  state = newState
  self.postMessage({ type: 'state', state: state })
}


function strReplaceAll(str, match, replace) {
  return str.replace(new RegExp(match, 'gm'), () => replace)
}


function makeScript (index, code) {
  const funcRegex = /(?<=^|\n)function \w+\(.*\)/g;
  code = code.replace(funcRegex, 'async $&')

  return {script: code, isFunction: false};
}


self.onmessage = function (e) {
  if (!('type' in e.data)) {
    return
  }

  if (e.data.type === 'run') {
    scripts = e.data.scripts


    contextUpdater = setInterval(sendContext,100)
    setTimeout(() => highlightUpdater = setInterval(sendHighlight, 50), 25)

    if (state === 'running') {
      return;
    }

    console.warn("run interpreter");
    setState('running')

    script = ''
    script = makeScript(0, scripts[0]).script

    for (const i in e.data.threads) {
      mur.threadsStates[e.data.threads[i]] = true;
    }

    script = `
(async () => {
const _threadId = -1;
${script}
mur.h(-1, null);
})();
`

    console.warn("Run script:")
    console.log(script)

    try {
      mur.delay(10)
      eval(script)
      mur.mainThreadState = false
      console.log("main thread end");
    } catch (e) {
      console.log(e)
    }

    // setState('done') // TODO: prints 'done' even if script is not over (async functions)
    // TODO: should set 'done' flag on end of every thread?
  }

  if (e.data.type === 'telemetry') {
    telemetry = e.data.telemetry
  }
}

// TODO: wait forever (stop thread): await new Promise(() => {});