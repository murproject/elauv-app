"use strict";

var state = null
var script = null
var scripts = []
var telemetry = {}
var highlightedBlocks = {}

var contextUpdater = null
var highlightUpdater = null

// setState('stopped')

// TODO: regulators!!!

var context = {
  motor_axes: [0, 0, 0, 0],
  regulators: 0,
  motor_powers: [0, 0, 0, 0],
  directMode: 0,
  actuators: [0, 0],
  leds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}

function clamp(value, maxPower = 100) {
  return Math.min(Math.max(value, -maxPower), maxPower)
}

// var contextOld = Object.assign({}, context)
var contextTimestamp = new Date()


function sendContext () {
  // TODO: postMessage with current state //
  // if ((contextOld !== context) || (Math.abs(new Date() - contextTimestamp) > 500)) {
  // // if ((contextOld !== context)) {
  //   self.postMessage({ type: 'context', context: context })
  //   contextOld = Object.assign({}, context)
  //   contextTimestamp = new Date()
  // }
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
}


const mur = {
  threadsStates: [],
  mainThreadState: true,
  lastActiveBlock: {},

  h: async function (scriptId, blockId) {
    highlightedBlocks[scriptId] = [blockId, 5]

    await mur.delay(3)
  },

  // TODO: clamp here or in context handler?

  set_axis: async function (index, speed) {
    // TODO: check index and constrain power
    speed = clamp(speed);
    context.motor_axes[index] = Math.round(speed)
  },

  set_power: async function (index, power) {
    // TODO: check index and constrain power
    power = clamp(power);
    context.motor_powers[index] = Math.round(power)
  },

  set_led: async function (index, colour) {
    // TODO: check index
    const rawColour = Number("0x" + colour.substring(1))
    context.leds[index * 3 + 0] = (rawColour >> (16)) & 0xFF
    context.leds[index * 3 + 1] = (rawColour >> ( 8)) & 0xFF
    context.leds[index * 3 + 2] = (rawColour >> ( 0)) & 0xFF
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

  get_imu_tap: function () {
    return telemetry.feedback.imuTap
  },

  get_color_status: function (mode) {
    return telemetry.feedback.colorStatus ^ (mode === 'SENSOR_COLOR_WHITE')
  },

  thread_end: async function (scriptId, end_script = false, wait_forever = true) {

    console.log(`thread_end: ${scriptId} ${end_script} ${wait_forever}`);

    if (end_script) {
      for (const i in scripts) {
        this.thread_end(i, false);
      }
    }

    this.threadsStates[scriptId] = false;

    sendHighlight(true);
    self.postMessage({ type: 'thread_end', id: scriptId })

    if (!this.threadsStates.includes(true) && !this.mainThreadState) {
      setState('done');
    }

    if (wait_forever) {
      await new Promise(() => {});
    }
  },
}


function setState (newState) {
  state = newState
  self.postMessage({ type: 'state', state: state })
}


function strReplaceAll(str, match, replace) {
  return str.replace(new RegExp(match, 'gm'), () => replace)
}


function makeScript (index, code) {
  console.log('generated code:')
  console.log(code)

  let script = '';
  let isFunction = false;

  const funcRegex = /(?<=^|\n)function \w+\(.*\)/g;

  if (funcRegex.test(code)) {
    isFunction = true;

    // make user-defined function async
    code = code.replace(funcRegex, 'async $&')

    // clear blocks highlight on any return from function
    code = code.replace(/^ *return/gm, 'await mur.h(_scriptId, null); return')

    // clear blocks highlight on end of function
    const lastBracket = code.lastIndexOf("}\n");
    code = code.slice(0, lastBracket - 1) + "\nawait mur.h(_scriptId, null);\n" + code.slice(lastBracket)

    script = `${strReplaceAll(code, '_scriptId', index)}`
  }
  else {
    script = `
(async () => {
  ${strReplaceAll(code, '_scriptId', index)}
  await mur.thread_end(${index});
})();
`
  }

  return {script: script, isFunction: isFunction};
}


self.onmessage = function (e) {
  if (!('type' in e.data)) {
    return
  }

  if (e.data.type === 'run') {
    scripts = e.data.scripts

    contextUpdater = setInterval(sendContext,100)
    highlightUpdater = setInterval(sendHighlight, 50)

    if (state === 'running') {
      return;
    }

    console.warn("run interpreter");
    setState('running')

    script = ''
    for (var i in scripts) {
      mur.threadsStates[i] = true;
      const currentScript = makeScript(i, scripts[i]);
      if (currentScript.isFunction) {
        mur.threadsStates[i] = false;
        script = currentScript.script + script; // prepend
      } else {
        script += currentScript.script;
      }
    }

    script = `
(async () => {
mur.h(null);
${script}
})();
`
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