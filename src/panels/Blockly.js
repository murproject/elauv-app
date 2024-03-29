
import * as Blockly from 'blockly/core';
import * as Ru from 'blockly/msg/ru';

import * as Backpack from '/src/blockly-wrapper/workspace-backpack/src';
import '/src/blockly-wrapper/BlocklyStyle';
import MurToolbox from '/src/blockly-wrapper/Toolbox';

import mur from '/src/vehicle/api';
import App from '/src/App.js';
import ProjectsStorage from '/src/utils/ProjectsStorage';
import Panel from '/src/panels/Panel';
import Button from '/src/components/Button';

const blocklyConfig = {
  grid: {
    spacing: 26,
    length: 2,
    colour: '#ccc',
    snap: true,
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
    wheel: true,
  },
  scrollbars: true,
  media: 'blockly-media/',
  trashcan: true,
  renderer: 'custom_renderer',
  horizontalLayout: true,
  collapse: false,
  toolbox: MurToolbox,
};

export default class BlocklyPanel extends Panel {
  onActiveChanged() {
    if (this.toolButtons) {
      if (this.active) {
        this.toolButtons.classList.remove('hidden');
        App.bottomPanelSetHidden(this.scriptStatus !== 'running');
      } else {
        this.toolButtons.classList.add('hidden');
        if (this.workspace) {
          Blockly.hideChaff();
        }
      }
    }
  }

  init() {
    /* Panel init */

    this.setIcon('puzzle', 'blue-dark');
    this.noTitle = true;
    this.container.classList.add('background-white');
    this.container.classList.add('round-top');

    this.toolButtons = document.createElement('div');
    this.toolButtons.classList.add('buttons-group');
    this.toolButtons.id = 'buttons-blockly';
    document.querySelector('#head').appendChild(this.toolButtons);

    this.onActiveChanged();
    this.makeActionButtons();

    /* Blockly */

    this.workspace = null;
    this.scriptWorker = null;

    Blockly.setLocale(Ru);
    Blockly.JavaScript.addReservedWords('mur');
    Blockly.JavaScript.addReservedWords('_threadId');
    Blockly.ContextMenuRegistry.registry.unregister('blockHelp');

    this.blocklyDiv = document.createElement('div');
    this.blocklyDiv.id = 'blocklyDiv';
    this.container.appendChild(this.blocklyDiv);

    this.stateOfUndo = {
      undo: undefined,
      redo: undefined,
      savedUndoStack: [],
      savedRedoStack: [],
    };

    this.reinject(false);
    this.onWorkspaceChange();
    this.setInterval(this.autoSave, 500);

    /* Cursor */

    this.executionCursors = {}; // one cursor per thread in user script
    this.scriptStatus = 'stopped';
  }

  makeActionButtons() {
    this.actionButtons = {};

    const actions = [
      {spacer: true},
      {func: this.undo, name: 'undo', icon: 'undo'},
      {func: this.redo, name: 'redo', icon: 'redo'},
      {spacer: true},
      {func: this.run, name: 'run', icon: 'play'},
      {func: this.save, name: 'save', icon: 'content-save'},
    ];

    actions.forEach((action) => {
      let actionButton = null;

      if (!('spacer' in action && action.spacer == true)) {
        actionButton = new Button({
          name: action.name,
          text: '',
          type: 'panel-button',
          action: () => this[action.func.name](),
          icon: action.icon,
          iconColor: 'blue-dark',
          iconClasses: 'big',
          enabled: true,
          timeout: 25,
        });
      } else {
        actionButton = new Button({
          name: 'spacer',
          text: '',
          type: 'panel-spacer',
        });
      }

      actionButton.inject(this.toolButtons);
      this.actionButtons[action.name] = actionButton;
    });
  }

  setLoading(isLoading, timeout) {
    App.setLoading(isLoading, timeout);
  }

