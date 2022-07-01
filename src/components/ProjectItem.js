import Element from './Element.js'
import Icon from '/src/components/Icon'
import Utils from "/src/utils/Utils";

const icons = {
  project:        Icon('puzzle', 'opacity-50'),
  projectActive:  Icon('puzzle-edit', 'cyan opacity-75'),
  projectNew:     Icon('puzzle-outline', 'dark opacity-50'),
  autosave:       Icon('clock-time-three-outline', 'opacity-50'),
  folderExamples: Icon('folder-outline', 'dark opacity-50'),
  example:        Icon('star', 'opacity-50'),
  return:         Icon('keyboard-backspace', 'opacity-50'),
};

export default class ProjectListItem extends Element {
  static get defaultClasses() {
    return ['list-item'];
  }

  static get tag() {
    return 'project-list-item'
  }

  init() {
    this.actionTimeout = 50;
  }

  static get defaultAttrs() {
    return {
      type: 'project',
      name: {},
      date: null,
      description: '',
    };
  }

  render() {
    const icon = icons[this.attrs.type];
    this.setClass('active', this.attrs.type === 'projectActive');

    const dateAbsolute = Utils.notNull(Utils.dateStringAbsolute(this.attrs.date));
    const dateRelative = Utils.notNull(Utils.dateStringRelative(this.attrs.date));
    const description = Utils.notNull(this.attrs.description);

    return /*html*/`
      ${icon}

      <div class="list-item-title">
        ${this.attrs.name ? this.attrs.name : '(без названия)'}
      </div>

      <div class="dateRelative opacity-50">
        ${description}
      </div>

      <div class="dateRelative opacity-50">
        ${dateRelative}
      </div>

      <div class="dateAbsolute ${!dateAbsolute ? 'hidden' : ''}">
        ${dateAbsolute}
      </div>

      <br><br>
    `;
  }

}

ProjectListItem.register();