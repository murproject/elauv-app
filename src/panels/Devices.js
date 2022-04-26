import Panel from './Panel'

export default class Devices extends Panel {

  begin() {
    this.html = /*html*/`
      <div>
        Devices list:
        <ul>
            <li>a</li>
            <li>b</li>
        </ul>
      </div>
    `
  }


  init() {

  }

}