  onWorkspaceChange(event) {
    if (event) {
      if (event.type === 'backpack_change') {
        ProjectsStorage.setBackpack(this.backpack.getContents());
        return;
      }

      if (event.type === 'backpack_open') {
        const hideNotification = !(this.backpack.isOpen() && this.backpack.getCount() === 0);
        this.backpackEmptyNotify.classList.toggle('hidden', hideNotification);
      }

      if (event.type === 'viewport_change') {
        return;
      }

      if (event.type === 'finished_loading') {
        ProjectsStorage.projects.current.autosaved = true;
        this.lastEditTime = Date.now();
      }
    }

    const delta = (Date.now() - this.lastEditTime);

    if (this.scriptStatus === 'stopped' && (delta > 500)) {
      ProjectsStorage.projects.current.autosaved = false;
      this.lastEditTime = Date.now();
    }

    this.checkUndoRedo();
    this.updatePuzzleIcon();
  }

  checkUndoRedo(force = undefined) {
    if (force === true || this.scriptStatus !== 'stopped') {
      this.stateOfUndo.undo = false;
      this.stateOfUndo.redo = false;
      this.actionButtons.undo.setEnabled(false);
      this.actionButtons.redo.setEnabled(false);
      return;
    }

    if (force === false) {
      this.stateOfUndo.undo = undefined;
      this.stateOfUndo.redo = undefined;
    }

    const newStateUndo = this.workspace.getUndoStack().length > 0;
    const newStateRedo = this.workspace.getRedoStack().length > 0;
    const currentlyTouched = (newStateUndo || newStateRedo);

    if (this.scriptStatus !== 'running') {
      if (this.wasTouched !== currentlyTouched) {
        this.wasTouched = currentlyTouched;
      }
    } else {
      this.wasTouched = undefined;
    }

    if (this.stateOfUndo.undo !== newStateUndo) {
      this.stateOfUndo.undo = newStateUndo;
      this.actionButtons.undo.setEnabled(newStateUndo);
    }

    if (this.stateOfUndo.redo !== newStateRedo) {
      this.stateOfUndo.redo = newStateRedo;
      this.actionButtons.redo.setEnabled(newStateRedo);
    }
  }

  undo() {
    this.workspace.undo(false);
  }

  redo() {
    this.workspace.undo(true);
  }

  updatePuzzleIcon(forced = false) {
    if (this.scriptStatus === 'stopped') {
      const autosavedLongAgo = (Date.now() - ProjectsStorage.projects.autosaved.date) > 2000;
      const autosaved = ProjectsStorage.projects.current.autosaved;

      const newPuzzleIcon = this.wasTouched && !autosaved ? 'puzzle-edit' :
                            autosaved && !autosavedLongAgo ? 'puzzle-check' : 'puzzle';

      if (this.currentPuzzleIcon !== newPuzzleIcon || forced) {
        this.setIcon(newPuzzleIcon, 'blue-dark');
      }

      this.currentPuzzleIcon = newPuzzleIcon;
    }
  }

  generateCode(workspace) {
    Blockly.JavaScript.STATEMENT_PREFIX = 'await mur.h(_threadId, %1);\n';
    return Blockly.JavaScript.workspaceToCode(workspace);
  }

  run() {
    if (this.scriptStatus == 'running') {
      this.setLoading(true, 0);
      setTimeout(() => this.stop(), 100);
    } else if (this.scriptStatus == 'stopped') {
      this.setLoading(true, 0);
      this.autoSave(true);
      setTimeout(() => this.runScript(), 100);
    }

    App.bottomPanelSetHidden(false);
  }

