/* eslint-disable camelcase */

import * as Blockly from 'blockly/core';
import 'blockly/javascript';

import {FieldSlider} from '/src/blockly-wrapper/field_slider';
import {FieldGridDropdown} from '@blockly/field-grid-dropdown';

import './BlocklyPatches';

let colours = {};

const MotorsIndex = {
  'MOTOR_A': 0,
  'MOTOR_B': 1,
  'MOTOR_C': 2,
  'MOTOR_D': 3,
};

const SpeedAxesModes = {
  'AXIS_YAW' : 0,
  'AXIS_MARCH' : 1,
  'AXIS_DEPTH' : 2,
};

const ImuAxesModes = {
  'IMU_AXIS_YAW': 0,
  'IMU_AXIS_PITCH': 1,
  'IMU_AXIS_ROLL': 2,
};

export default {
  name: 'Blocks',

  colours: {
    flow:        '#A44',
    mov:         '#B70',
    sensors:     '#BA3',
    logic:          120,
    loop:           200,
    math:           240,
    colour:         280,
    variable:       320,
    procedure:   '#778',
  },

  init: function() {
    /* - - - Fill categories colours - - -*/

    colours = this.colours;

    for (const key in colours) {
      if ((key + '_category') in Blockly.Themes.Classic.categoryStyles) {
        Blockly.Themes.Classic.categoryStyles[key + '_category'].colour = colours[key];
      }

      if ((key + '_blocks') in Blockly.Themes.Classic.blockStyles) {
        Blockly.Themes.Classic.blockStyles[key + '_blocks'].colourPrimary = colours[key];
      }
    }

    /* - - - Helper funcions - - - */

    function getOrder(gen) {
      return Blockly.JavaScript.ORDER_NONE;
    }

    function calcVal(gen, block, name) {
      const prefix = gen === Blockly.JavaScript ? 'await ' : '';
      return prefix + gen.valueToCode(block, name, getOrder(gen)) || '\'\'';
    }

    function calcValFloor(gen, block, name) {
      const prefix = 'Math.floor(';
      return prefix + gen.valueToCode(block, name, getOrder(gen)) + ')' || '\'\'';
    }

    function genFloor(gen, code) {
      const prefix = 'Math.floor(';
      return prefix + code + ')';
    }

    function makePrefix(gen, block) {
      let prefix = '';

      if (gen === Blockly.JavaScript && Blockly.JavaScript.STATEMENT_PREFIX) {
        prefix += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX, block);
      }

      return prefix;
    }

    function makeLoop(gen, block, condition, branch) {
      return `
while (${condition}) {
${makePrefix(gen, block)}
${branch}
}
`;
    }

    // register function prototype
    function register_proto(name, func) {
      console.log('Register block ' + name);
      Blockly.JavaScript[name] = func(Blockly.JavaScript);
    }

    function makeFunc(gen, code, wait) {
      return ((wait ? 'await ' : '') + `${code};\n`);
    }

    function makeInlineFunc(gen, code) {
      return [code, Blockly.JavaScript.ORDER_NONE];
    }

    function makeDelay(gen, delay) {
      delay = genFloor(gen, `${delay} * 1000`);
      return makeFunc(gen, `mur.delay(${delay})`, true);
    }

    function iconPath(name) {
      return `mdi/${name}.svg`;
    }

    function icon(name, alt = '') {
      return new Blockly.FieldImage(iconPath(name), 32, 32, alt);
    }

    function item_image(name, value, alt = '') {
      return [{src: iconPath(name), width: 32, height: 32, alt: alt}, value];
    }

    // generic function prototype for numeric blocks
    const proto_num_value = (gen) => {
      return (block) => {
        const value = block.getFieldValue('Value');
        return makeInlineFunc(gen, `(${value})`);
      };
    };

    /* - - - Blocks definition - - - */

    /* mur_delay */

    Blockly.Blocks.mur_delay = {
      init: function() {
        this.appendDummyInput()
            .appendField(icon('timer-sand', 'ждать'));

        this.appendValueInput('sleepSeconds')
            .setCheck('Number');

        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.flow);
        //this.setTooltip('Ждать указанное количество секунд');
      },
    };

    register_proto('mur_delay', (gen) => {
      return (block) => {
        const sleepMs = calcVal(gen, block, 'sleepSeconds');
        return makeDelay(gen, sleepMs);
      };
    });

    /* mur_get_timestamp */

    Blockly.Blocks.mur_get_timestamp = {
      init: function() {
        this.appendDummyInput()
            .appendField(icon('timer-outline', 'время'))

            .appendField(new FieldGridDropdown([
              ['секунд', 'MODE_SEC'],
              ['миллисекунд', 'MODE_MSEC'],
            ], undefined, {columns: 1, DEFAULT_VALUE: 'MODE_SEC'}), 'MODE')

            .appendField('прошло');

        this.setOutput(true, 'Number');
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setInputsInline(true);
        this.setColour(colours.flow);
        //this.setTooltip('Сколько времени прошло с запуска программы');
      },
    };

    register_proto('mur_get_timestamp', (gen) => {
      return (block) => {
        const isMilliseconds = block.getFieldValue('MODE') === 'MODE_MSEC';
        return makeInlineFunc(gen, `mur.get_timestamp(${isMilliseconds})`);
      };
    });

    /* mur_thread */

    Blockly.Blocks.mur_thread = {
      init: function() {
        this.appendDummyInput()
            .appendField(icon('parallel-thread-rotated'), 'процесс')
            .appendField('Процесс')
            .appendField(new Blockly.FieldTextInput(), 'ThreadName');

        this.appendStatementInput('STACK').appendField();
        this.setPreviousStatement(false, '');
        this.setNextStatement(false, '');
        this.setInputsInline(true);
        this.setColour(colours.flow);
        //this.setTooltip('Процесс');
      },
    };

    register_proto('mur_thread', (gen) => {
      return (block) => {
        const branch = Blockly.JavaScript.statementToCode(block, 'STACK');
        const name = block.getFieldValue('ThreadName');

        return `
(async () => {
/* MUR_THREAD:
 - ${gen.injectId('ID: %1', block)}
 - NAME: ${name}
*/
const _threadId = ${gen.injectId('%1', block)};

${branch}
await mur.thread_end(_threadId);
await mur.h(_threadId, null);
})();
`;
      };
    });

    /* mur_print */

    Blockly.Extensions.register('auto_print_name', function() {
      this.setOnChange(function(changeEvent) {
        if (!(changeEvent.type === 'move')) {
          return;
        }

        if ('childBlocks_' in this && this.getChildren().length > 0) {
          const fieldName = this.inputList[0].fieldRow[1];

          this.getChildren().forEach((item) => {
            if (item.id !== changeEvent.blockId) {
              return;
            }

            if (item.type == 'variables_get') {
              const variableName = item.inputList[0].fieldRow[0].selectedOption_[0];
              fieldName.setEditorValue_(variableName);
            }
          });
        }
      });
    });

    Blockly.Blocks.mur_print = {
      init: function() {
        this.appendValueInput('Value')
            .appendField(icon('tooltip-text-outline', 'Текст'))
            .appendField(new Blockly.FieldTextInput(), 'Text');

        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.flow);
        //this.setTooltip('Отобразить значение');

        Blockly.Extensions.apply('auto_print_name', this);
      },
    };

    register_proto('mur_print', (gen) => {
      return (block) => {
        const text = block.getFieldValue('Text');
        const value = calcVal(gen, block, 'Value');
        return makeFunc(gen, `mur.print("${text}", ${value})`);
      };
    });

    /* mur_text */

    Blockly.Blocks.mur_text = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput(), 'Text');

        this.setOutput(true, 'String');
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setColour(colours.flow);
        //this.setTooltip('Отобразить значение');
      },
    };

    register_proto('mur_text', (gen) => {
      return (block) => {
        const text = block.getFieldValue('Text');
        return [`"${text}"`, Blockly.JavaScript.ORDER_ATOMIC];
      };
    });

    /* mur_set_power */

    const motors_dropdown = [
      item_image('chars/alpha-c', 'MOTOR_C', 'C'),
      item_image('chars/alpha-d', 'MOTOR_D', 'D'),
      item_image('chars/alpha-a', 'MOTOR_A', 'A'),
      item_image('chars/alpha-b', 'MOTOR_B', 'B'),
    ];

    Blockly.Blocks.mur_set_power = {
      init: function() {
        this.appendDummyInput()
            .appendField(icon('fan', 'движитель'))
            .appendField(new FieldGridDropdown(
                motors_dropdown,
                undefined,
                {columns: 2, DEFAULT_VALUE: 'MOTOR_A'}),
            'Index',
            );

        this.appendValueInput('Power')
            .setCheck('Number')
            .appendField(icon('speedometer', 'тяга'));

        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.mov);
        //this.setTooltip('Задать тягу на движитель');
      },
    };

    register_proto('mur_set_power', (gen) => {
      return (block) => {
        const indexChar = block.getFieldValue('Index');
        const index = MotorsIndex[indexChar];
        const power = calcVal(gen, block, 'Power');
        return makeFunc(gen, `mur.set_power(${index}, ${power})`);
      };
    });

    /* mur_actuator */

    Blockly.Blocks.mur_actuator = {
      init: function() {
        this.appendDummyInput()
            .appendField(new FieldGridDropdown([
              item_image('magnet-on', 'SOLENOID_ON', 'включить'),
              item_image('magnet-off', 'SOLENOID_OFF', 'выключить'),
            ], undefined, {columns: 2, DEFAULT_VALUE: 'SOLENOID_ON'}), 'MODE');

        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.mov);
        //this.setTooltip('Задать мощность на соленоид');
      },
    };

    register_proto('mur_actuator', (gen) => {
      return (block) => {
        const mode = block.getFieldValue('MODE');
        return makeFunc(gen, `mur.actuator(0, ${mode == 'SOLENOID_ON' ? 100 : 0})`);
      };
    });

    /* mur_set_axis */

    const movements_dropdown = [
      item_image('arrow-march', 'AXIS_MARCH', 'вперед/назад'),
      item_image('arrow-rotate', 'AXIS_YAW', 'налево/направо'),
      item_image('arrow-depth', 'AXIS_DEPTH', 'подниматься/опускаться'),
    ];

    Blockly.Blocks.mur_set_axis = {
      init: function() {
        this.appendDummyInput()
            .appendField(new FieldGridDropdown(
                movements_dropdown, undefined, {columns: 3, DEFAULT_VALUE: 'AXIS_MARCH'}), 'MODE',
            );

        this.appendValueInput('Power')
            .setCheck('Number')
            .appendField(icon('speedometer', 'мощность'));

        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.mov);
        //this.setTooltip('Задать движение на ось');
      },
    };

    register_proto('mur_set_axis', (gen) => {
      return (block) => {
        const mode = block.getFieldValue('MODE');
        const index = SpeedAxesModes[mode];
        const power = calcVal(gen, block, 'Power');
        return makeFunc(gen, `mur.set_axis(${index}, ${power})`);
      };
    });

    /* mur_sensor_color_wait */

    Blockly.Blocks.mur_sensor_color_wait = {
      init: function() {
        this.appendDummyInput()
            .appendField(new FieldGridDropdown([
              item_image('color-light', 'SENSOR_COLOR_WHITE', 'светлое'),
              item_image('moon', 'SENSOR_COLOR_BLACK', 'тёмное'),
            ], undefined, {columns: 2, DEFAULT_VALUE: 'SENSOR_COLOR_WHITE'}), 'MODE')
            .appendField(icon('timer-sand', 'ждать'));

        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.sensors);
        //this.setTooltip('Задать движение на ось');
      },
    };

    register_proto('mur_sensor_color_wait', (gen) => {
      return (block) => {
        const mode = block.getFieldValue('MODE');

        if (gen === Blockly.JavaScript) {
          return makeFunc(gen, `while (!mur.get_color_status('${mode}')) {await mur.delay(50);}`);
        }
      };
    });

    /* mur_get_color */

    Blockly.Blocks.mur_get_color = {
      init: function() {
        this.appendDummyInput()
            .appendField(new FieldGridDropdown([
              item_image('color-light', 'SENSOR_COLOR_WHITE', 'светлое'),
              item_image('moon', 'SENSOR_COLOR_BLACK', 'тёмное'),
            ], undefined, {columns: 2, DEFAULT_VALUE: 'SENSOR_COLOR_WHITE'}), 'MODE');

        this.setOutput(true, 'Boolean');
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setColour(colours.sensors);
        //this.setTooltip('Проверка цвета');
      },
    };

    register_proto('mur_get_color', (gen) => {
      return (block) => {
        const mode = block.getFieldValue('MODE');
        return makeInlineFunc(gen, `mur.get_color_status('${mode}')`);
      };
    });

    /* mur_stop_motors */

    Blockly.Blocks.mur_stop_motors = {
      init: function() {
        this.appendDummyInput()
            .appendField(icon('fan-off', 'стоп'));

        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.mov);
        //this.setTooltip('Остановить движители');
      },
    };

    register_proto('mur_stop_motors', (gen) => {
      return (block) => {
        return makeFunc(gen, `
          await mur.stop_all()
        `);
      };
    });

    /* mur_set_yaw */

    Blockly.Blocks.mur_set_yaw = {
      init: function() {
        this.appendDummyInput()
            .appendField(icon('rotate-360', 'курс'))
            .appendField(new FieldGridDropdown([
              item_image('equal', 'SET_YAW_ABSOLUTE', 'утсановить курс абсолютно'),
              item_image('rotate-right', 'SET_YAW_RELATIVE', 'увеличить курс относительно'),
            ], undefined, {columns: 2, DEFAULT_VALUE: 'SET_YAW_ABSOLUTE'}), 'MODE');

        this.appendValueInput('Angle')
            .setCheck('Number');

        this.appendValueInput('Power')
            .setCheck('Number')
            .appendField(icon('speedometer', 'мощность'));

        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.mov);
        //this.setTooltip('Установить курс');
      },
    };

    register_proto('mur_set_yaw', (gen) => {
      return (block) => {
        const mode = block.getFieldValue('MODE');
        const absolute = mode === 'SET_YAW_ABSOLUTE';
        const angle = calcVal(gen, block, 'Angle');
        const power = calcVal(gen, block, 'Power');
        return makeFunc(gen, `await mur.set_yaw(${angle}, ${power}, ${absolute})`);
      };
    });

    /* mur_number_degrees */

    Blockly.FieldAngle.HALF = 100;
    Blockly.FieldAngle.RADIUS = 90;

    Blockly.Blocks.mur_number_degrees = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldAngle(0, undefined, {
              mode: 'compass',
              wrap: 180,
            }), 'Value');

        this.setOutput(true, 'Number');
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setColour(colours.mov);
        //this.setTooltip('Курс в градусах');
      },
    };

    register_proto('mur_number_degrees', (gen) => {
      return (block) => {
        const value = block.getFieldValue('Value');
        return makeInlineFunc(gen, `(${value})`);
      };
    });

    /* mur_get_imu_tap */

    Blockly.Blocks.mur_get_imu_tap = {
      init: function() {
        this.appendDummyInput()
            .appendField(new FieldGridDropdown([
              item_image('cursor-default-click', 'IMU_TAP_ONE', 'один стук'),
              item_image('cursor-click-2x', 'IMU_TAP_DOUBLE', 'два стука'),
            ], undefined, {columns: 2, DEFAULT_VALUE: 'IMU_TAP_ONE'}), 'MODE');

        this.setOutput(true, 'Boolean');
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setColour(colours.sensors);
        //this.setTooltip('Происходит ли столкновение');
      },
    };

    register_proto('mur_get_imu_tap', (gen) => {
      return (block) => {
        const mode = block.getFieldValue('MODE') == 'IMU_TAP_DOUBLE' ? 1 : 0;
        return makeInlineFunc(gen, `mur.get_imu_tap(${mode})`);
      };
    });

    /* mur_get_imu_axis */

    Blockly.Blocks.mur_get_imu_axis = {
      init: function() {
        this.appendDummyInput()
            .appendField(icon('compass', 'ось'));
        this.appendDummyInput()
            .appendField(new FieldGridDropdown([
              item_image('rot-yaw', 'IMU_AXIS_YAW', 'Курс'),
              item_image('rot-pitch', 'IMU_AXIS_PITCH', 'Крен'),
              item_image('rot-roll', 'IMU_AXIS_ROLL', 'Дифферент'),
            ], undefined, {columns: 3, DEFAULT_VALUE: 'IMU_AXIS_YAW'}), 'MODE');

        this.setOutput(true, 'Number');
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setInputsInline(true);
        this.setColour(colours.sensors);
        //this.setTooltip('Ось');
      },
    };

    register_proto('mur_get_imu_axis', (gen) => {
      return (block) => {
        const mode = block.getFieldValue('MODE');
        const axis = ImuAxesModes[mode];
        return [`mur.get_imu_axis(${axis})`, Blockly.JavaScript.ORDER_NONE];
      };
    });

    /* mur_wait_imu_tap */

    Blockly.Blocks.mur_wait_imu_tap = {
      init: function() {
        this.appendDummyInput()
            .appendField(new FieldGridDropdown([
              item_image('cursor-default-click', 'IMU_TAP_ONE', 'один стук'),
              item_image('cursor-click-2x', 'IMU_TAP_DOUBLE', 'два стука'),
            ], undefined, {columns: 2, DEFAULT_VALUE: 'IMU_TAP_ONE'}), 'MODE')
            .appendField(icon('timer-sand', 'ждать'));

        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.sensors);
      },
    };

    register_proto('mur_wait_imu_tap', (gen) => {
      return (block) => {
        const isDouble = block.getFieldValue('MODE') == 'IMU_TAP_DOUBLE';
        return makeFunc(gen, `while (!mur.get_imu_tap(${isDouble})) {await mur.delay(50);}`);
      };
    });

    /* mur_loop_timeout */

    Blockly.Blocks.mur_loop_timeout = {
      init: function() {
        this.appendDummyInput()
            .appendField(icon('repeat-variant', 'цикл'));

        this.appendValueInput('Delay')
            .setCheck('Number')
            .appendField(icon('timer-sand', 'время'));

        this.appendStatementInput('STACK').appendField();
        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.loop);
        //this.setTooltip('цикл на время');
      },
    };

    register_proto('mur_loop_timeout', (gen) => {
      return (block) => {
        const delay = calcVal(gen, block, 'Delay');
        const branch = Blockly.JavaScript.statementToCode(block, 'STACK');

        return `
{
  const _begin_timestamp = +new Date();
  while ((+new Date()) - _begin_timestamp < (${delay} * 1000)) {
    ${makePrefix(gen, block)}
    ${branch}
  }
}
`;
      };
    });

    /* mur_loop_infinite */

    Blockly.Blocks.mur_loop_infinite = {
      init: function() {
        this.appendDummyInput()
            .appendField(icon('repeat-variant', 'цикл'));

        this.appendStatementInput('STACK').appendField();
        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.loop);
        //this.setTooltip('бесконечный цикл');
      },
    };

    register_proto('mur_loop_infinite', (gen) => {
      return (block) => {
        const branch = gen.statementToCode(block, 'STACK');
        return makeLoop(gen, block, 'true', branch);
      };
    });

    /* register loop blocks to be able to use "break/continue" block */

    Blockly.libraryBlocks.loops.loopTypes.add('mur_loop_infinite');
    Blockly.libraryBlocks.loops.loopTypes.add('mur_loop_timeout');

    /* mur_set_led */

    Blockly.Blocks.mur_set_led = {
      init: function() {
        this.appendValueInput('Index')
            .setCheck('Number')
            .appendField(icon('lightbulb-on', 'светодиод'));

        this.appendValueInput('Colour')
            .setCheck('Colour')
            .appendField(icon('palette', 'цвет'));

        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.colour);
        //this.setTooltip('Задать цвет на светодиод');

        Blockly.Extensions.apply('auto_led_color', this);
      },

      getIconField: function() {
        return this.inputList[0].fieldRow[0];
      },

      isColorFieldLight: function() {
        return this.getChildren()[1].inputList[0].fieldRow[0].getValue() != '#000000';
      },

      setIconLight: function(isLight = undefined) {
        if (isLight === undefined) {
          isLight = this.isColorFieldLight();
        }

        this.getIconField().setValue(
          isLight ? iconPath('lightbulb-on') : iconPath('lightbulb-outline'),
        );
      },
    };

    register_proto('mur_set_led', (gen) => {
      return (block) => {
        const index = calcVal(gen, block, 'Index');
        const colour = calcVal(gen, block, 'Colour');
        return makeFunc(gen, `await mur.set_led(${index}, ${colour})`);
      };
    });

    Blockly.Extensions.register('auto_led_color', function() {
      this.setOnChange(function(changeEvent) {
        try {
          this.setIconLight();
        } catch (err) { }
      });
    });

    /* mur_colour_picker */

    Blockly.Blocks.mur_colour_picker = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldColour(
                null, this.validate,
            ), 'Colour');
        this.setColour(colours.colour);
        this.setOutput(true, 'Colour');
      },

      validate: function(colourHex) {
        const isLight = colourHex != '#000000';

        try {
          const parent = this.getSourceBlock().getParent();
          if (parent) {
            parent.setIconLight();
          }
        } catch (err) {}
      },
    };

    register_proto('mur_colour_picker', (gen) => {
      return (block) => {
        const colour = block.getFieldValue('Colour');
        return makeInlineFunc(gen, `"${colour}"`);
      };
    });

    /* mur_set_leds_all */

    Blockly.Blocks.mur_set_leds_all = {
      init: function() {
        this.appendDummyInput('Index')
            .appendField(icon('lightbulb-group', 'светодиод'));

        this.appendValueInput('Colour')
            .setCheck('Colour')
            .appendField(icon('palette', 'цвет'));

        this.setPreviousStatement(true, 'action');
        this.setNextStatement(true, 'action');
        this.setInputsInline(true);
        this.setColour(colours.colour);
        //this.setTooltip('Задать цвет на светодиод');
        Blockly.Extensions.apply('auto_led_color', this);
      },

      getIconField: function() {
        return this.inputList[0].fieldRow[0];
      },

      isColorFieldLight: function() {
        return this.getChildren()[0].inputList[0].fieldRow[0].getValue() != '#000000';
      },

      setIconLight: function(isLight = undefined) {
        if (isLight === undefined) {
          isLight = this.isColorFieldLight();
        }

        this.getIconField().setValue(
          isLight ? iconPath('lightbulb-group') : iconPath('lightbulb-group-outline'),
        );
      },
    };

    register_proto('mur_set_leds_all', (gen) => {
      return (block) => {
        const colour = calcVal(gen, block, 'Colour');
        return makeFunc(gen, `
for (let i = 0; i < 4; i++) {
  await mur.set_led(i, ${colour});
}`);
      };
    });

    Blockly.FieldColour.COLOURS = [
      '#000000',
      '#ffffff',
      '#ff00ff',
      '#ff0000',
      '#ff6600',
      '#ffff00',
      '#00ff00',
      '#00ffff',
      '#0000ff',
    ];

    Blockly.FieldColour.TITLES = [
      'Чёрный',
      'Белый',
      'Пурпурный',
      'Красный',
      'Оранжевый',
      'Жёлтый',
      'Зелёный',
      'Голубой',
      'Синий',
    ];

    Blockly.FieldColour.COLUMNS = 3;

    /* math_slider_number */

    Blockly.Blocks.mur_number_slider = {
      init: function() {
        this.appendDummyInput()
            .appendField(new FieldSlider(0, -100, 100, false, 5), 'Value');

        this.setOutput(true, 'Number');
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setColour(colours.mov);
        //this.setTooltip('Число');
      },
    };

    register_proto('mur_number_slider', proto_num_value);

    /* mur_number_slider_yaw */

    Blockly.Blocks.mur_number_slider_yaw = {
      init: function() {
        this.appendDummyInput()
            .appendField(new FieldSlider(0, -180, 180, false, 5), 'Value');

        this.setOutput(true, 'Number');
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setColour(colours.mov);
        //this.setTooltip('Курс в градусах');
      },
    };

    register_proto('mur_number_slider_yaw', proto_num_value);

    /* mur_number_slider_positive */

    Blockly.Blocks.mur_number_slider_positive = {
      init: function() {
        this.appendDummyInput()
            .appendField(new FieldSlider(0, 0, 100, false, 5), 'Value');

        this.setOutput(true, 'Number');
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setColour(colours.mov);
        //this.setTooltip('Число');
      },
    };

    register_proto('mur_number_slider_positive', proto_num_value);

    /* mur_number */

    Blockly.Blocks.mur_number = {
      init: function() {
        this.appendDummyInput()
            .appendField(new FieldSlider(0, undefined, undefined, true), 'Value');

        this.setOutput(true, 'Number');
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setColour(colours.math);
        //this.setTooltip('Число');
      },
    };

    register_proto('mur_number', proto_num_value);

    /* mur_end_thread */

    Blockly.Blocks.mur_end_thread = {
      init: function() {
        this.appendDummyInput()
            .appendField(icon('flag-checkered', 'завершить'))

            .appendField(new FieldGridDropdown([
              ['Завершить программу', 'MODE_END_SCRIPT'],
              ['Завершить процесс', 'MODE_END_THREAD'],
            ], undefined, {columns: 1, DEFAULT_VALUE: 'MODE_END_SCRIPT'}), 'MODE');

        this.setPreviousStatement(true, 'action');
        this.setNextStatement(false);
        this.setInputsInline(true);
        this.setColour(colours.flow);
        //this.setTooltip('Завершить выполнение');
      },
    };

    register_proto('mur_end_thread', (gen) => {
      return (block) => {
        const mode = block.getFieldValue('MODE');
        return makeFunc(gen, `await mur.thread_end(_threadId, ${mode == 'MODE_END_SCRIPT'})`);
      };
    });

    /* mur_angle_norm */

    Blockly.Blocks.mur_angle_norm = {
      init: function() {
        this.appendValueInput('Value')
            .setCheck('Number')
            .appendField('нормализовать угол');

        this.setOutput(true, 'Number');
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setColour(colours.math);
        this.setInputsInline(false);
        //this.setTooltip('Нормализовать угол');
      },
    };

    register_proto('mur_angle_norm', (gen) => {
      return (block) => {
        const value = calcVal(gen, block, 'Value');
        return makeInlineFunc(gen, `mur.angle_norm(${value})`);
      };
    });

    const leds_dropdown = [
      ['0', '0'],
      ['1', '1'],
      ['3', '3'],
      ['2', '2'],
    ];

    /* mur_led_selector */

    Blockly.Blocks.mur_led_selector = {
      init: function() {
        this.appendDummyInput()
            .appendField(new FieldGridDropdown(
                leds_dropdown, undefined, {columns: 2, DEFAULT_VALUE: '0'}), 'Index',
            );

        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setOutput(true, 'Number'),
        this.setInputsInline(true);
        this.setColour(colours.colour);
      },
    };

    register_proto('mur_led_selector', (gen) => {
      return (block) => {
        const index = block.getFieldValue('Index');
        return makeInlineFunc(gen, `Number(${index})`);
      };
    });
  },
};
