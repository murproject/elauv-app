/* Monkey-Patching */

import Blockly from 'blockly/core';

/* https://github.com/google/blockly/pull/6211 */
Blockly.blockRendering.InputRow.prototype.measure = function() {
    const InputConnection = Blockly.blockRendering.InputConnection;
    const ExternalValueInput = Blockly.blockRendering.ExternalValueInput;
    const StatementInput = Blockly.blockRendering.StatementInput;
    const Types = Blockly.blockRendering.Types;

    this.width = this.minWidth;
    this.height = this.minHeight;
    let connectedBlockWidths = 0;
    for (let i = 0; i < this.elements.length; i++) {
      const elem = this.elements[i];
      if (elem === undefined) {
        continue;
      }
      this.width += elem.width;
      if (Types.isInput(elem) && elem instanceof InputConnection) {
        if (Types.isStatementInput(elem) && elem instanceof StatementInput) {
          connectedBlockWidths += elem.connectedBlockWidth;
        } else if (
            Types.isExternalInput(elem) && elem instanceof ExternalValueInput &&
            elem.connectedBlockWidth !== 0) {
          connectedBlockWidths +=
              (elem.connectedBlockWidth - elem.connectionWidth);
        }
      }
      if (!(Types.isSpacer(elem))) {
        this.height = Math.max(this.height, elem.height);
      }
    }
    this.connectedBlockWidths = connectedBlockWidths;
    this.widthWithConnectedBlocks = this.width + connectedBlockWidths;
  };