  stop() {
    if (this.scriptStatus !== 'running') {
      return;
    }

    this.scriptStatus = 'stopping';
    this.actionButtons.run.setIcon('play', 'blue-dark', 'big');
    App.bottomPanelSetHidden(true);
    App.panels.console.clear();

    if (this.scriptWorker) {
      this.scriptWorker.terminate();
    }

    this.resetContext(0);

    let ledPower = 50;

    if (this.fadeoffTimer) {
      clearInterval(this.fadeoffTimer);
    }

    this.fadeoffTimer = setInterval(() => {
      this.resetContext(ledPower);
      if (ledPower <= 0) {
        clearInterval(this.fadeoffTimer);
      } else {
        ledPower -= 10;
      }
    }, 100);

    this.workspace.highlightBlock(null);
    this.reinject(false);
    this.setLoading(false, 150);

    setTimeout(() => {
      this.scriptStatus = 'stopped';
      this.updatePuzzleIcon(true);
      this.checkUndoRedo(false);
    }, 250);
  }

  autoSave(forced = false) {
    const timeFromLastEdit = (Date.now() - this.lastEditTime);

    if ((!ProjectsStorage.projects.current.autosaved && timeFromLastEdit > 3000) || forced) {
      const savedBlocks = Blockly.serialization.workspaces.save(this.workspace);
      ProjectsStorage.projects.current.data = JSON.stringify(savedBlocks);
      ProjectsStorage.autoSave();
    }

    this.updatePuzzleIcon();
  }

  getCode() {
    return JSON.stringify(Blockly.serialization.workspaces.save(this.workspace));
  }

  save(forcedNew = false) {
    const savedBlocks = Blockly.serialization.workspaces.save(this.workspace);
    ProjectsStorage.projects.current.data = JSON.stringify(savedBlocks);
    ProjectsStorage.saveProject(forcedNew);
  }

  load(blocksToLoad = undefined) {
    this.wasTouched = false;
    this.lastEditTime = Date.now();

    if (this.scriptStatus !== 'stopped') {
      this.stop();
    }

    this.stateOfUndo.savedUndoStack = [];
    this.stateOfUndo.savedRedoStack = [];
    this.reinject(false);

    if (typeof(blocksToLoad) === 'string') {
      blocksToLoad = JSON.parse(blocksToLoad);
    }

    if (blocksToLoad) {
      Blockly.serialization.workspaces.load(blocksToLoad, this.workspace);
    }

    this.workspace.clearUndo();
    this.onWorkspaceChange();
    this.autoZoom();

    setTimeout(() => this.workspace.trashcan.emptyContents(), 500);

    this.setLoading(false, 0);
  }

  resetContext(ledsPower = 0) {
    const l = Math.max(ledsPower, 0);
    const contextParams = {
      direct_power: [0, 0, 0, 0],
      direct_mode: 0b00001111,
      axes_speed: [0, 0, 0, 0],
      axes_regulators: 0,
      target_yaw: 0,
      actuator_power: [0, 0],
      leds: [l, l, l, l, l, l, l, l, l, l, l, l],
    };

    mur.controlContext(contextParams);
  }

  runScript() {
    if (this.scriptStatus !== 'stopped') {
      return;
    }

    try {
      this.executeScript();
    } catch (err) {
      console.error('Failed to run user script!');
      console.error(err);
      this.scriptStatus = 'running';
      this.stop();
    }
  }

