import Element from './Element.js';
import Icon from '/src/components/Icon';
import Utils from '/src/utils/Utils';

export default class TelemetryPanel extends Element {
  static get defaultClasses() {
    return [];
  }

  static get tag() {
    return 'telemetry-table';
  }

  static get defaultAttrs() {
    return {
      telemetry: null,
      stats: null,
    };
  }

  makeRow(name, value) {
    return /*html*/`
      <tr>
        <td>
          ${name}
        </td>
        <td>
          ${value}
        </td>
      </tr>
    `;
  }

  render() {
    const t = this.attrs.telemetry;
    const s = this.attrs.stats;

    console.log(t);
    console.log(s);

    return /*html*/`
      <div>
        <table>
          ${this.makeRow('Курс', t.imuYaw.toFixed(2))}
          ${this.makeRow('Заряд', t.battRsoc.toFixed(0) + '%')}
        </table>

        ${ JSON.stringify(t, null, ' ') }
      </div>
    `;
  }
}

TelemetryPanel.register();
