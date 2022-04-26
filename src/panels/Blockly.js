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

    this.toolButtons = document.createElement("div");
    this.toolButtons.classList.add("buttons-group");
    this.toolButtons.id = "buttons-blockly";
    document.querySelector("#head").appendChild(this.toolButtons);

    const actions = [
      { name: 'run_lua', func: this.run_lua },
      { name: 'run_js', func: this.run_js },
      { name: 'stop', func: this.stop },
      { name: 'example', func: this.example },
      { name: 'load', func: this.load },
      { name: 'save', func: this.save },
    ]

    actions.forEach(action => {
      const actionButton = document.createElement("div");
      actionButton.classList.add("panel-button");
      actionButton.onclick = () => action.func();
      actionButton.innerText = action.name;
      this.toolButtons.appendChild(actionButton);
    });
  }

  load() {
    console.log("load");
  }

}