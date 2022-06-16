/* eslint-disable camelcase */

import * as Blockly from 'blockly/core'
import BlocklyLua from 'blockly/lua'
import 'blockly/javascript';

import {FieldSlider} from '/src/blockly-wrapper/field_slider';
import {FieldGridDropdown} from '@blockly/field-grid-dropdown';

import './BlocklyPatches'

const color_spec = 70
const color_mov = 20

export default {
  name: 'Blocks',

  /* mur.delay(sleepMs) */

  init: function () {
    function getOrder (gen) {
      return gen === BlocklyLua ? BlocklyLua.ORDER_OVERRIDES
        : gen === Blockly.JavaScript ? Blockly.JavaScript.ORDER_NONE : null
    }

    function calcVal (gen, block, name) {
      const prefix = gen === Blockly.JavaScript ? 'await ' : ''
      return prefix + gen.valueToCode(block, name, getOrder(gen)) || '\'\''
    }

    function calcValFloor (gen, block, name) {
      const prefix = gen === BlocklyLua ? 'math.floor(' : 'Math.floor('
      return prefix + gen.valueToCode(block, name, getOrder(gen)) + ')' || '\'\''
    }

    function genFloor(gen, code) {
      const prefix = gen === BlocklyLua ? 'math.floor(' : 'Math.floor('
      return prefix + code + ')'
    }

    function makePrefix (gen, block) {
      let prefix = ''

      if (gen === Blockly.JavaScript && Blockly.JavaScript.STATEMENT_PREFIX) {
        prefix += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX, block)
      }

      if (gen === BlocklyLua && BlocklyLua.STATEMENT_PREFIX) {
        prefix += BlocklyLua.injectId(BlocklyLua.STATEMENT_PREFIX, block)
      }

      return prefix
    }

    function makeLoop (gen, block, condition, branch) {
      if (gen === Blockly.JavaScript) {
        return `
while (${condition}) {
${makePrefix(gen, block)}
${branch}
}
`
      }

      if (gen === BlocklyLua) {
        return `
while (${condition}) do
${branch}
end
`
      }
    }

    function register_proto (name, func) {
      console.log('Register block ' + name)

      BlocklyLua[name] = func(BlocklyLua)
      Blockly.JavaScript[name] = func(Blockly.JavaScript)
    }

    function makeFunc (gen, code, wait) {
      if (gen === Blockly.JavaScript) {
        return ((wait ? 'await ' : '') + `${code};\n`)
      }

      if (gen === BlocklyLua) {
        return `${code}\n`
      }
    }

    function makeInlineFunc (gen, code) {
      if (gen === Blockly.JavaScript) {
        return [code, Blockly.JavaScript.ORDER_NONE]
      }

      if (gen === BlocklyLua) {
        return [code, BlocklyLua.ORDER_OVERRIDES]
      }
    }

    function makeDelay (gen, delay) {
      console.log('makedelay is ' + delay)
      // if (gen === Blockly.JavaScript) {
      delay = genFloor(gen, `${delay} * 1000`)
      // }
      return makeFunc(gen, `mur.delay(${delay})`, true)
    }

    function icon (name, alt = '') {
      return new Blockly.FieldImage(`/mdi/${name}.svg`, 32, 32, alt)
    }

    function item_image (name, value, alt = '') {
      return [{ src: `/mdi/${name}.svg`, width: 32, height: 32, alt: alt }, value]
    }

    // Blockly.JavaScript.procedures_defreturn = function (block) {
    //   return '!!!'
    // }

    // // common.defineBlocksWithJsonArray([{
    // Blockly.Blocks.defineBlocksWithJsonArray([{
    //   type: 'controls_whileUntil',
    //   message0: '%1 %2',
    //   args0: [
    //     {
    //       type: 'field_dropdown',
    //       name: 'MODE',
    //       options: [
    //         ['aaa', 'WHILE'],
    //         ['bbb', 'UNTIL']
    //       ]
    //     },
    //     {
    //       type: 'input_value',
    //       name: 'BOOL',
    //       check: 'Boolean'
    //     }
    //   ],
    //   message1: '%{BKY_CONTROLS_REPEAT_INPUT_DO} %1',
    //   args1: [{
    //     type: 'input_statement',
    //     name: 'DO'
    //   }],
    //   previousStatement: null,
    //   nextStatement: null,
    //   style: 'loop_blocks',
    //   helpUrl: '%{BKY_CONTROLS_WHILEUNTIL_HELPURL}',
    //   extensions: ['controls_whileUntil_tooltip']
    // }])

    Blockly.Blocks.mur_delay = {
      init: function () {
        this.appendDummyInput()
          .appendField(icon('timer', 'ждать'))
          // .appendField('ждать')

        this.appendValueInput('sleepSeconds')
          .setCheck('Number')

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_spec)
        this.setTooltip('Ждать указанное количество секунд')
      }
    }

    register_proto('mur_delay', (gen) => {
      return (block) => {
        // const sleepMs = Math.round(block.getFieldValue('sleepSeconds') * 1000)
        // console.log('delay is ' + calcVal(gen, block, 'sleepSeconds')
        const sleepMs = calcVal(gen, block, 'sleepSeconds')
        return makeDelay(gen, sleepMs)
      }
    })

    /* thread */

