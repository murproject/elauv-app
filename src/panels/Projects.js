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

function dateString(date) {
  return dayjs(date).format('D MMMM<br>HH:mm');
}


function dateRelative(date) {
  return dayjs(date).format('dddd<br>') + dayjs(date).fromNow();
}

export default class Projects extends Panel {

  begin() {
    this.html = /*html*/`
      <div id="projects-head-buttons" class="row font-thin"></div>

      <div class="list-wrapper row">
        <div id="projects-list" class="width-fill"></div>
      </div>
    `
  }

  init() {
    this.setIcon('folder-open');
    this.projectsListEl = this.q('#projects-list');
    this.makeButtons();
    this.projectsList = [];
    this.loadProjectsList();
    this.displayProjects();
  }

  makeButtons() {
    this.headButtonsEl = this.q('#projects-head-buttons')

    new Button({
      name: 'save',
      text: 'Сохранить',
      action: () => {},
      // classes: 'button-vertical',
      icon: 'content-save',
    }).inject(this.headButtonsEl);

    new Button({
      name: 'import',
      text: 'Импорт из файла',
      action: () => {},
      // classes: 'button-vertical',
      icon: 'import',
    }).inject(this.headButtonsEl);

    new Button({
      name: 'export',
      text: 'Экспорт в файл',
      action: () => {},
      // classes: 'button-vertical',
      icon: 'export',
    }).inject(this.headButtonsEl);
  }

  loadProjectsList() {
    this.projectsList = example; // TODO
    // for (let i = 0; i < 100; i++) {
    //   let name = '';
    //   const iter = Math.round(Math.random() * 6) + 1
    //   for (let j = 0; j < iter; j++) {
    //     name += Math.random().toString(36).slice(2, Math.random() * 8 + 3) + ' ';
    //   }
    //   const item = {
    //     name: name,
    //     date: new Date(+new Date - Math.round(Math.random() * 10000000000)),
    //     data: {},
    //   };
    //   this.projectsList.push(item);
    // }
    this.projectsList = this.projectsList.sort((a, b) => b.date - a.date);
  }

  makeProjectItem(item, index) {
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

    return itemEl;
  }

  makeExamplesItem() {
    let itemEl = document.createElement("div");
    itemEl.classList.add("list-item");

    itemEl.innerHTML = `
      ${Icon('folder', 'dark opacity-50')}
      <div class="list-item-title">Примеры</div>

      <div class="dateAbsolute">
        <span><br><br></span>
      </div>

      <div class="dateRelative">
        <span class="opacity-50">Встроенные примеры программ</span>
      </div>
    `;

    itemEl.onclick = () => this.displayProjects(true); // TODO //
    return itemEl;
  }

  displayProjects(showExamples = false) {
    this.projectsListEl.innerHtml = '';
    this.projectsListEl.innerText = '';
    this.projectsListEl.appendChild(this.makeExamplesItem());

    this.projectsList.forEach((item, index) => {
      this.projectsListEl.appendChild(this.makeProjectItem(item, index));
    });
  }

  projectSelect(index) {
    console.log(this.projectsList[index]);
  }

}