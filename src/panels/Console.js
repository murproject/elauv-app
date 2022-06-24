import Panel from './Panel'

export default class Console extends Panel {

  begin() {
    this.isBottomPanel = true;

    this.html = /*html*/`
      <div id="variables-div" class="variables-div"></div>
    `
  }

  init() {
    // this.setIcon('../tooltip-text-outline');
    // this.setIcon('../tooltip-text-outline', 'cyan', `big pulse`);

    this.userData = {};
    this.variablesDiv = this.q("#variables-div");
    this.clear()
  }

  show(msg) {
    let log = "";

    for (const name in msg) {
      this.userData[name] = msg[name];
    }

    for (const name in this.userData) {
      let value = this.userData[name];
      value = value === true  ? 'Истина' :
              value === false ? 'Ложь' :
              value === undefined ? 'Неизвестно' :
              value;

      log += `${name}: ${value}\n`
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
  }

  clear() {
    this.userData = {};
    this.variablesDiv.innerText = '';
    this.notify(false);
  }

  notify(attention) {
    if (attention && !this.isNotifying) {
      this.isNotifying = true;
      this.setIcon('../tooltip-text-outline', 'cyan', `big pulse-once`);
      setTimeout(() => this.isNotifying = false, 1000);
    } else if (!attention){
      this.setIcon('../tooltip-text-outline', 'dark', `big`);
      this.isNotifying = false;
    }
  }


}