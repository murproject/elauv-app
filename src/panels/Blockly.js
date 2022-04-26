import Panel from './Panel'

const blocklyConfig = {
  grid: {
    spacing: 26,
    length: 2,
    colour: '#ccc',
    snap: true
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 2.0,
    minScale: 0.3,
    scaleSpeed: 1.15,
    pinch: true
  },
  // css: false,
  move: {
    drag: true,
    wheel: true
  },
  scrollbars: true,
  media: '/blockly-media/', // TODO!!!
  trashcan: true,
  // renderer: 'thrasos', // thrasos, zelos
  // renderer: 'zelos',
  renderer: 'custom_renderer',
  horizontalLayout: true,
  collapse: false,
  // toolbox: MurToolbox,
  // toolbox: document.getElementById('toolbox')
}

export default class Blockly extends Panel {

  begin() {
    this.html = /*html*/`
      <div id="blocklyDiv" class="pretty" style="height: 100%;"></div>
    `
  }


  init() {
    this.container.classList.add("fluid");
  }

}