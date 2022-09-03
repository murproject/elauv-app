import mur from './vehicle/api.js';

import AboutPanel from './panels/About.js';
import DevicesPanel from './panels/Devices.js';
import JoystickPanel from './panels/Joystick.js';
import BlocklyPanel from './panels/Blockly.js';
import ProjectsPanel from './panels/Projects.js';
import ConsolePanel from './panels/Console.js';
import SettingsPanel from './panels/Settings.js';
import SettingsStorage from './utils/SettingsStorage.js';
import TelemetryUtils from './utils/TelemetryUtils.js';

export default {
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
      <div id="feedback-wrapper" class=""></div>
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

  container: document.querySelector('#app'),

  panels: {},
  currentPanelMain: null,
  currentPanelBottom: null,

  globalDialogActive: false,
  oldConnStatus: undefined,

  runsOnCordova: false,
  runsOnElectron: false,

  get isCordova() {
    return this.runsOnCordova;
  },

  get isElectron() {
    return this.runsOnElectron;
  },

  get isMobile() {
    return this.isCordova && !this.isElectron;
  },

  panelSelect: function(target, mode = 'main') {
    const currentPanel = mode === 'main' ? 'currentPanelMain' : 'currentPanelBottom';

    if (this[currentPanel]) {
      this[currentPanel].setActive(false);
    }

    if (mode === 'bottom') {
      if (this[currentPanel] === target) {
        // TODO: don't query on each call, should to it better. use classList.toggle
        this[currentPanel] = null;
        document.querySelector('#flying-panel-wrapper').classList.add('bottom-collapsed');
        return;
      } else {
        document.querySelector('#flying-panel-wrapper').classList.remove('bottom-collapsed');
      }
    } else {
      if (target === this.panels.blockly) {
        document.querySelector('#flying-panel-wrapper').classList.remove('hidden');
      } else {
        document.querySelector('#flying-panel-wrapper').classList.add('hidden');
      }
    }

    this[currentPanel] = target;
    this[currentPanel].setActive(true);
  },


  createPanels: function() {
    if (this.panels.length > 0) {
      return;
    }

    this.panels = {
      /* Main panels */
      about: new AboutPanel(),
      settings: new SettingsPanel(),
      devices: new DevicesPanel(),
      joystick: new JoystickPanel(),
      projects: new ProjectsPanel(),
      blockly: new BlocklyPanel(),

      /* Bottom panels */
      console: new ConsolePanel(),
    };

    this.panelSelect(this.isMobile ? this.panels.devices : this.panels.projects);
  },

  setTitle: function(title) {
    this.titleBar.innerText = title;
  },

  init: function() {
    SettingsStorage.load();

    // this.preloadIcons();

    this.container.innerHTML = this.html;

    this.loadingWrapper = document.querySelector('#loading-wrapper');
    this.titleBar = document.querySelector('#main-titlebar-caption');

    this.createPanels();

    mur.create();

    mur.onTelemetryUpdated = (t, f) => {
      // TOOD: move to TelemetryUtils?
      const prettyTelemetry = JSON.stringify(f, null, '  ');
      TelemetryUtils.update(prettyTelemetry);
      this.panels.blockly.updateTelemetry(t);
      this.panels.devices.updateTelemetry(t);
    };

    this.timerKeepAlive = setInterval(() => {
      mur.controlPing();
    }, 1000);

    mur.onStatusUpdated = (status) => {
      TelemetryUtils.update();
      this.panels.devices.onStatusUpdated(status);

      if (this.oldStatus == status) {
        return;
      }

      this.oldStatus = status;

      const fw = document.querySelector('#feedback-wrapper');

      if (status == 'open') {
        fw.classList.add('background-soft-green');
        fw.classList.add('background-pulse');

        setTimeout(() => {
          fw.classList.remove('background-soft-green');
          fw.classList.remove('background-pulse');
        }, 2500);
      }
    };

    mur.onAllSettingsReceived = (settings) => {
      this.panels.settings.onSettingsReceived(settings);
    };

    mur.onDiagnosticLogReceived = (info) => {
      this.panels.settings.onDiagnosticLogReceived(info);
    };

    TelemetryUtils.start();
  },

  showGlobalDialog(dialog) {
    // TODO: dont'query each time
    if (!this.globalDialogActive) {
      this.globalDialogActive = true;
      document.querySelector('#global-wrapper').classList.add('active');
      setTimeout(() => document.querySelector('#global-wrapper-content').appendChild(dialog), 80);
    } else {
      console.warn('GlobalDialog is already active!');
    }
  },

  closeGlobalDialog() {
    this.globalDialogActive = false;
    document.querySelector('#global-wrapper').classList.remove('active');
    document.querySelector('#global-wrapper-content').innerText = '';
  },

  setLoading(isLoading, timeout) {
    setTimeout(() => {
      this.loadingWrapper.classList.toggle('active', isLoading);
    }, timeout);
  },

  // preloadIcons() {
  //   // TODO
  //   const preloadList = [
  //     'ui/content-save',
  //     'ui/checkbox-marked-outline',
  //     'ui/stop',
  //     'ui/play',
  //   ];

  //   preloadList.forEach((item) => {
  //     const link = document.createElement('link');
  //     link.rel = 'preload';
  //     link.type = 'image/svg+xml';
  //     link.as = 'image';
  //     link.href = 'mdi/' + item + '.svg';
  //     document.head.appendChild(link);
  //   });
  // },
};
