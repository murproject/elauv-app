import * as Blockly from 'blockly/core'
import * as Ru from 'blockly/msg/ru'

import 'blockly/blocks';
import 'blockly/javascript';
// import Blockly from 'blockly/javascript'

import MurToolbox from './Toolbox'
import Blocks from './Blocks'
import './BlocklyStyle'

export default {
  start: function () {
    console.log("startin")
    Blocks.init();
    Blockly.setLocale(Ru)
    var blocklyArea = document.getElementById('blocklyArea');
    var blocklyDiv = document.getElementById('blocklyDiv');
    console.log(Blockly);
    console.log(blocklyDiv);
    var demoWorkspace = Blockly.inject(blocklyDiv,
      {
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
          scaleSpeed: 1.5,
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
        toolbox: MurToolbox,
        // toolbox: document.getElementById('toolbox')
      }
    );
    Blockly.svgResize(demoWorkspace);
  }
}
