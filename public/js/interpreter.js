var state = null
var script = null
var scripts = []
var telemetry = {}
var highlightedBlocksArray = {}

var contextUpdater = setInterval(sendContext, 75)
var highlightUpdater = setInterval(sendHighlight, 125)

setState('not-running')

var context = {
  motor_axes: [0, 0, 0, 0],
  regulators: 0,
  motor_powers: [0, 0, 0, 0],
  directMode: 0,
  actuators: [0, 0]
}

var contextOld = Object.assign({}, context)

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

  for (const key in highlightedBlocksArray) {
    const block = highlightedBlocksArray[key]
    const timeout = typeof (block) === 'number' ? (time - block) > 125 : !block

    if (timeout) {
      highlightedBlocksArray[key] = false
      changedBlocks[key] = false
    } else {
      changedBlocks[key] = true
    }
  }

  self.postMessage({ type: 'mur.h', blockId: changedBlocks })
}

const mur = {
  highlightedBlocks: {},
  lastActiveBlock: {},

  h: async function (scriptId, blockId) {
    if (this.lastActiveBlock[scriptId] && this.lastActiveBlock[scriptId] !== blockId) {
      highlightedBlocksArray[this.lastActiveBlock[scriptId]] = +new Date()
    }

    this.lastActiveBlock[scriptId] = blockId
    highlightedBlocksArray[blockId] = true

    await mur.delay(10)
  },

  set_axis: async function (index, speed) {
    context.motor_axes[index] = Math.round(speed)
    // self.postMessage({ type: 'mur.set_power', index: index, power: power })
  },

  set_power: async function (index, power) {
    context.motor_powers[index] = Math.round(power)
    // sendContext()
    // self.postMessage({ type: 'mur.set_power', index: index, power: power })
  },

  actuator: async function (index, power) {
    context.actuators[index] = Math.round(power)
    // self.postMessage({ type: 'mur.actuator', index: await (index), power: await (power) })
  },

  delay: function (sleepMs) {
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
  }
}

function setState (newState) {
  state = newState
  self.postMessage({ type: 'state', state: state })
}

function strReplaceAll(str, match, replace) {
  return str.replace(new RegExp(match, 'g'), () => replace)
}

function makeScript (index, code) {
  // TODO; should at first create all async functions, anbd only then start them all
  // TODO: set id (custom user name?) for every "thread" to be able to control it
//   return `
// (async () => {
// var _scriptId = ${index};
// /* user thread start */

  // ${code}

  // /* user thread end */
  // mur.h(_scriptId, null)
  // })();

  // /* ------------- */
  // `

  console.log('generated code:')
  console.log(code)

  // highlightedBlocksArray[index] = {}

  return `
${strReplaceAll(code, '_scriptId', index)}
/* ------------- */
`
}

self.onmessage = async function (e) {
  if (!('type' in e.data)) {
    return
  }

  if (e.data.type === 'run') {
    scripts = e.data.scripts

    setState('running')
    script = ''
    for (var i in scripts) {
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
    } catch (e) {
      console.log(e)
    }

    setState('done') // TODO: prints 'done' even if script is not over (async functions)
    // TODO: should set 'done' flag on end of every thread?

    // script = `async function script(){\n${e.data.script}\n}; script();\n`
    // console.log(script)

    // setState('running')
    // try {
    //   eval(script)
    // } catch (e) {
    //   alert(e)
    // }

    // setState('done')
  }

  if (e.data.type === 'telemetry') {
    telemetry = e.data.telemetry
  }
}
