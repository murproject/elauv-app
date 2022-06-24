import Panel from './Panel'

export default class Console extends Panel {

  begin() {
    this.isBottomPanel = true;

    this.html = /*html*/`
      <h1>Console</h1>
    `
  }

  init() {
    this.setIcon('../tooltip-text-outline');
  }
}