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

    <section id="global-dialog-wrapper" class="">
      <div class="global-dialog-wrapper-background"></div>
      <div id="global-dialog-wrapper-content"></div>
    </section>

    <section id="bottom-panel-wrapper" class="bottom-collapsed">
      <div id="bottom-panel-content"></div>
      <div class="buttons-group" id="buttons-bottom"></div>
    </section>
  `,

  container: document.querySelector('#app'),

  panels: {},
  currentPanelMain: null,
  currentPanelBottom: null,

  globalDialogActive: false,
  oldConnectionStatus: undefined,

  runsOnCordova: false,
  runsOnElectron: false,

  /* Platform utils */

  get isCordova() {
    return this.runsOnCordova;
  },

  get isElectron() {
    return this.runsOnElectron;
  },

  get isMobile() {
    return this.isCordova && !this.isElectron;
  },

  /* Generic setup */

  init: function() {
    SettingsStorage.load();
    this.container.innerHTML = this.html;
    this.setupWrappers();
    this.createPanels();
    mur.create();
    this.setupEvents();
    TelemetryUtils.start();
  },

  setupWrappers() {
    const wrappers = {
      'loadingWrapper': '#loading-wrapper',
      'feedbackWrapper': '#feedback-wrapper',
      'titleBar': '#main-titlebar-caption',
      'globalDialogWrapper': '#global-dialog-wrapper',
      'globalDialogWrapperContent': '#global-dialog-wrapper-content',
      'bottomPanelWrapper': '#bottom-panel-wrapper',
    };

    for (const [key, id] of Object.entries(wrappers)) {
      this[key] = document.querySelector(id);
    }
  },

  /* Panels */

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

  setupEvents() {
    mur.onTelemetryUpdated = (t, f) => {
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

      if (this.oldConnectionStatus != status) {
        this.oldConnectionStatus = status;

        if (status == 'open') {
          this.triggerBackgroundFeedback();
        }
      }
    };

    mur.onAllSettingsReceived = (settings) => {
      this.panels.settings.onSettingsReceived(settings);
    };

    mur.onDiagnosticLogReceived = (info) => {
      this.panels.settings.onDiagnosticLogReceived(info);
    };
  },

  panelSelect: function(target, mode = 'main') {
    const currentPanel = mode === 'main' ? 'currentPanelMain' : 'currentPanelBottom';

    if (this[currentPanel]) {
      this[currentPanel].setActive(false);
    }

    if (mode === 'bottom') {
      if (this[currentPanel] === target) {
        this[currentPanel] = null;
        this.bottomPanelSetCollapsed(true);
        return;
      } else {
        this.bottomPanelSetCollapsed(false);
      }
    } else {
      this.bottomPanelSetHidden(target !== this.panels.blockly);
    }

    this[currentPanel] = target;
    this[currentPanel].setActive(true);
  },

  setTitle: function(title) {
    this.titleBar.innerText = title;
  },

  bottomPanelSetCollapsed(collapsed = true) {
    this.bottomPanelWrapper.classList.toggle('bottom-collapsed', collapsed);
  },

  bottomPanelSetHidden(hidden = true) {
    this.bottomPanelWrapper.classList.toggle('hidden', hidden);
  },

  /* Background feedback (green pulse when connected) */

  triggerBackgroundFeedback(activate = true) {
    this.feedbackWrapper.classList.toggle('background-soft-green', activate);
    this.feedbackWrapper.classList.toggle('background-pulse', activate);

    if (activate) {
      setTimeout(() => this.triggerBackgroundFeedback(false), 2500);
    }
  },

  /* Global dialog (blocks generic UI) */

  showGlobalDialog(dialog) {
    if (!this.globalDialogActive) {
      this.globalDialogActive = true;
      this.globalDialogWrapper.classList.add('active');
      setTimeout(() => this.globalDialogWrapperContent.appendChild(dialog), 80);
    } else {
      console.warn('GlobalDialog is already active!');
    }
  },

  closeGlobalDialog() {
    this.globalDialogActive = false;
    this.globalDialogWrapper.classList.remove('active');
    this.globalDialogWrapperContent.innerText = '';
  },

  /* Loading mode (blocks UI and shows visual feedback) */

  setLoading(isLoading, timeout) {
    setTimeout(() => {
      this.loadingWrapper.classList.toggle('active', isLoading);
    }, timeout);
  },
};
