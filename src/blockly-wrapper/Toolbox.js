import '@blockly/block-plus-minus';
import Blocks from '../blockly-wrapper/Blocks'

Blocks.init();


function placeholderNum (defaultNum = 0) {
  return { block: { type: 'mur_number', fields: { Value: defaultNum } } }
}


function shadowNum (defaultNum = 0) {
  return { shadow: { type: 'mur_number', fields: { Value: defaultNum } } }
}


function shadowSlider(type = undefined) {
  if (type === 'yaw') {
    return { shadow: { type: 'mur_number_slider_yaw', fields: { Value: 0 } } };
  }
  return { shadow: { type: 'mur_number_slider', fields: { Value: 0 } } };
}


function makeCategory(name, colour, contents) {
  return {
    kind: 'category',
    name: name,
    colour: colour,
    contents: contents,
  }
}


const CategorySensors = makeCategory(
  'Датчики', Blocks.colours.sensors, [
    { kind: 'block', type: 'mur_get_color' },
    { kind: 'block', type: 'mur_sensor_color_wait' },
    { kind: 'block', type: 'mur_get_imu_tap' },
    { kind: 'block', type: 'mur_wait_imu_tap' },
    { kind: 'block', type: 'mur_get_imu_axis' },
  ]
);


const CategoryMovements = makeCategory(
  'Движение', Blocks.colours.mov, [
    {
      kind: 'block',
      type: 'mur_set_axis',
      inputs: {
        Power: shadowSlider()
      }
    },

    {
      kind: 'block',
      type: 'mur_set_yaw',
      inputs: {
        Angle: shadowSlider('yaw')
      }
    },

    {
      kind: 'block',
      type: 'mur_set_power',
      inputs: {
        Power: shadowSlider(),
      },
      fields: {
        Index: 'MOTOR_A'
      }
    },

    {
      kind: 'block',
      type: 'mur_stop_motors'
    },

    {
      kind: 'block',
      type: 'mur_actuator',
    },
  ]
);


const CategoryLogic = makeCategory(
  'Логика', Blocks.colours.logic, [
    { kind: 'block', type: 'controls_if' },
    { kind: 'block', type: 'controls_if', "extraState": {"hasElse": true} },
    { kind: 'block', type: 'logic_compare' },
    { kind: 'block', type: 'logic_operation' },
    { kind: 'block', type: 'logic_negate' },
    { kind: 'block', type: 'logic_boolean' },
    // { kind: 'block', type: 'logic_null' },
    { kind: 'block', type: 'logic_ternary' }
  ]
);


const CategoryMath = makeCategory(
  'Математика', Blocks.colours.math, [
    // { kind: 'block', type: 'mur_number_slider' },
    { kind: 'block', type: 'mur_number' },
    // { kind: 'block', type: 'math_number' },
    { kind: 'block', type: 'math_arithmetic' },
    // { kind: 'block', type: 'math_single' },
    // { kind: 'block', type: 'math_trig' },
    // { kind: 'block', type: 'math_constant' },
    { kind: 'block', type: 'math_number_property' },
    { kind: 'block', type: 'math_round' },
    // { kind: 'block', type: 'math_on_list' },
    { kind: 'block', type: 'math_modulo' },
    { kind: 'block', type: 'math_constrain' },
    { kind: 'block', type: 'math_random_int' },
    // { kind: 'block', type: 'math_random_float' }
  ]
);


const CategoryLoop = makeCategory(
  'Циклы', Blocks.colours.loop, [
    { kind: 'block', type: 'mur_loop_infinite' },
    { kind: 'block', type: 'mur_loop_timeout', inputs: { Delay: placeholderNum(2) } },
    { kind: 'block', type: 'controls_repeat_ext' },
    { kind: 'block', type: 'controls_whileUntil' },
    { kind: 'block', type: 'controls_for' },
    // { kind: 'block', type: 'controls_forEach' },
    { kind: 'block', type: 'controls_flow_statements' }, // TODO: incompatible with mur_loops!
  ]
);


const CategoryColour = makeCategory(
  'Цвета', Blocks.colours.colour, [
    {
      kind: 'block',
      type: 'mur_set_led',
      inputs: {
        Index: shadowNum(0),
        Colour:  { shadow: { type: 'colour_picker', fields: { COLOUR: '#ffff00' } } }
      }
    },
    { kind: 'block', type: 'colour_picker', fields: { COLOUR: '#ffff00' } },
    { kind: 'block', type: 'colour_random' },
    { kind: 'block', type: 'colour_rgb' },
    // { kind: 'block', type: 'colour_blend' },
  ]
);

const CategoryFlow = makeCategory(
  'Управление', Blocks.colours.flow, [
    {
      kind: 'block',
      type: 'mur_delay',
      inputs: {
        sleepSeconds: placeholderNum(1)
      }
    },
    { kind: 'block', type: 'mur_end_thread' },
    { kind: 'block', type: 'mur_get_timestamp' },
  ]
);

const CategoryVariables = {
  kind: 'category',
  name: 'Переменные',
  custom: 'VARIABLE',
  categorystyle: 'variable_category'
}


const CategoryProcedures = {
  kind: 'category',
  name: 'Функции',
  custom: 'PROCEDURE',
  categorystyle: 'procedure_category'
}


const MurToolbox = {
  kind: 'categoryToolbox',
  contents: [
    CategoryFlow,
    CategoryMovements,
    CategorySensors,
    CategoryLogic,
    CategoryLoop,
    CategoryMath,
    CategoryColour,
    CategoryVariables,
    CategoryProcedures,
  ]
}

export default MurToolbox
