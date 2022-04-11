import * as Blockly from 'blockly/core'
import * as Ru from 'blockly/msg/ru'

import 'blockly/blocks';
import 'blockly/javascript';
import BlocklyLua from 'blockly/lua'

import MurToolbox from './Toolbox'
import Blocks from './Blocks'
import './BlocklyStyle'

import mur from '../vehicle/apiGameMur'

var workspace = null;

const example_code = {"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defreturn","id":"xeua1:/f#:}ln3|l(jJO","x":100,"y":-87,"extraState":{"params":[{"name":"ticks","id":"r)`vzf?vojnEoKMg?x*f"}]},"icons":{"comment":{"text":"Опишите эту функцию…","pinned":false,"height":80,"width":160}},"fields":{"NAME":"super_sinus"},"inputs":{"STACK":{"block":{"type":"variables_set","id":"WmDo=bA9|q6Sfo+}h6VX","fields":{"VAR":{"id":"Iun5SN}x^sIKG[Gwyd*u"}},"inputs":{"VALUE":{"block":{"type":"math_round","id":"a$C)e$VZ2)jqY2`!7pxL","fields":{"OP":"ROUND"},"inputs":{"NUM":{"block":{"type":"math_arithmetic","id":"HM/lgMnV(W9uE(edSQ}O","fields":{"OP":"ADD"},"inputs":{"A":{"block":{"type":"math_single","id":"ul04wZG7T4*T]c(;W,aU","fields":{"OP":"ABS"},"inputs":{"NUM":{"block":{"type":"math_arithmetic","id":"H2HLgv:WUUx4W8nw!T)y","fields":{"OP":"MULTIPLY"},"inputs":{"A":{"block":{"type":"math_trig","id":",d%Hu@@)/ZSf5oT1$x{3","fields":{"OP":"SIN"},"inputs":{"NUM":{"block":{"type":"variables_get","id":"b.x^]tVFNop4n2G:8oFo","fields":{"VAR":{"id":"r)`vzf?vojnEoKMg?x*f"}}}}}}},"B":{"block":{"type":"math_number","id":"b#}UO2Q2w7!N`vJS-s4@","fields":{"NUM":80}}}}}}}}},"B":{"block":{"type":"math_number","id":"6MnoRUC%v]aepjGC_E}!","fields":{"NUM":20}}}}}}}}}}}},"RETURN":{"block":{"type":"variables_get","id":"=cSjbJ%-wCmM@m)AKG@*","fields":{"VAR":{"id":"Iun5SN}x^sIKG[Gwyd*u"}}}}}},{"type":"variables_set","id":"Wk4.6|J2AY3/]kh`w$?i","x":123,"y":145,"fields":{"VAR":{"id":"97;yimqMJ0z-Lg`:,2Jj"}},"inputs":{"VALUE":{"block":{"type":"math_number","id":"$c7_yAKX[M_H4lFX]*dS","fields":{"NUM":0}}}},"next":{"block":{"type":"controls_whileUntil","id":"1Mq]mK{Ls~F~%8:qaaRK","fields":{"MODE":"WHILE"},"inputs":{"BOOL":{"block":{"type":"logic_boolean","id":")Q26Cpa=@-)SWE({i_cH","fields":{"BOOL":"TRUE"}}},"DO":{"block":{"type":"math_change","id":"x;3?YR(R*fATqA@fMBk@","fields":{"VAR":{"id":"97;yimqMJ0z-Lg`:,2Jj"}},"inputs":{"DELTA":{"shadow":{"type":"math_number","id":"opb/F~=oe2@zy(mZ=Z?4","fields":{"NUM":25}}}},"next":{"block":{"type":"controls_if","id":"v6|$h37U4Cc:)L[3fa(a","extraState":{"hasElse":true},"inputs":{"IF0":{"block":{"type":"mur_get_color","id":"CmK3wBd{NKSPG=8n~3s(","fields":{"MODE":"SENSOR_COLOR_WHITE"}}},"DO0":{"block":{"type":"mur_actuator","id":"DH^UqR6RQ[az0D5L`cLh","inputs":{"Index":{"block":{"type":"math_number","id":"CwC-5gD?,0!92:YS2dP]","fields":{"NUM":0}}},"Power":{"block":{"type":"math_number","id":"x9[!-sc[v.RPC@GIWm.O","fields":{"NUM":75}}},"Delay":{"block":{"type":"math_number","id":"Y/^=,v?hX!6b7elg[S/G","fields":{"NUM":0}}}}}},"ELSE":{"block":{"type":"mur_actuator","id":"9xV;|z=pt}]0mb4yEKu8","inputs":{"Index":{"block":{"type":"math_number","id":"8|qVODcr^+!]Q$;q{Vy#","fields":{"NUM":0}}},"Power":{"block":{"type":"math_number","id":"%k09nPRmR+#%,993(0kf","fields":{"NUM":0}}},"Delay":{"block":{"type":"math_number","id":"$37oUCC~+3t~~S0;VgYC","fields":{"NUM":0}}}}}}},"next":{"block":{"type":"mur_actuator","id":"P5i`s@c)X8DtRk]DwXdE","inputs":{"Index":{"block":{"type":"math_number","id":"-Ia]5%3fUJ[f9)bcra}U","fields":{"NUM":1}}},"Power":{"block":{"type":"procedures_callreturn","id":"pq5i^{M6A){+F!*2syc;","inline":true,"extraState":{"name":"super_sinus","params":["ticks"]},"inputs":{"ARG0":{"block":{"type":"variables_get","id":"Gg32W-+y78lNG2H4gQ*v","fields":{"VAR":{"id":"97;yimqMJ0z-Lg`:,2Jj"}}}}}}},"Delay":{"block":{"type":"math_number","id":"XL1NeY*]G,kEb,Lc6@|,","fields":{"NUM":0}}}},"next":{"block":{"type":"mur_set_power","id":"NDq:-Aw+).{S}Fr=0[g4","enabled":false,"inputs":{"Index":{"block":{"type":"math_number","id":"NVn)n{ueANKh.s$3aT}9","fields":{"NUM":0}}},"Power":{"block":{"type":"math_number","id":"HN)@aD8O]aDh4+FF?}Ug","fields":{"NUM":0}}},"Delay":{"block":{"type":"math_number","id":"|/t^+(rzyE2:rX|6zTt^","fields":{"NUM":0}}}},"next":{"block":{"type":"mur_delay","id":"}oF=Fx3rL}5YR?mBj7*j","enabled":false,"inputs":{"sleepSeconds":{"block":{"type":"math_number","id":"W|sT4J:KfmR+MVLDK1OU","fields":{"NUM":0.1}}}}}}}}}}}}}}}}}}]},"variables":[{"name":"ticks","id":"r)`vzf?vojnEoKMg?x*f"},{"name":"counter","id":"97;yimqMJ0z-Lg`:,2Jj"},{"name":"res","id":"Iun5SN}x^sIKG[Gwyd*u"},{"name":"delay","id":"29jU7naadNhY~_e}zI,q"}]};

