"use strict";

var state = null
var script = null
var scripts = []
var telemetry = {}
var highlightedBlocks = {}
var msgToSend = {}

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

  if (Object.keys(msgToSend).length > 0) {
    self.postMessage({ type: 'print', msg: msgToSend })
    for (const key in msgToSend) {
      delete msgToSend[key];
    }
  }

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
    // TODO: send only on highlight timer
    msgToSend[name] = value;
    // console.error(name + " : " + value);
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

  console.warn('generated code: ' + index)
  console.log(code)

  let script = '';
  let isFunction = false;

  // const funcRegex = /(?<=^|\n)function \w+\(.*\)/g;
  const funcUser = /^ *(function) (.*) {\n *await mur.h\(/gm;
  // const varsDecl = /^\/\* MUR: User variables begin \*\//gm;

  if (funcUser.test(code)) {
    isFunction = true;

    // make user-defined function async
    code = code.replace(funcRegex, 'async $&')

    // clear blocks highlight on any return from function
    code = code.replace(/^ *return/gm, 'await mur.h(_threadId, null); return')

    // clear blocks highlight on end of function
    const lastBracket = code.lastIndexOf("}\n");
    code = code.slice(0, lastBracket - 1) + "\nawait mur.h(_threadId, null);\n" + code.slice(lastBracket)

    // code = "/* USER_PROCEDURE_BEGIN */\n\n" + code + "\n\n/* USER_PROCEDURE_END */"
    // console.error("USER_PROCEDURE")

    // script = `${strReplaceAll(code, '_scriptId', index)}\n`
  }
  else {
    script = `
(async () => {
  ${code}
})();
`
// await mur.thread_end(${index});
  }

  for (const variable in mur.vars) {
    console.warn("replacing " + variable);
    script = strReplaceAll(script, variable, `mur.vars["${variable}"]`);
  }

  return {script: script, isFunction: isFunction};
}


self.onmessage = function (e) {
  if (!('type' in e.data)) {
    return
  }

  if (e.data.type === 'run') {
    scripts = e.data.scripts

    // e.data.userVariables.forEach(variable => {
    //   mur.vars[variable] = undefined;
    // });

    contextUpdater = setInterval(sendContext,100)
    highlightUpdater = setInterval(sendHighlight, 50)

    if (state === 'running') {
      return;
    }

    console.warn("run interpreter");
    setState('running')

    script = ''
    script = makeScript(0, scripts[0]).script // TODO //

    for (const i in e.data.threads) {
      mur.threadsStates[e.data.threads[i]] = true;
    }

    // for (var i in scripts) {
    //   mur.threadsStates[i] = true;
    //   const currentScript = makeScript(i, scripts[i]);
    //   if (currentScript.isFunction) {
    //     mur.threadsStates[i] = false;
    //     script = currentScript.script + script; // prepend
    //   } else {
    //     script += currentScript.script;
    //   }
    // }

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