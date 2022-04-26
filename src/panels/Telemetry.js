import Panel from './Panel'
import mur from '../vehicle/apiGameMur.js'

export default class Telemetry extends Panel {

  begin() {
    this.html = /*html*/`
      <div id="telemetryText">Waiting for connection…</div>
    `
  }


  init() {
    this.textElement = this.q("#telemetryText");
  }


  update(telemetryText) {
    if (this.active) {
      this.textElement.innerText = telemetryText;
    }
  }

}