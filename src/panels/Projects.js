import Panel from './Panel'
import Icon from '/src/components/Icon'
import Button from '../components/Button';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/ru'

dayjs.locale('ru');
dayjs.extend(relativeTime)
dayjs.extend(isBetween)

let example = [
  {
    name: 'Тестовый проект',
    date: new Date(Date.parse('2022-06-25T16:34:56+1000')),
    data: {},
  },
  {
    name: 'Интересная программа',
    date: new Date(Date.parse('2022-06-06T09:02:43+1000')),
    data: {},
  },
  {
    name: 'Урок по регуляторам',
    date: new Date(Date.parse('2022-06-21T18:10:09+1000')),
    data: {},
  },
  {
    name: 'Проверка движителей',
    date: new Date(Date.parse('2022-06-27T11:25:17+1000')),
    data: {},
  },
];

export default class Projects extends Panel {

  begin() {
    this.html = /*html*/`
      <div id="projects-head-buttons" class="row font-thin">
        <div class="push-button button-vertical" id="">
          ${Icon('content-save')}
          <span class="caption">Сохранить</span>
        </div>

        <div class="push-button button-vertical" id="">
          ${Icon('import')}
          <span class="caption">Импорт из файла</span>
        </div>

        <div class="push-button button-vertical" id="">
          ${Icon('export')}
          <span class="caption">Экспорт в файл</span>
        </div>
      </div>

      <div class="list-wrapper row">
        <div id="projects-list" class="width-fill"></div>
      </div>
    `
  }

  init() {
    this.setIcon('folder-open');
    this.projectsListEl = this.q('#projects-list');
    this.headButtonsEl = this.q('#projects-head-buttons')

    new Button({
      name: 'save',
      text: 'Сохранить',
      type: 'push-button',
      action: () => {},
      icon: 'content-save',
    }).inject(this.headButtonsEl);

    this.projectsList = [];
    this.loadProjectsList();
    this.displayProjects();
  }

  loadProjectsList() {
    this.projectsList = example; // TODO
    this.projectsList = this.projectsList.sort((a, b) => b.date - a.date);
  }

  displayProjects() {
    this.projectsListEl.innerHtml = '';

    function dateString(date) {
      return dayjs(date).format('D MMMM<br>HH:mm');
    }

    function dateRelative(date) {
      return dayjs(date).format('dddd<br>') + dayjs(date).fromNow();
    }

    this.projectsList.forEach((item, index) => {
      const isEditing = index == 1; // TODO //

      let itemEl = document.createElement("div");
      itemEl.classList.add("list-item");

      if (isEditing) {
        itemEl.classList.add("active");
      }

      itemEl.innerHTML = `
        <!-- ${Icon('file-table-outline', 'opacity-75')} -->

        ${Icon(isEditing ? 'puzzle-edit' : 'puzzle', isEditing ? 'cyan opacity-75' : 'opacity-50')}

        <div class="list-item-title">
          ${item.name}
        </div>

        <div class="dateRelative">
          <span class="opacity-50">${dateRelative(item.date)}</span>
        </div>

        <div class="dateAbsolute">
          <span>${dateString(item.date)}</span>
        </div>

        <div class="icon-button">
          ${Icon('trash-can-outline', 'red opacity-75')}
        </div>
      `;

      itemEl.onclick = () => this.projectSelect(index);
      this.projectsListEl.appendChild(itemEl);
    });
  }

  projectSelect(index) {
    console.log(this.projectsList[index]);
  }

}