import App from "/src/App.js";
import Panel from './Panel'
import Icon from '/src/components/Icon'
import Button from '../components/Button';
import ProjectListItem from '/src/components/ProjectItem.js'
import Utils from '/src/utils/Utils';

import GlobalDialog from '/src/components/GlobalDialog.js';
import ProjectsStorage from '/src/utils/ProjectsStorage.js'

export default class Projects extends Panel {

  begin() {
    this.name = "Проекты";

    this.html = /*html*/`
      <div class="container">
        <div class="list-wrapper soft-edges-vertical">
          <div id="projects-list" class="width-fill"></div>
        </div>

        <div id="projects-head-buttons" class="row"></div>
      </div>
    `

    // document.p = ProjectItem;
  }

  init() {
    this.setIcon('folder-open');
    this.projectsListEl = this.q('#projects-list');
    // this.headerTitleEl = this.q('#projects-header-title');

    this.makeButtons();
    this.projectsList = [];
    ProjectsStorage.loadSavedProjects();
    // this.loadProjectsList(true);
    this.displayProjects();
  }

  makeButtons() {
    this.headButtonsEl = this.q('#projects-head-buttons')

    const buttons = [
      {
        name: 'save',
        icon: 'content-save',
        text: 'Сохранить',
        classes: 'button-vertical',
        action: () => { }, // TODO //
      },
      {
        name: 'import',
        icon: 'import',
        text: 'Импорт из&nbsp;файла',
        classes: 'button-vertical',
        action: () => { }, // TODO //
      },
      {
        name: 'export',
        icon: 'export',
        text: 'Экспорт в&nbsp;файл',
        classes: 'button-vertical',
        action: () => { }, // TODO //
      },
      {
        name: 'wipe',
        icon: 'trash-can-outline',
        iconColor: 'red',
        text: 'Удалить всё',
        classes: 'button-vertical',
        action: () => this.openWipeAllDialog(), // TODO //
      },
    ];

    buttons.forEach(config => {
      new Button(config).inject(this.headButtonsEl)
    });
  }

  // loadProjectsList(populate = false) {
  //   this.projectsList = example; // TODO
  //   // if (populate) {
  //   //   for (let i = 0; i < 22; i++) {
  //   //     let name = '';
  //   //     const iter = Math.round(Math.random() * 6) + 1
  //   //     for (let j = 0; j < iter; j++) {
  //   //       name += Math.random().toString(36).slice(2, Math.random() * 8 + 3) + ' ';
  //   //     }
  //   //     const item = {
  //   //       name: name,
  //   //       date: new Date(+new Date - Math.round(Math.random() * 100000000000)),
  //   //       data: {},
  //   //     };
  //   //     this.projectsList.push(item);
  //   //   }
  //   // }
  //   this.projectsList = this.projectsList.sort((a, b) => b.date - a.date);
  // }

  updateTitle(title) {
    this.name = title;
    if (this.active) {
      this.setActive(true);
    }
  }

  addItem(item, action = undefined) {
    this.projectsListEl.appendChild(new ProjectListItem(item, action));
  }

  displayProjects() {
    this.headButtonsEl.classList.remove('hidden');
    this.updateTitle('Проекты');

    this.projectsListEl.innerText = '';

    this.addItem({
      name: 'Примеры',
      type: 'folderExamples'
    }, () => this.displayExamples());

    this.addItem({
      type: 'projectNew',
      name: 'Новый проект',
    }, () => this.openProject({
      name: '',
      id: Utils.generateId(),
      data: {},
      date: Date.now(),
    }));

    if ('data' in ProjectsStorage.autosave) {
      this.addItem({
        type: 'autosave',
        name: ProjectsStorage.autosave.name,
        date: ProjectsStorage.autosave.date,
      }, () => this.openProjectDialog(ProjectsStorage.autosave));
    }

    ProjectsStorage.saved.forEach((item, index) => {
      const isEditing = index == 1; // TODO - TODO - TODO //
      item.type = isEditing ? 'projectActive' : 'project';
      this.addItem(item, () => {this.openProjectDialog(item)});
    });
  }

  displayExamples() {
    this.headButtonsEl.classList.add('hidden');
    this.updateTitle('Примеры');

    this.projectsListEl.innerText = '';

    this.addItem({
      type: 'return',
      name: 'Назад',
      description: 'Вернуться в список проектов'
    }, () => this.displayProjects());

    ProjectsStorage.examples.forEach((item, index) => {
      item.type = 'example';
      this.addItem(item, () => this.openExampleDialog(item));
    });
  }

  // projectListSelect(index) {
  //   setTimeout(() => {
  //     console.log(this.projectsList[index]);
  //     this.openProjectDialog(index);
  //   }, 75);
  // }

  openExampleDialog(item) {
    App.showGlobalDialog(
      new GlobalDialog({
        closable: true,
        title: item.name.length > 0 ? item.name : '(без названия)',
        text: item.description,
        classes: 'text-center',
        buttons: [
          new Button({
            text: 'Открыть',
            icon: 'puzzle',
          }, () => this.openProject(item)), // TODO //
          new Button({
            text: 'Назад',
            icon: 'keyboard-return',
          }, () => App.closeGlobalDialog()),
        ]
      })
    );
  }

  openProjectDialog(item) {
    // const item = ProjectsStorage.saved[index];

    App.showGlobalDialog(
      new GlobalDialog({
        closable: true,
        title: item.name.length > 0 ? item.name : '(без названия)',
        text: /*html*/`
          Дата изменения: ${Utils.dateStringAbsolute(item.date)}
        `,
        classes: 'text-center',
        buttons: [
          new Button({
            text: 'Открыть',
            icon: 'puzzle',
            classes: 'button-vertical',
          }, () => this.openProject(item)), // TODO //
          new Button({
            text: 'В файл',
            icon: 'export',
            classes: 'button-vertical',
          }, () => App.closeGlobalDialog()),
          new Button({
            text: 'Удалить',
            icon: 'trash-can',
            iconColor: 'red',
            classes: 'button-vertical',
          }, () => App.closeGlobalDialog()),
          new Button({
            text: 'Назад',
            icon: 'keyboard-return',
            classes: 'button-vertical',
          }, () => App.closeGlobalDialog()),
        ]
      })
    );
  }

  openWipeAllDialog() {
    App.showGlobalDialog(
      new GlobalDialog({
        title: 'Удалить все проекты?',
        text: 'Все пользовательские проекты<br>будут безвозвратно удалены.',
        classes: 'text-center',
        buttons: [
          new Button({
            text: 'Да, удалить',
            icon: 'trash-can',
            iconColor: 'red',
          }, () => App.closeGlobalDialog()), // TODO //
          new Button({
            text: 'Назад',
            icon: 'keyboard-return',
          }, () => App.closeGlobalDialog()),
        ]
      })
    );
  }

  openProject(item) {
    App.closeGlobalDialog();
    this.openConfirmUnsavedDialog(() => ProjectsStorage.loadProject(item));
  }

  openConfirmUnsavedDialog(action) {
    App.showGlobalDialog(
      new GlobalDialog({
        title: 'Редактируемый проект<br>будет закрыт!',
        text: 'Несохранённые изменения<br>будут безвозвратно удалены.',
        classes: 'text-center',
        buttons: [
          new Button({
            text: 'Открыть',
            icon: 'puzzle',
          }, () => { App.closeGlobalDialog(); action() }), // TODO //
          new Button({
            text: 'Назад',
            icon: 'keyboard-return',
          }, () => App.closeGlobalDialog()),
        ]
      })
    );
  }

}