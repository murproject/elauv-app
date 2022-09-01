/* Monkey-Patching */

import Blockly from 'blockly/core';
import 'blockly/javascript';
import BlocklyDialog from './BlocklyDialog.js';
import * as Ru from 'blockly/msg/ru';

document.b = Blockly;

/* Fix prompt dialogs on Electron platform */

if (typeof cordova !== 'undefined' && cordova.platformId === 'electron') {
  BlocklyDialog.init();
}

/* Translations */

Ru['CLEAN_UP'] = 'Упорядочить блоки';
Ru['PROCEDURE_VARIABLE'] = 'аргументом';
Ru['MATH_RANDOM_INT_TITLE'] = 'случайное число от %1 до %2';

Ru['CONTROLS_REPEAT_INPUT_DO'] = '';
Ru['CONTROLS_FOREACH_INPUT_DO'] = '';
Ru['CONTROLS_FOR_INPUT_DO'] = '';
Ru['CONTROLS_IF_MSG_THEN'] = '';
Ru['CONTROLS_WHILEUNTIL_INPUT_DO'] = '';

Ru['MATH_SUBTRACTION_SYMBOL'] = '−';
Ru['DELETE_X_BLOCKS'] = 'Удалить блоки (%1)';

Ru['COPY_ALL_TO_BACKPACK'] = 'Копировать все блоки в рюкзак';
Ru['COPY_TO_BACKPACK'] = 'Копировать в рюкзак';
Ru['EMPTY_BACKPACK'] = 'Очистить рюкзак';
Ru['PASTE_ALL_FROM_BACKPACK'] = 'Вставить всё из рюкзака';
Ru['REMOVE_FROM_BACKPACK'] = 'Удалить из рюкзака';

/* Fixes crash: https://github.com/google/blockly/pull/6211 */
/* Should update Blockly to new version when patch will be included to stable release */

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

/* Procedures: should await for execution! */

Blockly.JavaScript['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  const funcName = Blockly.JavaScript.nameDB_.getName(
      block.getFieldValue('NAME'), Blockly.Names.NameType.PROCEDURE);
  let xfix1 = '';
  if (Blockly.JavaScript.STATEMENT_PREFIX) {
    xfix1 += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX, block);
  }
  if (Blockly.JavaScript.STATEMENT_SUFFIX) {
    xfix1 += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = Blockly.JavaScript.prefixLines(xfix1, Blockly.JavaScript.INDENT);
  }
  let loopTrap = '';
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    loopTrap = Blockly.JavaScript.prefixLines(
        Blockly.JavaScript.injectId(Blockly.JavaScript.INFINITE_LOOP_TRAP, block),
        Blockly.JavaScript.INDENT);
  }
  const branch = Blockly.JavaScript.statementToCode(block, 'STACK');
  let returnValue =
          Blockly.JavaScript.valueToCode(block, 'RETURN', Blockly.JavaScript.ORDER_NONE) || '';
  let xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = Blockly.JavaScript.INDENT + 'return ' + returnValue + ';\n';
  }
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = Blockly.JavaScript.nameDB_.getName(variables[i], Blockly.Names.NameType.VARIABLE);
  }
  let code = 'async function ' + funcName + '(' + args.join(', ') + ') {\n' + xfix1 +
          loopTrap + branch + xfix2 + returnValue + '}';
  code = Blockly.JavaScript.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.JavaScript.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.JavaScript['procedures_defnoreturn'] = Blockly.JavaScript['procedures_defreturn'];

Blockly.JavaScript['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  const funcName = Blockly.JavaScript.nameDB_.getName(
      block.getFieldValue('NAME'), Blockly.Names.NameType.PROCEDURE);
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = Blockly.JavaScript.valueToCode(block, 'ARG' + i, Blockly.JavaScript.ORDER_NONE) ||
            'null';
  }
  const code = 'await ' + funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  const tuple = Blockly.JavaScript['procedures_callreturn'](block);
  return tuple[0] + ';\n';
};

/* Modify math blocks */
// TODO: use settings to enable/disable extended math

Blockly.Blocks['math_number_property'] = {
  init: function() {
    this.jsonInit({
      'type': 'math_number_property',
      'message0': '%1 %2',
      'args0': [
        {
          'type': 'input_value',
          'name': 'NUMBER_TO_CHECK',
          'check': 'Number',
        },
        {
          'type': 'field_dropdown',
          'name': 'PROPERTY',
          'options': [
            ['%{BKY_MATH_IS_EVEN}', 'EVEN'],
            ['%{BKY_MATH_IS_ODD}', 'ODD'],
            // ['%{BKY_MATH_IS_PRIME}', 'PRIME'],
            // ['%{BKY_MATH_IS_WHOLE}', 'WHOLE'],
            ['%{BKY_MATH_IS_POSITIVE}', 'POSITIVE'],
            ['%{BKY_MATH_IS_NEGATIVE}', 'NEGATIVE'],
            ['%{BKY_MATH_IS_DIVISIBLE_BY}', 'DIVISIBLE_BY'],
          ],
        },
      ],
      'inputsInline': true,
      'output': 'Boolean',
      'style': 'math_blocks',
      'tooltip': '%{BKY_MATH_IS_TOOLTIP}',
      'mutator': 'math_is_divisibleby_mutator',
    });
  },
};

Blockly.Blocks['math_arithmetic'] = {
  init: function() {
    this.jsonInit({
      'type': 'math_arithmetic',
      'message0': '%1 %2 %3',
      'args0': [
        {
          'type': 'input_value',
          'name': 'A',
          'check': 'Number',
        },
        {
          'type': 'field_dropdown',
          'name': 'OP',
          'options': [
            ['%{BKY_MATH_ADDITION_SYMBOL}', 'ADD'],
            ['%{BKY_MATH_SUBTRACTION_SYMBOL}', 'MINUS'],
            ['%{BKY_MATH_MULTIPLICATION_SYMBOL}', 'MULTIPLY'],
            ['%{BKY_MATH_DIVISION_SYMBOL}', 'DIVIDE'],
            // ['%{BKY_MATH_POWER_SYMBOL}', 'POWER'],
          ],
        },
        {
          'type': 'input_value',
          'name': 'B',
          'check': 'Number',
        },
      ],
      'inputsInline': true,
      'output': 'Number',
      'style': 'math_blocks',
      'helpUrl': '%{BKY_MATH_ARITHMETIC_HELPURL}',
      'extensions': ['math_op_tooltip'],
    });
  },
};

Blockly.Blocks['math_single'] = {
  init: function() {
    this.jsonInit({
      'type': 'math_single',
      'message0': '%1 %2',
      'args0': [
        {
          'type': 'field_dropdown',
          'name': 'OP',
          'options': [
            // ['%{BKY_MATH_SINGLE_OP_ROOT}', 'ROOT'],
            ['%{BKY_MATH_SINGLE_OP_ABSOLUTE}', 'ABS'],
            ['-', 'NEG'],
            // ['ln', 'LN'],
            // ['log10', 'LOG10'],
            // ['e^', 'EXP'],
            // ['10^', 'POW10'],
          ],
        },
        {
          'type': 'input_value',
          'name': 'NUM',
          'check': 'Number',
        },
      ],
      'output': 'Number',
      'style': 'math_blocks',
      'helpUrl': '%{BKY_MATH_SINGLE_HELPURL}',
      'extensions': ['math_op_tooltip'],
    });
  },
};
