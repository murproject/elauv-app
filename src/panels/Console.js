import App from '/src/App.js';
import Panel from './Panel';
import Icon from '../components/Icon';

export default class Console extends Panel {
  begin() {
    this.isBottomPanel = true;

    this.html = /*html*/`
      <div id="console-welcome">
        <p>
          Здесь будут сообщения!
        </p>
        <p>
          Отправляйте их в консоль<br>
          с помощью блока ${Icon('../tooltip-text-outline')}
        </p>
      </div>
      <div id="variables-div" class="variables-div"></div>
    `;
  }

  init() {
    // this.setIcon('../tooltip-text-outline');
    // this.setIcon('../tooltip-text-outline', 'cyan', `big pulse`);

    this.userData = {};
    this.variablesDiv = this.q('#variables-div');
    this.welcomeDiv = this.q('#console-welcome');
    this.clear();
  }

  show(msg) {
    this.welcomeDiv.classList.add('hidden');
    let log = '';

    for (const name in msg) {
      this.userData[name] = msg[name];
    }

    for (const name in this.userData) {
      let value = this.userData[name];
      value = value === true ? 'Истина' :
              value === false ? 'Ложь' :
              value === undefined ? 'Не задано' :
              value;

      log += `${name}: ${value}\n`;
    }

    this.variablesDiv.innerText = log;

    if (!this.active) {
      this.notify(true);
    }
  }

  onActiveChanged(isActive) {
    if (isActive) {
      this.notify(false);
    }
    // if ('blockly' in App.panels) {
    //   App.panels.blockly.collapse(isActive);
    // }
  }

  clear() {
    this.userData = {};
    this.variablesDiv.innerText = '';
    this.notify(false);
    this.welcomeDiv.classList.remove('hidden');
  }

  notify(attention) {
    if (attention && !this.isNotifying) {
      this.isNotifying = true;
      this.setIcon('../tooltip-text-outline', 'cyan', `big pulse-once`);
      setTimeout(() => this.isNotifying = false, 1000);
    } else if (!attention) {
      this.setIcon('../tooltip-text-outline', 'dark', `big`);
      this.isNotifying = false;
    }
  }
}