  executeScript() {
    this.scriptStatus = 'preparing';

    this.setIcon('cog', 'blue-dark anim-spin');
    this.actionButtons.run.setIcon('stop', 'blue-dark', 'big');

    mur.controlImuResetYaw();
    setTimeout(() => this.resetContext(0), 0);
    setTimeout(() => this.resetContext(50), 150);
    setTimeout(() => this.resetContext(0), 450);

    this.code = this.generateCode(this.workspace);

    this.reinject(true);

    if (this.scriptWorker != null) {
      this.scriptWorker.terminate();
    }

    this.scriptWorker = new Worker('js/interpreter.js', {type: 'module'});
    this.scriptWorker.onmessage = (e) => this.workerMsgHandler(e);

    const json = Blockly.serialization.workspaces.save(this.workspace);

    if (!json.blocks) {
      this.scriptStatus = 'running';
      this.stop();
      return;
    }

    const blocks = json.blocks.blocks;
    const topBlocks = blocks.slice(); // Create shallow copy.
    blocks.length = 0;

    // Load each block structure into the headless workspace individually and generate code.
    const allCode = [];
    this.allRootBlocks = [];
    const headless = new Blockly.Workspace();

    topBlocks.forEach((block) => {
      this.allRootBlocks.push(block);
      Blockly.serialization.workspaces.load(json, headless);
      allCode.push(this.generateCode(headless));
    });

    this.executionCursors = {};

    function makeCursorHtml(id) {
      return /*html*/`
        <g id="execution-cursor-${id}" style="display: block;" opacity="0%">
          <image xlink:href="mdi/arrow-cursor-execution.svg" width="42" height="42"/>
        </g>
      `;
    }

    for (const blockNum in this.allRootBlocks) {
      const key = this.allRootBlocks[blockNum].id;
      if (!(key in this.executionCursors)) {
        document.querySelector('.blocklyBlockCanvas').innerHTML += makeCursorHtml(blockNum);
      }
    }

    document.querySelector('.blocklyBlockCanvas').innerHTML += makeCursorHtml('glob');

    for (const blockNum in this.allRootBlocks) { // need to query elements again after altering .blocklyBlockCanvas!
      const block = this.allRootBlocks[blockNum];
      this.executionCursors[block.id] = document.querySelector(`#execution-cursor-${blockNum}`);
    }

    this.executionCursors['-1'] = document.querySelector(`#execution-cursor-glob`);

    const threadsDict = {};
    const threadsList = [];

    for (const blockNum in this.allRootBlocks) {
      const block = this.allRootBlocks[blockNum];
      const index = Number(blockNum);

      threadsDict[block.id] = index;
      threadsList[index] = block.id;
    }

    this.scriptWorker.postMessage({
      type: 'telemetry',
      telemetry: JSON.parse(JSON.stringify(mur.telemetry)),
    });

    this.setLoading(false, 100);

    setTimeout(() => {
      mur.controlImuResetYaw();
      this.scriptStatus = 'running';
      this.updateTelemetry(mur.telemetry);
      this.scriptWorker.postMessage({
        type: 'run',
        script: this.code,
        threads: threadsList,
      });
    }, 750);
  }

