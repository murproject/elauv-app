function placeholderNum (defaultNum) {
  return { block: { type: 'math_number', fields: { NUM: defaultNum } } }
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
        { kind: 'block', type: 'mur_thread' },
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

        // {
        //   kind: 'block',
        //   type: 'mur_set_axis',
        //   inputs: {
        //     Power: placeholderNum(50)
        //   }
        // },

        // {
        //   kind: 'block',
        //   type: 'mur_set_axis_wait',
        //   inputs: {
        //     Power: placeholderNum(50),
        //     Delay: placeholderNum(0.5)
        //   }
        // },

        // {
        //   kind: 'block',
        //   type: 'mur_set_yaw',
        //   inputs: {
        //     Angle: placeholderNum(0)
        //   }
        // },

        {
          kind: 'block',
          type: 'mur_set_power',
          inputs: {
            Index: placeholderNum(0),
            Power: placeholderNum(20),
            Delay: placeholderNum(0)
          }
        },

        {
          kind: 'block',
          type: 'mur_actuator',
          inputs: {
            Index: placeholderNum(0),
            Power: placeholderNum(75),
            Delay: placeholderNum(0.5)
          }
        },

        {
          kind: 'block',
          type: 'mur_stop_motors'
        }

      ]
    },

    {
      kind: 'category',
      name: 'Логика',
      categorystyle: 'logic_category',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
        { kind: 'block', type: 'logic_null' },
        { kind: 'block', type: 'logic_ternary' }
      ]
    },

    {
      kind: 'category',
      name: 'Математика',
      categorystyle: 'math_category',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'math_single' },
        { kind: 'block', type: 'math_trig' },
        { kind: 'block', type: 'math_constant' },
        { kind: 'block', type: 'math_number_property' },
        { kind: 'block', type: 'math_round' },
        { kind: 'block', type: 'math_on_list' },
        { kind: 'block', type: 'math_modulo' },
        { kind: 'block', type: 'math_constrain' },
        { kind: 'block', type: 'math_random_int' },
        { kind: 'block', type: 'math_random_float' }
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
        { kind: 'block', type: 'controls_forEach' },
        { kind: 'block', type: 'controls_flow_statements' }
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
