import '@blockly/block-plus-minus';

function placeholderNum (defaultNum) {
  return { block: { type: 'mur_number', fields: { Value: defaultNum } } }
}

function shadowSlider() {
  return { shadow: { type: 'mur_number_slider', fields: { Value: 0 } } };
}

const MurToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Фигня',
      colour: 70,
      contents: [
        // { kind: 'block', type: 'text' },
        // { kind: 'block', type: 'text_print' },
        {
          kind: 'block',
          type: 'mur_delay',
          inputs: {
            sleepSeconds: placeholderNum(1)
          }
        },
        { kind: 'block', type: 'mur_set_led' },
        { kind: 'block', type: 'mur_end_thread' },
        { kind: 'block', type: 'mur_sensor_color_wait' },
        { kind: 'block', type: 'mur_get_color' },
        { kind: 'block', type: 'mur_get_imu_tap' },
        { kind: 'block', type: 'mur_wait_imu_tap' },
        { kind: 'block', type: 'mur_get_imu_axis' },
        { kind: 'block', type: 'mur_loop_infinite' },
        {
          kind: 'block',
          type: 'mur_loop_timeout',
          inputs: {
            Delay: placeholderNum(2)
          }
        }
      ]
    },

    {
      kind: 'category',
      name: 'Движение',
      colour: 20,
      contents: [

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
            Angle: shadowSlider() // TODO: slider -180 ~ +180
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
    },

    {
      kind: 'category',
      name: 'Логика',
      categorystyle: 'logic_category',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'controls_if', "extraState": {"hasElse": true} },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
        // { kind: 'block', type: 'logic_null' },
        { kind: 'block', type: 'logic_ternary' }
      ]
    },

    {
      kind: 'category',
      name: 'Математика',
      categorystyle: 'math_category',
      contents: [
        // { kind: 'block', type: 'mur_number_slider' },
        { kind: 'block', type: 'mur_number' },
        { kind: 'block', type: 'math_number' },
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
    },

    {
      kind: 'category',
      name: 'Циклы',
      categorystyle: 'loop_category',
      contents: [
        { kind: 'block', type: 'controls_repeat_ext' },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for' },
        // { kind: 'block', type: 'controls_forEach' },
        { kind: 'block', type: 'controls_flow_statements' }
      ]
    },

    {
      kind: 'category',
      name: 'Цвета',
      categorystyle: 'colour_category',
      contents: [
        { kind: 'block', type: 'colour_picker' },
        { kind: 'block', type: 'colour_random' },
        { kind: 'block', type: 'colour_rgb' },
        // { kind: 'block', type: 'colour_blend' },
      ]
    },

    {
      kind: 'category',
      name: 'Переменные',
      custom: 'VARIABLE',
      categorystyle: 'variable_category'
    },

    {
      kind: 'category',
      name: 'Функции',
      custom: 'PROCEDURE',
      categorystyle: 'procedure_category'
    }
  ]
}

export default MurToolbox