export default {
  workspace: null,
  scriptWorker: null,
  // mur: null,

  start: function () {
    console.log("starting")
    Blocks.init();
    Blockly.setLocale(Ru)
    var blocklyArea = document.getElementById('blocklyPanel');
    var blocklyDiv = document.getElementById('blocklyDiv');
    console.log(Blockly);
    console.log(blocklyDiv);
    this.workspace = Blockly.inject(blocklyDiv,
      {
        grid: {
          spacing: 26,
          length: 2,
          colour: '#ccc',
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 2.0,
          minScale: 0.3,
          scaleSpeed: 1.5,
          pinch: true
        },
        // css: false,
        move: {
          drag: true,
          wheel: true
        },
        scrollbars: true,
        media: '/blockly-media/', // TODO!!!
        trashcan: true,
        // renderer: 'thrasos', // thrasos, zelos
        // renderer: 'zelos',
        renderer: 'custom_renderer',
        horizontalLayout: true,
        collapse: false,
        toolbox: MurToolbox,
        // toolbox: document.getElementById('toolbox')
      }
    );
    workspace = this.workspace; // TODO: тупизм...
    Blockly.svgResize(this.workspace);
  },

  generate_code: function (workspace) {
    Blockly.JavaScript.STATEMENT_PREFIX = 'await mur.h(_scriptId, %1);\n'
    var code = Blockly.JavaScript.workspaceToCode(workspace)
    code = code.replace(/(?<=^|\n)function \w+\(.*\)/g, 'async $&') // TODO: do this better
    return code
  },

  stop: function() {
    this.scriptStatus = 'stopped'
    this.scriptWorker.terminate()

    mur.controlScriptStop()
    const paramsContext = {
      direct_power: [0, 0, 0, 0],
      direct_mode: 0b00001111,
      axes_speed: [0, 0, 0, 0],
      axes_regulators: 0,
      target_yaw: null,
      actuator_power: [0, 0]
    }
    mur.context = paramsContext // TODO: move context to global scope?
    mur.controlContext(paramsContext)

    this.workspace.highlightBlock(null)
  },

  save: function() {
    const savedBlocks = Blockly.serialization.workspaces.save(this.workspace)
    console.log(savedBlocks)
    localStorage.savedBlocks = JSON.stringify(savedBlocks)
  },

  load: function() {
    const savedBlocks = localStorage.savedBlocks
    if (savedBlocks) {
      Blockly.serialization.workspaces.load(JSON.parse(savedBlocks), this.workspace)
    }
  },

  example: function() {
    Blockly.serialization.workspaces.load(example_code, this.workspace)
  },

  run_lua: function() {
    BlocklyLua.STATEMENT_PREFIX = 'h(%1)\n'
    this.code = BlocklyLua.workspaceToCode(this.workspace)

    this.codeBlockIds = []
    const regexpBlockId = new RegExp(/^ *h\('(.*)'\)$/, 'gm')
    // var result

    this.code = this.code.replace(regexpBlockId, ($0, $1) => {
      this.codeBlockIds.push($1)
      return `h('${this.codeBlockIds.length - 1}')`
    })

    console.log(this.code)

    // result = regexpBlockId.exec(this.code)
    // console.log(result)
    // while ((result = regexpBlockId.exec(this.code)) !== null) {
    //   console.log(result)
    //   this.codeBlockIds.push(result['1'])
    // }

    console.log(this.codeBlockIds)
    mur.controlScriptRun({ script: this.code })

    // TODO: disable editing while executing
  },

  run_js: function() {
    this.code = this.generate_code(this.workspace)
    console.log(this.code)

    // this.reinject(true)

    if (this.scriptWorker != null) {
      this.scriptWorker.terminate()
    }

    this.scriptWorker = new Worker('/js/interpreter.js')

    this.scriptWorker.onmessage = this.workerMsgHandler

    var json = Blockly.serialization.workspaces.save(this.workspace)

    // Store top blocks separately, and remove them from the JSON.
    var blocks = json.blocks.blocks
    var topBlocks = blocks.slice() // Create shallow copy.
    blocks.length = 0

    // Load each block into the workspace individually and generate code.
    var allCode = []
    var headless = new Blockly.Workspace()
    for (var i = 0; i < topBlocks.length; i++) {
      var block = topBlocks[i]
      blocks.push(block)
      Blockly.serialization.workspaces.load(json, headless)
      allCode.push(this.generate_code(headless))
      blocks.length = 0
    }

    console.log(allCode)

    this.scriptWorker.postMessage({ // TODO: copypasta
      type: 'telemetry',
      telemetry: JSON.parse(JSON.stringify(mur.telemetry))
    })

    this.scriptWorker.postMessage({
      type: 'run',
      scripts: allCode
      // script: this.code
    })

    this.scriptStatus = 'running'
  },

  workerMsgHandler: function (e) {
    // console.log(this);
    // TODO: should move this from component!

    // console.log('Received: ' + e.data)

    // const data = e.data
    const data = Object.assign({}, e.data)
    // console.log(data)

    if (!('type' in data)) {
      return
    }

    const curTimestamp = +new Date()

    if (data.type === 'mur.h') {
      // TODO //

      const blocks = data.blockId

      for (const key in blocks) {
        workspace.highlightBlock(key, blocks[key])
      }

      return
    }

    if (data.type === 'context') {
      const ctx = data.context

      const paramsContext = {
        direct_power: ctx.motor_powers,
        direct_mode: 0b00001111, // TODO
        axes_speed: ctx.motor_axes,
        axes_regulators: ctx.regulators,
        target_yaw: null, // TODO
        actuator_power: ctx.actuators
      }

      // TODO: fill context correctly in inpertreter and don't fill it here

      mur.context = paramsContext // TODO: move context to global scope?
      mur.controlContext(paramsContext)
    }

    if (data.type === 'state') {
      if (data.state === 'done') {
        console.log('script done')
        workspace.highlightBlock(null)
        // this.workspace.highlightBlock(null)
      }
    }

    // e = null
  },
}
