/* Monkey-Patching */

import Blockly from 'blockly/core';
import 'blockly/javascript';

document.b = Blockly

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



// Blockly.JavaScript.init = function(workspace) {
//   // Call Blockly.Generator's init.
//   Object.getPrototypeOf(this).init.call(this);

//   if (!this.nameDB_) {
//     this.nameDB_ = new Blockly.Names(this.RESERVED_WORDS_);
//   } else {
//     this.nameDB_.reset();
//   }

//   this.nameDB_.setVariableMap(workspace.getVariableMap());
//   this.nameDB_.populateVariables(workspace);
//   this.nameDB_.populateProcedures(workspace);

//   const defvars = [];
//   // Add developer variables (not created or named by the user).
//   const devVarList = Blockly.Variables.allDeveloperVariables(workspace);
//   for (let i = 0; i < devVarList.length; i++) {
//     defvars.push(
//         this.nameDB_.getName(devVarList[i], Blockly.Names.DEVELOPER_VARIABLE));
//   }

//   // Add user variables, but only ones that are being used.
//   const variables = Blockly.Variables.allUsedVarModels(workspace);
//   for (let i = 0; i < variables.length; i++) {
//     defvars.push(this.nameDB_.getName(variables[i].getId(), Blockly.Names.VARIABLE));
//   }

//   // Declare all of the variables.
//   if (defvars.length) {
//     this.definitions_['variables'] = 'var ' + defvars.join(', ') + ';';
//   }
//   this.isInitialized = true;
// };


// Blockly.JavaScript.finish = function (code) {
//   // Convert the definitions dictionary into a list.
//   // const definitions = objectUtils.values(this.definitions_);
//   // // Call Blockly.Generator's finish.
//   // code = Object.getPrototypeOf(this).finish.call(this, code);
//   // this.isInitialized = false;

//   // this.nameDB_.reset();
//   // return definitions.join('\n\n') + '\n\n\n' + code;

//   return code;
// }



// Blockly.JavaScript['variables_get'] = function(block) {
//   // Variable getter.
//   const code = "mur.vars[" + Blockly.JavaScript.nameDB_.getName(block.getFieldValue('VAR'),
//   Blockly.Names.VARIABLE) + "]";
//   return [code, Blockly.JavaScript.ORDER_ATOMIC];
// };

// Blockly.JavaScript['variables_set'] = function(block) {
//   // Variable setter.
//   const argument0 = Blockly.JavaScript.valueToCode(
//                         block, 'VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
//   const varName = Blockly.JavaScript.nameDB_.getName(
//       block.getFieldValue('VAR'), Blockly.Names.VARIABLE);
//   return "mur.vars[" + varName + "]" + ' = ' + argument0 + ';\n';
// };