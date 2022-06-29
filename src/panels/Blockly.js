import Panel from './Panel'
import Button from '/src/components/Button';

import * as Blockly from 'blockly/core'
import * as Ru from 'blockly/msg/ru'

import 'blockly/blocks';
import 'blockly/javascript';
import BlocklyLua from 'blockly/lua'

import MurToolbox from '../blockly-wrapper/Toolbox'
import '../blockly-wrapper/BlocklyStyle'

import mur from '../vehicle/apiGameMur'


const blocklyConfig = {
  grid: {
    spacing: 26,
    length: 2,
    colour: '#ccc',
    snap: true
  },
  zoom: {
    controls: true,
    wheel: true,
    pinch: true,
    startScale: 1.0,
    maxScale: 2.0,
    minScale: 0.3,
    scaleSpeed: 1.15,
  },
  move: {
    drag: true,
    wheel: true
  },
  scrollbars: true,
  media: '/blockly-media/',
  trashcan: true,
  renderer: 'custom_renderer',
  horizontalLayout: true,
  collapse: false, // вкл/выкл пункт контекстного меню свернуть/развернуть блоки
  toolbox: MurToolbox,
}

export default class BlocklyPanel extends Panel {

  onActiveChanged() {
    if (this.toolButtons) {
      if (this.active) {
        this.toolButtons.classList.remove("hidden");

        if (this.scriptStatus == 'running') {
          document.querySelector('#flying-panel-wrapper').classList.remove("hidden"); // TODO //
        } else {
          document.querySelector('#flying-panel-wrapper').classList.add("hidden"); // TODO //
        }

      } else {
        this.toolButtons.classList.add("hidden");
      }
    }
  }


  init() {
    this.setIcon('puzzle');
    this.noTitle = true;
    this.container.classList.add('background-white');
    this.container.classList.add('round-top');

    // this.container.classList.add("fluid");

    this.toolButtons = document.createElement("div");
    this.toolButtons.classList.add("buttons-group");
    this.toolButtons.id = "buttons-blockly";
    document.querySelector("#head").appendChild(this.toolButtons);

    this.onActiveChanged();
    this.makeActionButtons();

    /* --- Blockly --- */

    this.workspace = null;
    this.scriptWorker = null;



    // TODO: move locale overrides?
    Ru["CLEAN_UP"] = "Упорядочить блоки";
    Ru["PROCEDURE_VARIABLE"] = "аргументом";
    Ru["MATH_RANDOM_INT_TITLE"] = "случайное число от %1 до %2";

    Ru["CONTROLS_REPEAT_INPUT_DO"] = "";
    Ru["CONTROLS_FOREACH_INPUT_DO"] = "";
    Ru["CONTROLS_FOR_INPUT_DO"] = "";
    Ru["CONTROLS_IF_MSG_THEN"] = "";
    Ru["CONTROLS_WHILEUNTIL_INPUT_DO"] = "";

    // Ru["CONTROLS_IF_MSG_IF"] = "?";
    // Ru["CONTROLS_IF_MSG_THEN"] = "✓";
    // Ru["CONTROLS_IF_MSG_ELSE"] = "×";
    // Ru["CONTROLS_IF_MSG_ELSEIF"] = "?";

    // Ru["PROCEDURES_BEFORE_PARAMS"] = "с";
    // Ru["PROCEDURES_CALL_BEFORE_PARAMS"] = "с";

    // Ru["COLOUR_RGB_RED"] = "R";
    // Ru["COLOUR_RGB_GREEN"] = "G";
    // Ru["COLOUR_RGB_BLUE"] = "B";
    Ru["MATH_SUBTRACTION_SYMBOL"] = "–";
    Blockly.setLocale(Ru)

    Blockly.JavaScript.addReservedWords('mur');

    // this.variablesDiv = document.createElement("div");
    // this.variablesDiv.id = "variables-div";
    // this.variablesDiv.classList.add("variables-div");
    // this.container.appendChild(this.variablesDiv);

    // this.userData = {}; // TODO //

    // this.loadingDiv = document.createElement("div");
    // this.loadingDiv.id = "loading-wrapper";
    // this.loadingDiv.classList.add("loading-wrapper");
    // this.container.appendChild(this.loadingDiv);

    this.blocklyDiv = document.createElement("div");
    this.blocklyDiv.id = "blocklyDiv";
    this.blocklyDiv.classList.add("pretty");
    this.container.appendChild(this.blocklyDiv);

    this.stateOfUndo = {
      undo: undefined,
      redo: undefined,
      savedUndoStack: [],
      savedRedoStack: [],
    }
    this.reinject(false);

    this.onWorkspaceChange();

    /* --- Cursor --- */

    this.executionCursors = {}; // one cursor per script thread

    this.scriptStatus = 'stopped';
  }