//     Blockly.Blocks.mur_thread = {
//       init: function () {
//         this.appendDummyInput()
//           // .appendField(icon('parallel-thread-rotated', 'поток'))
//           .appendField(icon('parallel-thread-rotated'), 'поток')
//           // .appendField('поток')
//           .appendField(new Blockly.FieldTextInput(), 'threadName')

//         this.appendStatementInput('STACK').appendField()
//         this.setPreviousStatement(false, '')
//         this.setNextStatement(false, '')
//         this.setInputsInline(true)
//         this.setColour(color_spec)
//         this.setTooltip('Поток')
//       }
//     }

//     register_proto('mur_thread', (gen) => {
//       return (block) => {
//         const branch = Blockly.JavaScript.statementToCode(block, 'STACK')
//         return `
// (async () => {
// ${branch}
// await mur.h(_scriptId, null);
// await mur.thread_end(_scriptId);
// })();
// `
//         // let sleepMs = Math.round(block.getFieldValue('sleepSeconds') * 1000)
//         // return makeDelay(gen, sleepMs)
//       }
//     })

    /* mur.set_power(index, power) */

    const motors_dropdown = [
      item_image('chars/alpha-c', 'MOTOR_C', 'C'),
      item_image('chars/alpha-d', 'MOTOR_D', 'D'),
      item_image('chars/alpha-a', 'MOTOR_A', 'A'),
      item_image('chars/alpha-b', 'MOTOR_B', 'B'),
    ]

    Blockly.Blocks.mur_set_power = {
      init: function () {
        this.appendDummyInput()
          // .setCheck('Number')
          // .appendField('задать на мотор №')
          .appendField(icon('fan', 'движитель'))

          // .appendField(new Blockly.FieldDropdown(movements_dropdown, null), 'MODE')

          .appendField(new FieldGridDropdown(motors_dropdown, undefined, {columns: 2, DEFAULT_VALUE: 'MOTOR_A'}), "Index");

        this.appendValueInput('Power')
          .setCheck('Number')
          .appendField(icon('speedometer', 'тяга'))
          // .appendField('тяга')

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_mov)
        this.setTooltip('Задать тягу на движитель')
      }
    }

    const MotorsIndex = {
      'MOTOR_A': 0,
      'MOTOR_B': 1,
      'MOTOR_C': 2,
      'MOTOR_D': 3,
    }

    register_proto('mur_set_power', (gen) => {
      return (block) => {
        const indexChar = block.getFieldValue('Index')
        const index = MotorsIndex[indexChar];
        const power = calcVal(gen, block, 'Power')
        // let sleepMs = Math.round(calcVal(gen, block, 'Delay') * 1000)
        const sleepMs = calcVal(gen, block, 'Delay')
        return makeFunc(gen, `mur.set_power(${index}, ${power})`)
      }
    })

    /* mur.actuator(index, power) */

    // TODO: solenoid now can be only turned on/off without power level
    // TODO: make forced zero-power on solenoid after timeout?


    Blockly.Blocks.mur_actuator = {
      init: function () {
        this.appendDummyInput()

        .appendField(new FieldGridDropdown([
            item_image('magnet-on',  'SOLENOID_ON',   'включить'),
            item_image('magnet-off', 'SOLENOID_OFF',  'выключить')
          ], undefined, {columns: 2, DEFAULT_VALUE: 'SOLENOID_ON'}), "MODE");

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_mov)
        this.setTooltip('Задать мощность на соленоид')
      }
    }

    register_proto('mur_actuator', (gen) => {
      return (block) => {
        const mode = block.getFieldValue('MODE')
        return makeFunc(gen, `mur.actuator(0, ${mode == 'SOLENOID_ON' ? 100 : 0})`)
      }
    })

    /* mur.set_axis(index, power) */

    const movements_dropdown = [
      item_image('arrow-up-bold', 'AXIS_MARCH_FORWARD', 'вперед'),
      item_image('arrow-down-bold', 'AXIS_MARCH_BACKWARD', 'назад'),
      item_image('rotate-left', 'AXIS_YAW_LEFT', 'против часовой (налево)'),
      item_image('rotate-right', 'AXIS_YAW_RIGHT', 'по часовой (направо)'),
      item_image('depth-up', 'AXIS_VERTICAL_UP', 'вверх (подниматься)'),
      item_image('depth-down', 'AXIS_VERTICAL_DOWN', 'вниз (заглубляться)'),
      item_image('transfer-left', 'AXIS_SIDE_LEFT', 'влево'),
      item_image('transfer-right', 'AXIS_SIDE_RIGHT', 'вправо')
    ]

    Blockly.Blocks.mur_set_axis_wait = {
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(movements_dropdown, null), 'MODE')

        this.appendValueInput('Power')
          .setCheck('Number')
          .appendField(icon('speedometer', 'тяга'))

        this.appendValueInput('Delay')
          .setCheck('Number')
          .appendField(icon('timer', 'длительность'))

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_mov)
        this.setTooltip('Задать движение на ось')
      }
    }

    Blockly.Blocks.mur_set_axis = {
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(movements_dropdown, null), 'MODE')

        this.appendValueInput('Power')
          .setCheck('Number')
          .appendField(icon('speedometer', 'тяга'))

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_mov)
        this.setTooltip('Задать движение на ось')
      }
    }

    /* on light sensor */

    Blockly.Blocks.mur_sensor_color_wait = {
      init: function () {
        // this.appendDummyInput()
        //   .appendField(icon('axis-arrow', 'ось'))

        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            item_image('sun-wireless', 'SENSOR_COLOR_WHITE', 'светлое'),
            item_image('sun-wireless-outline', 'SENSOR_COLOR_BLACK', 'тёмное')
          ], null), 'MODE')
          .appendField(icon('timer-sand', 'ждать'))

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_spec)
        this.setTooltip('Задать движение на ось')
      }
    }

    register_proto('mur_sensor_color_wait', (gen) => {
      return (block) => {
        let mode = block.getFieldValue('MODE')

        // TODO: stupid! try to do it with async way
        // TODO: should only call function in interpreter

        // TODO: should implement a proper way to wait for event!

        if (gen === Blockly.JavaScript) {
          return makeFunc(gen, `while (!mur.get_color_status('${mode}')) {await mur.delay(50);}`)
        }

        if (gen === BlocklyLua) {
          return makeFunc(gen, `while (!mur.get_color_status('${mode}')) do mur.delay(50) end`)
        }
      }
    })


    Blockly.Blocks.mur_get_color = {
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            item_image('sun-wireless', 'SENSOR_COLOR_WHITE', 'светлое'),
            item_image('sun-wireless-outline', 'SENSOR_COLOR_BLACK', 'тёмное')
          ], null), 'MODE')

        this.setOutput(true, 'Boolean')
        this.setPreviousStatement(false, null)
        this.setNextStatement(false, null)
        this.setColour(color_spec)
        this.setTooltip('Проверка цвета')
      }
    }

    // register_proto('mur_get_color', (gen) => {
    //   return (block) => {
    //     let mode = block.getFieldValue('MODE')
    //     return [`mur.get_color_status('${mode}')`, Blockly.JavaScript.ORDER_NONE]
    //     // return makeFunc(gen, 'mur.get_imu_tap()')
    //   }
    // })

    register_proto('mur_get_color', (gen) => {
      return (block) => {
        let mode = block.getFieldValue('MODE')
        if (gen === BlocklyLua) {
          mode = 1 // TODO !!!
        }
        // return [`mur.get_color_status('${mode}')`, Blockly.JavaScript.ORDER_NONE]
        return makeInlineFunc(gen, `mur.get_color_status('${mode}')`)
      }
    })

    // register_proto('mur_get_imu_tap', (gen) => {
    //   return (block) => {
    //     return ['mur.get_imu_tap()', Blockly.JavaScript.ORDER_NONE]
    //     // return makeFunc(gen, 'mur.get_imu_tap()')
    //   }
    // })

    register_proto('mur_get_imu_tap', (gen) => {
      return (block) => {
        return makeInlineFunc(gen, 'mur.get_imu_tap()')
      }
    })

    /* stop all axes */

    Blockly.Blocks.mur_stop_motors = {
      init: function () {
        this.appendDummyInput()
          .appendField(icon('fan-off', 'стоп'))

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_mov)
        this.setTooltip('Остановить движители')
      }
    }

    register_proto('mur_stop_motors', (gen) => {
      return (block) => {
        return makeFunc(gen, `
          mur.set_power(0, 0)
          mur.set_power(1, 0)
          mur.set_power(2, 0)
          mur.set_power(3, 0)
        `)
      }
    })

    /* set yaw */

    Blockly.Blocks.mur_set_yaw = {
      init: function () {
        // this.appendDummyInput()
        //   .appendField(icon('axis-arrow', 'ось'))

        this.appendDummyInput()
          .appendField(icon('rotate-360', 'курс'))
          .appendField(new Blockly.FieldDropdown([
            item_image('equal', 'SET_YAW_EQUAL', 'утсановить абсолютно'),
            item_image('rotate-left', 'SET_YAW_LEFT', 'увеличить значение курса'),
            item_image('rotate-right', 'SET_YAW_RIGHT', 'уменьшить значение курса')
          ], null), 'MODE')

        this.appendValueInput('Angle')
          .setCheck('Number')

        // this.appendDummyInput()
        // .appendField('°')
        // .appendField(icon('timer', 'длительность'))

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_mov)
        this.setTooltip('Установить курс')
      }
    }

    register_proto('mur_set_axis', (gen) => {
      return (block) => {
        // TODO
        const index = calcVal(gen, block, 'Index')
        const power = calcVal(gen, block, 'Power')
        const sleepMs = calcVal(gen, block, 'Delay')
        return makeFunc(gen, `mur.set_axis(${index}, ${power})`) + makeDelay(gen, sleepMs)
      }
    })

    /* mur.get_imu_tap */
    /* mur.get_color_status */

    Blockly.Blocks.mur_get_imu_tap = {
      init: function () {
        this.appendDummyInput()
          .appendField(icon('cursor-default-click', 'столкновение'))

        this.setOutput(true, 'Boolean')
        this.setPreviousStatement(false, null)
        this.setNextStatement(false, null)
        this.setColour(color_spec)
        this.setTooltip('Происходит ли столкновение')
      }
    }

    register_proto('mur_get_imu_tap', (gen) => {
      return (block) => {
        return ['mur.get_imu_tap()', Blockly.JavaScript.ORDER_NONE]
        // return makeFunc(gen, 'mur.get_imu_tap()')
      }
    })

    /* mur.get_imu_yaw */

    Blockly.Blocks.mur_get_imu_axis = {
      init: function () {
        this.appendDummyInput()
          .appendField(icon('compass', 'ось'))
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            item_image('rot-yaw', 'IMU_AXIS_YAW', 'Курс'),
            item_image('rot-pitch', 'IMU_AXIS_PITCH', 'Крен'),
            item_image('rot-roll', 'IMU_AXIS_ROLL', 'Дифферент')
          ], null), 'MODE')

        this.setOutput(true, 'Number')
        this.setPreviousStatement(false, null)
        this.setNextStatement(false, null)
        this.setInputsInline(true)
        this.setColour(color_spec)
        this.setTooltip('Ось')
      }
    }

    // TODO (in all block with mode selection): use index/enum instead of text

    register_proto('mur_get_imu_axis', (gen) => {
      return (block) => {
        let Mode = block.getFieldValue('MODE')
        const ModesEnum = {
          IMU_AXIS_YAW: 0,
          IMU_AXIS_PITCH: 1,
          IMU_AXIS_ROLL: 2
        }
        Mode = ModesEnum[Mode]
        return [`mur.get_imu_axis(${Mode})`, Blockly.JavaScript.ORDER_NONE]
        // return makeFunc(gen, 'mur.get_imu_tap()')
      }
    })

    Blockly.Blocks.mur_wait_imu_tap = {
      init: function () {
        this.appendDummyInput()
          // .appendField(icon('cursor-default-click', 'столкновение'))
          .appendField(new Blockly.FieldDropdown([
            item_image('cursor-default-click', 'IMU_TAP_ONE', 'один стук'),
            item_image('cursor-click-2x', 'IMU_TAP_DOUBLE', 'два стука')
          ], null), 'MODE')
          .appendField(icon('timer-sand', 'ждать'))

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_spec)
      }
    }

    register_proto('mur_wait_imu_tap', (gen) => {
      return (block) => {
        // TODO: stupid! try to do it with async way
        // TODO: should only call function in interpreter

        // TODO: should implement a proper way to wait for event!

        if (gen === Blockly.JavaScript) {
          return makeFunc(gen, 'while (!mur.get_imu_tap()) {await mur.delay(50);}')
        }

        if (gen === BlocklyLua) {
          return makeFunc(gen, 'while (not mur.get_imu_tap()) do mur.delay(50) end')
        }
      }
    })

    /* TODO: time loop */

    Blockly.Blocks.mur_loop_timeout = {
      init: function () {
        this.appendDummyInput()
          .appendField(icon('repeat-variant', 'цикл'))

        this.appendValueInput('Delay')
          .setCheck('Number')
          .appendField(icon('timer-sand', 'время'))

        this.appendStatementInput('STACK').appendField()
        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_spec)
        this.setTooltip('цикл на время')
      }
    }

    register_proto('mur_loop_timeout', (gen) => {
      return (block) => {
        const delay = calcVal(gen, block, 'Delay')
        const branch = Blockly.JavaScript.statementToCode(block, 'STACK')

        return `
{
  const _begin_timestamp = +new Date();
  while ((+new Date()) - _begin_timestamp < (${delay} * 1000)) {
    ${makePrefix(gen, block)}
    ${branch}
  }
}
`
      }
    })

    /* infinite loop */

    Blockly.Blocks.mur_loop_infinite = {
      init: function () {
        this.appendDummyInput()
          .appendField(icon('repeat-variant', 'цикл'))

        this.appendStatementInput('STACK').appendField()
        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_spec)
        this.setTooltip('бесконечный цикл')
      }
    }

    register_proto('mur_loop_infinite', (gen) => {
      return (block) => {
        const branch = gen.statementToCode(block, 'STACK')
        return makeLoop(gen, block, 'true', branch)
      }
    })

    /* set led color */

    Blockly.Blocks.mur_set_led = {
      init: function () {
        this.appendValueInput('Index')
          .setCheck('Number')
          .appendField(icon('white-balance-iridescent', 'светодиод'))

        this.appendValueInput('Colour')
          .setCheck('Colour')
          .appendField(icon('palette', 'цвет'))

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_spec)
        this.setTooltip('Задать цвет на светодиод')
      }
    }

    register_proto('mur_set_led', (gen) => {
      return (block) => {
        const index = calcVal(gen, block, 'Index')
        const colour = calcVal(gen, block, 'Colour')
        return makeFunc(gen, `await mur.set_led(${index}, ${colour})`)
      }
    })

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
      init: function () {
        this.appendDummyInput()
          .appendField(new FieldSlider(0, -100, 100, false, 5), "Value")

        this.setOutput(true, 'Number')
        this.setPreviousStatement(false, null)
        this.setNextStatement(false, null)
        this.setColour(color_mov)
        this.setTooltip('Число')
      }
    }

    register_proto('mur_number_slider', (gen) => {
      return (block) => {
        const value = block.getFieldValue('Value')
        return makeInlineFunc(gen, `(${value})`)
      }
    })

    Blockly.Blocks.mur_number = {
      init: function () {
        this.appendDummyInput()
          .appendField(new FieldSlider(0, undefined, undefined, true), "Value")

        this.setOutput(true, 'Number')
        this.setPreviousStatement(false, null)
        this.setNextStatement(false, null)
        this.setColour(color_spec)
        this.setTooltip('Число')
      }
    }

    register_proto('mur_number', (gen) => {
      return (block) => {
        const value = block.getFieldValue('Value')
        return makeInlineFunc(gen, `(${value})`)
      }
    })

    /*

        Blockly.Blocks.mur_get_color = {
      init: function () {
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            item_image('sun-wireless', 'SENSOR_COLOR_WHITE', 'светлое'),
            item_image('sun-wireless-outline', 'SENSOR_COLOR_BLACK', 'тёмное')
          ], null), 'MODE')

        this.setOutput(true, 'Boolean')
        this.setPreviousStatement(false, null)
        this.setNextStatement(false, null)
        this.setColour(color_spec)
        this.setTooltip('Проверка цвета')
      }
    }

    // register_proto('mur_get_color', (gen) => {
    //   return (block) => {
    //     let mode = block.getFieldValue('MODE')
    //     return [`mur.get_color_status('${mode}')`, Blockly.JavaScript.ORDER_NONE]
    //     // return makeFunc(gen, 'mur.get_imu_tap()')
    //   }
    // })

    register_proto('mur_get_color', (gen) => {
      return (block) => {
        let mode = block.getFieldValue('MODE')
        if (gen === BlocklyLua) {
          mode = 1 // TODO !!!
        }
        // return [`mur.get_color_status('${mode}')`, Blockly.JavaScript.ORDER_NONE]
        return makeInlineFunc(gen, `mur.get_color_status('${mode}')`)
      }
    })

    */


    /* end thread */

    // TODO: rename!! to be consistent

    Blockly.Blocks.mur_end_thread = {
      init: function () {
        this.appendDummyInput()
          .appendField(icon('flag-checkered', 'завершить'))

          .appendField(new FieldGridDropdown([
              ['Завершить программу', 'MODE_END_SCRIPT'],
              ['Завершить поток',     'MODE_END_THREAD'],
            ], undefined, {columns: 1, DEFAULT_VALUE: 'MODE_END_SCRIPT'}), "MODE");

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(false)
        this.setInputsInline(true)
        this.setColour(color_spec)
        this.setTooltip('Завершить выполнение')
      }
    }

    register_proto('mur_end_thread', (gen) => {
      return (block) => {
        const mode = block.getFieldValue('MODE')
        return makeFunc(gen, `await mur.thread_end(_scriptId, ${mode == 'MODE_END_SCRIPT'})`)
      }
    })

    /* Procedures: should await for execution! */

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

  }
}
