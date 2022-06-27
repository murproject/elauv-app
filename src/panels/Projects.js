import Panel from './Panel'
import Icon from '/src/components/Icon'

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
      <div class="row font-thin">
        <div class="text" style="display: flex; align-items: center"><span>Projects</span></div>
        <div class="push-button" id="">Сохранить</div>
        <div class="push-button" id="">Импорт</div>
        <div class="push-button" id="">Экспорт</div>
      </div>

      <div class="list-wrapper row">
        <div id="projects-list" class="width-fill"></div>
      </div>

    `
  }

  init() {
    this.setIcon('folder-open');
    this.projectsListEl = this.q("#projects-list");

    this.projectsList = [];
    this.loadProjectsList();
    this.displayProjects();
  }

  loadProjectsList() {
    this.projectsList = example;
    this.projectsList = this.projectsList.sort((a, b) => a.date - b.date);
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
      let itemEl = document.createElement("div");
      itemEl.classList.add("list-item");

      itemEl.innerHTML = `
        <!-- ${Icon('file-table-outline', 'opacity-75')} -->

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