  collapse(collapsed) {
    if (collapsed) {
      this.blocklyDiv.classList.add('blockly-collapsed');
    } else {
      this.blocklyDiv.classList.remove('blockly-collapsed');
    }
  }

  makeActionButtons() {
    this.actionButtons = {};

    const actions = [
      { spacer: true },
      { func: this.undo,      name: 'undo',     icon: 'undo',},
      { func: this.redo,      name: 'redo',     icon: 'redo',},
      { spacer: true },
      { func: this.run,       name: 'run',      icon: 'play'},
      // { func: this.example,   name: 'example',  icon: 'star',},
      // { func: this.load,      name: 'load',     icon: 'file-upload',},
      { func: this.save,      name: 'save',     icon: 'content-save',},
    ];

    actions.forEach(action => {
      let actionButton = null;

      if (!('spacer' in action && action.spacer == true)) {
        actionButton = new Button({
          name: action.name,
          text: '',
          type: 'panel-button',
          action: () => this[action.func.name](),
          icon: action.icon,
          iconClasses: 'big',
          enabled: true,
          timeout: 25
        });
      } else {
        actionButton = new Button({
          name: 'spacer',
          text: '',
          type: 'panel-spacer'
        });
      }

      actionButton.inject(this.toolButtons);
      this.actionButtons[action.name] = actionButton;
    });
  }

  setLoading(isLoading, timeout) {
    document.app.setLoading(isLoading, timeout);
  }

  onWorkspaceChange() {
    this.checkUndoRedo();
  }

  checkUndoRedo(force = undefined) {
    if (force === true) {
      this.stateOfUndo.undo = false;
      this.stateOfUndo.redo = false;
      this.actionButtons.undo.setEnabled(false)
      this.actionButtons.redo.setEnabled(false)
      return;
    }

    if (force === false) {
      this.stateOfUndo.undo = undefined;
      this.stateOfUndo.redo = undefined;
    }

    const newStateUndo = this.workspace.getUndoStack().length > 0;
    const newStateRedo = this.workspace.getRedoStack().length > 0;

    if (this.stateOfUndo.undo !== newStateUndo) {
      this.stateOfUndo.undo = newStateUndo;
      this.actionButtons.undo.setEnabled(newStateUndo)
    }

    if (this.stateOfUndo.redo !== newStateRedo) {
      this.stateOfUndo.redo = newStateRedo;
      this.actionButtons.redo.setEnabled(newStateRedo)
    }
  }

  undo() {
    // TODO: remove debug feature
    // const undoStack = this.workspace.getUndoStack();
    // console.log("Undo stack:");
    // undoStack.forEach(item => console.log(item));
    this.workspace.undo(false);
  }

  redo() {
    this.workspace.undo(true);
  }

  generate_code(workspace) {
    Blockly.JavaScript.STATEMENT_PREFIX = 'await mur.h(_threadId, %1);\n'
    var code = Blockly.JavaScript.workspaceToCode(workspace)

    return code
  }

  run() {
    console.log("status = " + this.scriptStatus);
    if (this.scriptStatus == 'running') {
      this.setLoading(true, 0);
      setTimeout(() => this.stop(), 100);
    } else {
      this.setLoading(true, 0);
      setTimeout(() => this.run_js(), 100);
    }

    // TODO: better interaction with console
    document.querySelector('#flying-panel-wrapper').classList.remove("hidden"); // TODO //
  }

