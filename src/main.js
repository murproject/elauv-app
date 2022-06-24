import mur from './vehicle/apiGameMur.js'

import AboutPanel from './panels/About.js'
import DevicesPanel from './panels/Devices.js';
import TelemetryPanel from './panels/Telemetry.js';
import JoystickPanel from './panels/Joystick.js';
import BlocklyPanel from './panels/Blockly.js';
import ProjectsPanel from './panels/Projects.js';
import ConsolePanel from './panels/Console.js'

const app = {

  html: /*html*/`
    <header id="head">
      <div class="buttons-group" id="buttons-main"></div>
    </header>
    <section id="main-panel-wrapper">
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

  panelSelect: function (target, mode = 'main') {
    const currentPanel =  mode === 'main' ? 'currentPanelMain' : 'currentPanelBottom';

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
    };

    this.panelSelect(this.panels.blockly);
  },


  init: function () {
    this.preloadIcons();

    this.container.innerHTML = this.html;
    this.createPanels();

    mur.create();

    mur.telemetryUpdated = (t, f) => {
      const prettyTelemetry = JSON.stringify(f, null, '\t');
      this.panels.telemetry.update(prettyTelemetry);
      this.panels.blockly.updateTelemetry(t);
    };

    this.timerKeepAlive = setInterval(() => {
      mur.controlInfo(); // TODO: use separate keepalive packet?
    }, 1500);

    mur.onStatusUpdated = (status) => {
      this.panels.telemetry.update()
    }
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


if (typeof cordova !== 'undefined') {
  document.addEventListener('deviceready', () => {
    window.cutout.has().then(hasCutout => {
      if (hasCutout) {
        // TODO: make it better?
        document.addEventListener("resume", triggerStatusbar, false);
        triggerStatusbar();
      }
    });

    main();
    setTimeout(() => window.IsekaiFakeSplash.hide(), 250);
  }, false)
} else {
  window.onload = () => main();
}


function triggerStatusbar() {
  setTimeout(() => {
    window.StatusBar.overlaysWebView(false);
    window.StatusBar.show();
    window.StatusBar.backgroundColorByHexString("FFF");
    window.StatusBar.styleDefault();
  }, 250);
}


function main() {
  document.app = app;
  document.app.init();
}