  updateTelemetry(telemetry) {
    if (this.scriptStatus === 'running') {
      this.scriptWorker.postMessage({
        type: 'telemetry',
        telemetry: JSON.parse(JSON.stringify(telemetry)),
      });
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

  reinject(readonly = false) {
    this.lastEditTime = Date.now();

    this.executionCursors = {};

    if (this.workspace) {
      this.workspaceBlocks = Blockly.serialization.workspaces.save(this.workspace);
      this.workspace.dispose();
    }

    if (readonly) {
      this.stateOfUndo.savedUndoStack = this.workspace.getUndoStack();
      this.stateOfUndo.savedRedoStack = this.workspace.getRedoStack();
    }

    blocklyConfig.readOnly = readonly;
    blocklyConfig.zoom.controls = !readonly;
    blocklyConfig.zoom.wheel = !readonly;
    blocklyConfig.zoom.pinch = !readonly;
    blocklyConfig.grid.colour = readonly ? '#fff' : '#ccc';
    blocklyConfig.move.drag = !readonly;
    blocklyConfig.move.wheel = !readonly;

    this.workspace = Blockly.inject(this.blocklyDiv, blocklyConfig);
    Blockly.svgResize(this.workspace);

    if (this.workspaceBlocks) {
      Blockly.serialization.workspaces.load(this.workspaceBlocks, this.workspace);
    }

    this.autoZoom();

    function setBlocklyScrollbars(show) {
      document.querySelectorAll('.blocklyMainWorkspaceScrollbar').forEach((el) => el.classList.toggle('hidden', !show));
    }

    setBlocklyScrollbars(!readonly);

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

    this.workspace.addChangeListener((event) => {
      this.onWorkspaceChange(event);
    });

    if (!readonly) {
      this.initBackpack();
    }
  }

  initBackpack() {
    this.backpack = new Backpack.Backpack(this.workspace);

    this.backpack.shouldPreventMove = () => false;

    this.backpack.onDropOriginal = this.backpack.onDrop;
    this.backpack.onDrop = (block) => {
      this.backpack.onDropOriginal(block);

      setTimeout(() => {
        const undoStack = this.workspace.getUndoStack();
        if (undoStack.length > 0 && undoStack[undoStack.length - 1].type != 'create') {
          this.workspace.undo();
        } else {
          const blockSize = block.getHeightWidth();
          block.moveBy(-blockSize.width, 0);
        }
      }, 150);

      const backpackEl = document.getElementsByClassName('blocklyBackpack')[0];
      setTimeout(() => backpackEl.classList.add('bounce-once'), 200);
      setTimeout(() => backpackEl.classList.remove('bounce-once'), 1000);
    };

    this.backpackEmptyNotify = document.createElement('div');
    this.backpackEmptyNotify.classList.add('backpack-empty-notify');
    this.backpackEmptyNotify.classList.add('hidden');
    this.backpackEmptyNotify.innerHTML = /*html*/`
      Добавляйте блоки в <b>рюкзак</b>, чтобы потом<br>
      использовать их в других проектах!
    `;

    this.backpack.initFlyoutOriginal = this.backpack.initFlyout_;
    this.backpack.initFlyout_ = () => {
      this.backpack.initFlyoutOriginal();
      this.backpack.flyout_.svgGroup_.parentElement.appendChild(this.backpackEmptyNotify);
    };

    this.backpack.init();
    this.backpack.setContents(ProjectsStorage.projects.backpack);
  }

  workerMsgHandler(e) {
    const data = Object.assign({}, e.data);

    if (!('type' in data)) {
      return;
    }

    if (data.type === 'mur.h') {
      const blocks = data.blocks;

      for (const key in blocks) {
        if (key !== 'null') {
          const block = blocks[key];
          const blockId = block[0];
          const blockTime = block[1];

          if (!(key in this.executionCursors)) {
            console.error(`execution cursor with key ${key} doesn't exists!`);
            continue;
          }

          const blockElement = this.workspace.getBlockById(blockId);
          if (blockElement !== null) {
            const blockXY = blockElement.getRelativeToSurfaceXY();
            const x = blockXY.x - 14;
            const y = blockXY.y - 10;

            this.executionCursors[key].setAttribute('transform', `translate(${x},${y})`);
            this.executionCursors[key].setAttribute('opacity', `${blockTime}%`);
          } else {
            this.executionCursors[key].setAttribute('opacity', `0%`);
          }
        }
      }
      return;
    }

    if (data.type === 'context') {
      const ctx = data.context;

      const paramsContext = {
        direct_power: ctx.motor_powers,
        direct_mode: ctx.direct_mode,
        axes_speed: ctx.axes_speed,
        axes_regulators: ctx.regulators,
        target_yaw: ctx.target_yaw,
        actuator_power: ctx.actuators,
        leds: ctx.leds,
      };

      mur.controlContext(paramsContext);
    }

    if (data.type === 'state') {
      if (data.state === 'done') {
        console.log('script done');

        if (this.scriptWorker) {
          this.scriptWorker.terminate();
        }

        let counter = 0;

        if (this.fadeoffTimer) {
          clearInterval(this.fadeoffTimer);
        }

        this.fadeoffTimer = setInterval(() => {
          counter += 100;
          this.resetContext(0);

          if (counter >= 1800) {
            clearInterval(this.fadeoffTimer);
          }
        }, 100);

        setTimeout(() => this.stop(), 2000);
      }
    }

    if (data.type === 'thread_end') {
      this.executionCursors[data.id].children[0].setAttribute('xlink:href', 'mdi/arrow-cursor-execution-off.svg');
    }

    if (data.type === 'print') {
      App.panels.console.printMsg(data.msg);
    }
  }
}
