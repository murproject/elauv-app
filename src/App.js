import mur from './vehicle/apiGameMur.js'

import AboutPanel from './panels/About.js'
import DevicesPanel from './panels/Devices.js';
import TelemetryPanel from './panels/Telemetry.js';
import JoystickPanel from './panels/Joystick.js';
import BlocklyPanel from './panels/Blockly.js';
import ProjectsPanel from './panels/Projects.js';
import ConsolePanel from './panels/Console.js'

export default {
  // TODO: integrate loading wrapper into PANEL, not main!

  html: /*html*/`
    <header id="head">
      <div class="buttons-group" id="buttons-main"></div>

      <div class="buttons-group" id="telemetry-feedback-box"></div>

      <div class="buttons-group header-titlebar" id="">
        <div class="header-titlebar-caption">
          <span id="main-titlebar-caption"></span>
        </div>
      </div>

    </header>

    <section id="main-panel-wrapper">
      <div id="loading-wrapper" class="loading-wrapper"></div>
    </section>

    <section id="global-wrapper" class="">
      <div class="global-wrapper-background"></div>
      <div id="global-wrapper-content"></div>
    </section>

    <div id="flying-panel-wrapper" class="bottom-collapsed">
      <div id="bottom-panel-wrapper"></div>
      <div class="buttons-group" id="buttons-bottom"></div>
    </div>
  `,

  container: document.querySelector("#app"),
  panels: {},
  currentPanelMain: null,
  currentPanelBottom: null,
  mur: mur,
  isCordova: false,

  panelSelect: function (target, mode = 'main') {
    const currentPanel = mode === 'main' ? 'currentPanelMain' : 'currentPanelBottom';

    if (this[currentPanel]) {
      this[currentPanel].setActive(false);
    }

    if (mode === 'bottom') {
      if (this[currentPanel] === target) {
        // TODO: don't query on each call, to it better
        this[currentPanel] = null;
        document.querySelector('#flying-panel-wrapper').classList.add("bottom-collapsed");
        return;
      } else {
        document.querySelector('#flying-panel-wrapper').classList.remove("bottom-collapsed");
      }
    } else {
      if (target === this.panels.blockly) {
        document.querySelector('#flying-panel-wrapper').classList.remove("hidden");
      } else {
        document.querySelector('#flying-panel-wrapper').classList.add("hidden");
      }
    }

    this[currentPanel] = target;
    this[currentPanel].setActive(true);
  },


  createPanels: function () {
    if (this.panels.length > 0) {
      return;
    }

    this.panels = {
      /* Main panels */
      about: new AboutPanel(),
      devices: new DevicesPanel(),
      telemetry: new TelemetryPanel(),
      joystick: new JoystickPanel(),
      projects: new ProjectsPanel(),
      blockly: new BlocklyPanel(),

      /* Bottom panels */
      console: new ConsolePanel(),
      // vizauv: new VizAuvPanel(),
    };

    this.panelSelect(this.panels.joystick);
  },

  setTitle: function (title) {
    this.titleBar.innerText = title;
  },

  init: function () {
    this.preloadIcons();

    this.container.innerHTML = this.html;

    this.loadingWrapper = document.querySelector('#loading-wrapper');
    this.titleBar = document.querySelector('#main-titlebar-caption');

    this.createPanels();

    mur.create();

    mur.telemetryUpdated = (t, f) => {
      const prettyTelemetry = JSON.stringify(f, null, '  ');
      this.panels.telemetry.update(prettyTelemetry);
      this.panels.blockly.updateTelemetry(t);
    };

    this.timerKeepAlive = setInterval(() => {
      mur.controlPing(); // TODO: use separate keepalive packet?
    }, 1500);

    mur.onStatusUpdated = (status) => {
      this.panels.telemetry.update()
    }
  },

  showGlobalDialog(dialog) {
    // TODO: dont'query each time
    document.querySelector('#global-wrapper').classList.add('active');
    setTimeout(() => document.querySelector('#global-wrapper-content').appendChild(dialog), 80);
  },

  closeGlobalDialog() {
    document.querySelector('#global-wrapper').classList.remove('active');
    document.querySelector('#global-wrapper-content').innerText = '';
  },

  setLoading(isLoading, timeout) {
    setTimeout(() => {
      if (isLoading) {
        this.loadingWrapper.classList.add('active')
      } else {
        this.loadingWrapper.classList.remove('active');
      }
    }, timeout);
  },

  preloadIcons() {
    // TODO
    const preloadList = [
      'ui/content-save',
      'ui/checkbox-marked-outline',
      'ui/stop',
      'ui/play'
    ]

    preloadList.forEach(item => {
      var link = document.createElement('link');
      link.rel = 'preload';
      link.type = 'image/svg+xml';
      link.as = 'image';
      link.href = '/mdi/' + item + '.svg';
      document.head.appendChild(link);
    });
  }
}
