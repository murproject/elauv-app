import Panel from './Panel'

export default class Projects extends Panel {

  begin() {
    this.html = /*html*/`
      <h1>projects</h1>
    `
  }

  init() {
    this.setIcon('folder-open');
  }
}