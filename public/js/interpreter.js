"use strict";

var state = null
var script = null
var scripts = []
var telemetry = {}

var highlightedBlocks = {}
var highlightedBlocksActual = {}

var contextUpdater = null
var highlightUpdater = null

setState('not-running')

var context = {
  motor_axes: [0, 0, 0, 0],
  regulators: 0,
  motor_powers: [0, 0, 0, 0],
  directMode: 0,
  actuators: [0, 0]
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

function sendHighlight () {
  const changedBlocks = {}
  const time = +new Date()
  let newState = null

  // for (const key in highlightedBlocks) {
  //   const block = highlightedBlocks[key]
  //   const timeout = typeof (block) === 'number' ? (time - block) > 100 : !block

  //   if (timeout) {
  //     highlightedBlocks[key] = false
  //     newState = false
  //   } else {
  //     newState = true
  //   }

  //   if (highlightedBlocksActual[key] != newState && key) {
  //     changedBlocks[key] = newState
  //     highlightedBlocksActual[key] = newState
  //   }
  // }

  for (const key in highlightedBlocks) {
    changedBlocks[key] = highlightedBlocks[key];
  }

  self.postMessage({ type: 'mur.h', blockId: changedBlocks })
}


const mur = {
  threadsStates: [],
  mainThreadState: true,
  lastActiveBlock: {},

  h: async function (scriptId, blockId) {
    // if (this.lastActiveBlock[scriptId] && this.lastActiveBlock[scriptId] !== blockId) {
    //   highlightedBlocks[this.lastActiveBlock[scriptId]] = +new Date()
    // }

    // this.lastActiveBlock[scriptId] = blockId
    // highlightedBlocks[blockId] = true

    highlightedBlocks[scriptId] = blockId

    await mur.delay(3)
  },

  // TODO: clamp here or in context handler?

  set_axis: async function (index, speed) {
    context.motor_axes[index] = Math.round(speed)
  },

  set_power: async function (index, power) {
    context.motor_powers[index] = Math.round(power)
  },

  actuator: async function (index, power) {
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

  thread_end: function (scriptId) {
    this.threadsStates[scriptId] = false;

    if (!this.threadsStates.includes(true) && !this.mainThreadState) {
      setState('done');
    }
  },
}


function setState (newState) {
  state = newState
  self.postMessage({ type: 'state', state: state })
}


function strReplaceAll(str, match, replace) {
  return str.replace(new RegExp(match, 'g'), () => replace)
}


function makeScript (index, code) {
  console.log('generated code:')
  console.log(code)

  return `
${strReplaceAll(code, '_scriptId', index)}
/* ------------- */
`
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
      script += makeScript(i, scripts[i])
    }

    script = `
(async () => {
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