  stop() {
    this.collapse(false);
    document.querySelector('#flying-panel-wrapper').classList.add("hidden"); // TODO //
    this.setIcon('puzzle');
    this.actionButtons.run.setIcon('play', 'dark', 'big');
    this.scriptStatus = 'stopped'

    document.app.panels.console.clear();
    // this.userData = {};
    // this.variablesDiv.innerText = '';

    if (this.scriptWorker) {
      this.scriptWorker.terminate()
    }

    // TODO: make function to return empty context! (in mur)

    mur.controlScriptStop()
    const paramsContext = {
      direct_power: [0, 0, 0, 0],
      direct_mode: 0b00001111,
      axes_speed: [0, 0, 0, 0],
      axes_regulators: 0,
      target_yaw: null,
      actuator_power: [0, 0],
      leds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
    mur.context = paramsContext // TODO: move context to global scope?
    mur.controlContext(paramsContext)

    this.workspace.highlightBlock(null)
    this.reinject(false);
    this.setLoading(false, 100);
  }

  save() {
    const savedBlocks = Blockly.serialization.workspaces.save(this.workspace)
    console.log(savedBlocks)
    localStorage.savedBlocks = JSON.stringify(savedBlocks)
  }

  load(blocksToLoad = undefined) {
    this.stateOfUndo.savedUndoStack = [];
    this.stateOfUndo.savedRedoStack = [];

    console.log("load:")
    console.log(blocksToLoad)

    if (typeof(blocksToLoad) === 'undefined') {
      blocksToLoad = localStorage.savedBlocks;
    }

    if (typeof(blocksToLoad) === 'string') {
      blocksToLoad = JSON.parse(blocksToLoad);
    }

    if (blocksToLoad) {
      Blockly.serialization.workspaces.load(blocksToLoad, this.workspace)
    }

    this.workspace.clearUndo();
    this.onWorkspaceChange();
    this.autoZoom();

    this.setLoading(false, 0);
  }

  example() {
    console.log(this);
    Blockly.serialization.workspaces.load(example_code, this.workspace)
  }

  run_lua() {
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
  }

  run_js() {
    this.setIcon('cog', 'anim-spin');
    this.actionButtons.run.setIcon('stop', 'dark', 'big');

    this.scriptStatus = 'running'

    console.warn("workspaceToCode(workspace)")
    this.code = this.generate_code(this.workspace)
    console.log(this.code)
    // TODO: this.code is unused!

    // let userVariables = []
    // console.warn("USER VARIABLES:");
    // this.workspace.getAllVariableNames().forEach(item => {
    //   console.warn(`${item} : ${Blockly.Names.prototype.safeName_(item)}`);
    //   userVariables.push(Blockly.Names.prototype.safeName_(item));
    // })

    this.reinject(true);
    // checkUndoRedo(true);

    if (this.scriptWorker != null) {
      this.scriptWorker.terminate()
    }

    this.scriptWorker = new Worker('/js/interpreter.js', { type: 'module' })
    this.scriptWorker.onmessage = (e) => this.workerMsgHandler(e);

    var json = Blockly.serialization.workspaces.save(this.workspace)

    // Store top blocks separately, and remove them from the JSON.
    if (!json.blocks) {
      // TODO: emit stop?
      return
    }

    var blocks = json.blocks.blocks
    var topBlocks = blocks.slice() // Create shallow copy.
    blocks.length = 0

    // Load each block into the workspace individually and generate code.
    var allCode = []
    this.allRootBlocks = []
    // let variablesDeclaration = '/* MUR: User variables begin */\n\n'
    // userVariables.forEach(item => {
    //   variablesDeclaration += `var ${Blockly.Names.prototype.safeName_(item)};\n`;
    // })
    // variablesDeclaration += '\n/* End of user variables */\n\n';
    // allCode.push(variablesDeclaration);

    var headless = new Blockly.Workspace()

    topBlocks.forEach(block => {
      // blocks.push(block)
      this.allRootBlocks.push(block)
      Blockly.serialization.workspaces.load(json, headless)
      allCode.push(this.generate_code(headless))
      // blocks.length = 0
      console.warn("gen from block");
      console.log(block);
      console.log(`${block.type} - ${block.id}`);
    });

    console.log(this.allRootBlocks);

    this.executionCursors = {};

    function makeCursorHtml(id) {
      return `
      <g id="execution-cursor-${id}" style="display: block;" opacity="0%">
        <image xlink:href="/mdi/arrow-cursor-execution.svg" width="42" height="42"/>
      </g>`
    }

    for (const blockNum in this.allRootBlocks) {
    // this.allRootBlocks.forEach(block => {
      const key = this.allRootBlocks[blockNum].id
      if (!(key in this.executionCursors)) {
        document.querySelector(".blocklyBlockCanvas").innerHTML += makeCursorHtml(blockNum);
      }
    }

    document.querySelector(".blocklyBlockCanvas").innerHTML += makeCursorHtml('glob');

    for (const blockNum in this.allRootBlocks) { // need to query elements again after altering .blocklyBlockCanvas!
      const block = this.allRootBlocks[blockNum];
      this.executionCursors[block.id] = document.querySelector(`#execution-cursor-${blockNum}`);
      // TODO: each "parse HTML" takes ~50ms, entire action can take over ~500ms
      // TODO: fill executionCursors AFTER??
    }

    this.executionCursors["-1"] = document.querySelector(`#execution-cursor-glob`);

    // console.warn("EXECUTION CURSORS:");
    // console.log(this.executionCursors);

    let threadsDict = {};
    let threadsList = [];

    for (const blockNum in this.allRootBlocks) {
      const block = this.allRootBlocks[blockNum];
      const index = Number(blockNum);

      threadsDict[block.id] = index;
      threadsList[index] = block.id;
    }

    // console.warn("THREAD DICT")
    // console.log(threadsDict)
    // console.warn("THREAD LIST")
    // console.log(threadsList)

    this.scriptWorker.postMessage({ // TODO: copypasta
      type: 'telemetry',
      telemetry: JSON.parse(JSON.stringify(mur.telemetry))
    })

    this.setLoading(false, 100);

    setTimeout(() => {
      this.scriptWorker.postMessage({
        type: 'run',
        // scripts: allCode,
        scripts: [this.code], // TODO //
        threads: threadsList,
        // userVariables: userVariables,
      })
    }, 500);

    // this.loadingDiv.classList.remove('active');
  }

  updateTelemetry(telemetry) {
    if (this.scriptStatus === 'running') {
      this.scriptWorker.postMessage({
        type: 'telemetry',
        telemetry: JSON.parse(JSON.stringify(telemetry)) // TODO: should do it in better way
      })
    }
  }

  autoZoom() {
    this.workspace.zoomToFit();
    let doZoomOut = true;

    if (this.workspace.getScale() > 1) {
      this.workspace.setScale(1);
      this.workspace.scrollCenter();
      doZoomOut = false;
    }

    const metrics = this.workspace.getMetrics();
    const x = (metrics.viewWidth / 2) + metrics.absoluteLeft;
    const y = (metrics.viewHeight / 2) + metrics.absoluteTop;

    if (doZoomOut) {
      this.workspace.zoom(x, y, -0.15);
    }
  }

  // TODO: don't use reinjecting because of bad performance.
  /* TODO: block editing with alternative methods:
      - disable event handlers?
      - transparent overlay with 100% w/h on top of blockly panel
      - hide toolbox with css
  */

  reinject (readonly = false) {
    this.executionCursors = {};

    if (this.workspace) {
      this.workspaceBlocks = Blockly.serialization.workspaces.save(this.workspace)
      this.workspace.dispose()
    }

    if (readonly) {
      this.stateOfUndo.savedUndoStack = this.workspace.getUndoStack();
      this.stateOfUndo.savedRedoStack = this.workspace.getRedoStack();
    }

    // this.$refs.blocklyInstance.inject(readonly)
    blocklyConfig.readOnly = readonly;
    blocklyConfig.zoom.controls = !readonly;
    blocklyConfig.zoom.wheel = !readonly;
    blocklyConfig.zoom.pinch = !readonly;
    blocklyConfig.grid.colour = readonly ? "#fff" : "#ccc";

    blocklyConfig.move.drag = !readonly;
    blocklyConfig.move.wheel = !readonly;
    // blocklyConfig.scrollbars = !readonly;

    this.workspace = Blockly.inject(this.blocklyDiv, blocklyConfig);
    Blockly.svgResize(this.workspace);

    if (this.workspaceBlocks) {
      Blockly.serialization.workspaces.load(this.workspaceBlocks, this.workspace)
    }

    this.autoZoom()

    if (readonly) {
      document.querySelectorAll(".blocklyMainWorkspaceScrollbar").forEach(el => el.classList.add("hidden"));
    } else {
      document.querySelectorAll(".blocklyMainWorkspaceScrollbar").forEach(el => el.classList.remove("hidden"));
    }

    if (!readonly) {
      for (const key in this.stateOfUndo.savedUndoStack) {
        this.stateOfUndo.savedUndoStack[key].workspaceId = this.workspace.id;
      }

      for (const key in this.stateOfUndo.savedRedoStack) {
        this.stateOfUndo.savedRedoStack[key].workspaceId = this.workspace.id;
      }

      this.workspace.undoStack_ = this.stateOfUndo.savedUndoStack;
      this.workspace.redoStack_ = this.stateOfUndo.savedRedoStack;

      this.stateOfUndo.savedUndoStack = [];
      this.stateOfUndo.savedRedoStack = [];
    }

    this.workspace.addChangeListener(() => { this.onWorkspaceChange() });
    // this.checkUndoRedo(false);

    // TODO: CURSOR
  }

  workerMsgHandler(e) {
    const data = Object.assign({}, e.data)

    if (!('type' in data)) {
      return
    }

    if (data.type === 'mur.h') {
      const blocks = data.blocks

      for (const key in blocks) {
        if (key !== 'null') {
          const block = blocks[key];
          const blockId = block[0];
          const blockTime = block[1];

          if (!(key in this.executionCursors)) {
            console.error(`ERROR: execution cursor with key ${key} doesn't exists!`);
            continue;
          }

          const blockElement = this.workspace.getBlockById(blockId);
          if (blockElement !== null) {
            const blockXY = blockElement.getRelativeToSurfaceXY();
            const x = blockXY.x - 14;
            const y = blockXY.y - 10;

            this.executionCursors[key].setAttribute("transform", `translate(${x},${y})`);
            this.executionCursors[key].setAttribute("opacity", `${blockTime}%`);

            // console.log(`Setting cursor "${key}" with block "${blockId}", html-id: ${this.executionCursors[key].id}`);
          } else {
            this.executionCursors[key].setAttribute("opacity", `0%`);
            // console.log(`Setting cursor "${key}" as EMPTY`);
          }
        }

      }
      return;
    }

    if (data.type === 'context') {
      const ctx = data.context

      const paramsContext = {
        direct_power: ctx.motor_powers,
        direct_mode: 0b00001111, // TODO
        axes_speed: ctx.motor_axes,
        axes_regulators: ctx.regulators,
        target_yaw: null, // TODO
        actuator_power: ctx.actuators,
        leds: ctx.leds,
      }

      // TODO: fill context correctly in inpertreter and don't fill it here

      mur.context = paramsContext // TODO: move context to global scope?
      mur.controlContext(paramsContext)

      // document.app.panels.telemetry.updateStats("");
    }

    if (data.type === 'state') {
      // this.scriptStatus = data.state;
      // TODO: inform user on script stop?
      if (data.state === 'done') {
        console.log('script done')

        if (this.scriptWorker) {
          this.scriptWorker.terminate();
        }

        setTimeout(() => this.stop(), 2000);
        // this.workspace.highlightBlock(null) // TODO: ?
      }
    }

    if (data.type === 'thread_end') {
      // if (this.scriptWorker) {
      //   this.scriptWorker.terminate()
      // }
      // console.warn("thread end");
      // console.warn(data.id)
      this.executionCursors[data.id].children[0].setAttribute('xlink:href', '/mdi/arrow-cursor-execution-off.svg')
    }

    if (data.type === 'print') {
      document.app.panels.console.show(data.msg);
      // console.error("PRINT");
      // console.error(data.msg);
    }

    // e = null
  }

}