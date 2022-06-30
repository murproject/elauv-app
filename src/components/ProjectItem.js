import Element from './Element.js'
import Icon from '/src/components/Icon'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/ru'

dayjs.locale('ru');
dayjs.extend(relativeTime)
dayjs.extend(isBetween)

function dateString(date) {
  return dayjs(date).format('D MMMM<br>HH:mm');
}

function dateRelative(date) {
  return dayjs(date).format('dddd<br>') + dayjs(date).fromNow();
}

export default class ProjectListItem extends Element {
  static get defaultClasses() {
    return ['list-item'];
  }

  static get tag() {
    return 'project-list-item'
  }

  static get defaultAttrs() {
    return {
      type: 'project',
      name: {},
      date: Date.now(),
      active: false,
    };
  }

  render() {
    const icon = Icon(
      this.attrs.isEditing ? 'puzzle-edit' : 'puzzle',
      this.attrs.isEditing ? 'cyan opacity-75' : 'opacity-50'
    );

    if (this.attrs.active) {
      this.classList.add('active');
    }

    return /*html*/`
      ${icon}

      <div class="list-item-title">
        ${this.attrs.name ? this.attrs.name : '(без названия)'}
      </div>

      <div class="dateRelative">
        <span class="opacity-50">${dateRelative(this.attrs.date)}</span>
      </div>

      <div class="dateAbsolute">
        <span>${dateString(this.attrs.date)}</span>
      </div>
    `;
  }

}

ProjectListItem.register();