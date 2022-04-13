/* eslint-disable camelcase */

import * as Blockly from 'blockly/core'
import BlocklyLua from 'blockly/lua'
import 'blockly/javascript';

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

    Blockly.Blocks.mur_thread = {
      init: function () {
        this.appendDummyInput()
          // .appendField(icon('parallel-thread-rotated', 'поток'))
          .appendField(icon('parallel-thread-rotated'), 'поток')
          // .appendField('поток')
          .appendField(new Blockly.FieldTextInput(), 'threadName')

        this.appendStatementInput('STACK').appendField()
        this.setPreviousStatement(false, '')
        this.setNextStatement(false, '')
        this.setInputsInline(true)
        this.setColour(color_spec)
        this.setTooltip('Поток')
      }
    }

    register_proto('mur_thread', (gen) => {
      return (block) => {
        const branch = Blockly.JavaScript.statementToCode(block, 'STACK')
        return `
(async () => {
${branch}
mur.h(_scriptId, null)
})();
`
        // let sleepMs = Math.round(block.getFieldValue('sleepSeconds') * 1000)
        // return makeDelay(gen, sleepMs)
      }
    })

    /* mur.set_power(index, power) */

    Blockly.Blocks.mur_set_power = {
      init: function () {
        this.appendValueInput('Index')
          .setCheck('Number')
          // .appendField('задать на мотор №')
          .appendField(icon('fan', 'движитель'))

        this.appendValueInput('Power')
          .setCheck('Number')
          .appendField(icon('speedometer', 'тяга'))
          // .appendField('тяга')

        this.appendValueInput('Delay')
          .setCheck('Number')
          .appendField(icon('timer', 'длительность'))
        // this.appendDummyInput()
          // .appendField(icon('percent', '%'))
          // .appendField('%')

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_mov)
        this.setTooltip('Задать тягу на движитель')
      }
    }

    register_proto('mur_set_power', (gen) => {
      return (block) => {
        const index = calcVal(gen, block, 'Index')
        const power = calcVal(gen, block, 'Power')
        // let sleepMs = Math.round(calcVal(gen, block, 'Delay') * 1000)
        const sleepMs = calcVal(gen, block, 'Delay')
        return makeFunc(gen, `mur.set_power(${index}, ${power})`) + makeDelay(gen, sleepMs)
      }
    })

    /* mur.actuator(index, power) */

    Blockly.Blocks.mur_actuator = {
      init: function () {
        this.appendValueInput('Index')
          .setCheck('Number')
          .appendField(icon('magnet', 'соленоид'))
          // .appendField('задать на соленоид №')

        this.appendValueInput('Power')
          .setCheck('Number')
          .appendField(icon('speedometer', 'мощность'))
          // .appendField('мощность')

        this.appendValueInput('Delay')
          .setCheck('Number')
          .appendField(icon('timer', 'длительность'))
        // this.appendDummyInput()
          // .appendField(icon('percent', '%'))
          // .appendField('%')

        this.setPreviousStatement(true, 'action')
        this.setNextStatement(true, 'action')
        this.setInputsInline(true)
        this.setColour(color_mov)
        this.setTooltip('Задать мощность на соленоид')
      }
    }

    register_proto('mur_actuator', (gen) => {
      return (block) => {
        const index = calcVal(gen, block, 'Index')
        const power = calcVal(gen, block, 'Power')
        const sleepMs = calcVal(gen, block, 'Delay')
        return makeFunc(gen, `mur.actuator(${index}, ${power})`) + makeDelay(gen, sleepMs)
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
        if (gen === Blockly.JavaScript) {
          return makeFunc(gen, 'while (!mur.get_imu_tap()) {await mur.delay(100);}')
        }

        if (gen === BlocklyLua) {
          return makeFunc(gen, 'while (!mur.get_imu_tap()) do mur.delay(100) end')
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
          .appendField(icon('timer-outline', 'время'))

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

    //
  }
}