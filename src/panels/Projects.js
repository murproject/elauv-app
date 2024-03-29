import App from '/src/App.js';
import Panel from './Panel';
import Icon from '/src/components/Icon';
import Button from '../components/Button';
import ProjectListItem from '/src/components/ProjectItem.js';
import Utils from '/src/utils/Utils';

import GlobalDialog from '/src/components/GlobalDialog.js';
import ProjectsStorage from '/src/utils/ProjectsStorage.js';
import AppVersion from '../utils/AppVersion';

export default class Projects extends Panel {
  begin() {
    this.name = 'Проекты';

    this.html = /*html*/`
      <div class="container">
        <div class="list-wrapper soft-edges-vertical">
          <div id="projects-list" class="width-fill"></div>
        </div>

        <div id="projects-head-buttons" class="row"></div>
      </div>
    `;
  }

  init() {
    this.setIcon('folder-open');
    this.projectsListEl = this.q('#projects-list');

    this.makeButtons();
    this.projectsList = [];
    ProjectsStorage.loadStorage();
    this.displayProjects();

    ProjectsStorage.onChanged = () => {
      if (this.active) {
        this.displayProjects();
      }
    };
  }

  onActiveChanged(active) {
    if (active) {
      this.displayProjects();
    }
  }

  makeButtons() {
    this.headButtonsEl = this.q('#projects-head-buttons');

    const buttons = [
      {
        name: 'save-as-new',
        icon: 'content-save',
        text: 'Сохранить новый',
        classes: 'button-vertical',
        action: () => App.panels.blockly.save(true),
      },
      {
        name: 'import',
        icon: 'import',
        text: 'Импорт из&nbsp;файла',
        classes: 'button-vertical',
        ignore: !App.isMobile,
        action: () => ProjectsStorage.importProject(),
      },
      {
        name: 'export',
        icon: 'export',
        text: 'Экспорт в&nbsp;файл',
        classes: 'button-vertical',
        ignore: !App.isMobile,
        action: () => ProjectsStorage.exportAllProjects(),
      },
      {
        name: 'wipe',
        icon: 'trash-can-outline',
        iconColor: 'red',
        text: 'Удалить всё',
        classes: 'button-vertical',
        action: () => this.openWipeAllDialog(),
      },
    ];

    buttons.forEach((config) => {
      new Button(config).inject(this.headButtonsEl);
    });
  }

  addItem(item, action = undefined) {
    this.projectsListEl.appendChild(new ProjectListItem(item, action));
  }

  displayProjects() {
    this.headButtonsEl.classList.remove('hidden');
    this.updateTitle('Проекты');

    this.projectsListEl.innerText = '';

    if (AppVersion.isDevBuild) {
      this.addItem({
        name: 'Примеры',
        type: 'folderExamples',
      }, () => this.displayExamples());
    }

    this.addItem({
      type: 'projectNew',
      name: 'Новый проект',
    }, () => this.openProject({
      name: '',
      id: Utils.generateId(),
      data: {},
      date: Date.now(),
    }));

    if ('data' in ProjectsStorage.projects.autosaved) {
      this.addItem({
        type: 'autosave',
        name: ProjectsStorage.projects.autosaved.name,
        date: ProjectsStorage.projects.autosaved.date,
      }, () => this.openProjectDialog(ProjectsStorage.projects.autosaved));
    }

    ProjectsStorage.projects.savedSorted.forEach((item, index) => {
      item = ProjectsStorage.projects.saved[item.id];
      item.type = item.id === ProjectsStorage.projects.current.id ? 'projectActive' : 'project';
      this.addItem(item, () => {
        this.openProjectDialog(item);
      });
    });
  }

  displayExamples() {
    this.headButtonsEl.classList.add('hidden');
    this.updateTitle('Примеры');

    this.projectsListEl.innerText = '';

    this.addItem({
      type: 'return',
      name: 'Назад',
      description: 'Вернуться в список проектов',
    }, () => this.displayProjects());

    ProjectsStorage.projects.examples.forEach((item) => {
      item.type = 'example';
      this.addItem(item, () => this.openExampleDialog(item));
    });
  }

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
            }, () => this.openProject(item)),
            new Button({
              text: 'Назад',
              icon: 'keyboard-return',
            }, () => App.closeGlobalDialog()),
          ],
        }),
    );
  }

  openProjectDialog(item) {
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
            }, () => this.openProject(item)),
            new Button({
              text: 'В файл',
              icon: 'export',
              classes: 'button-vertical',
              ignore: !App.isCordova,
            }, () => ProjectsStorage.exportProject(item)),
            new Button({
              text: 'Удалить',
              icon: 'trash-can',
              iconColor: 'red',
              classes: 'button-vertical',
            }, () => this.openConfirmDeleteDialog(item)),
            new Button({
              text: 'Назад',
              icon: 'keyboard-return',
              classes: 'button-vertical',
            }, () => App.closeGlobalDialog()),
          ],
        }),
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
              text: 'Удалить всё',
              icon: 'trash-can',
              iconColor: 'red',
            }, () => this.deleteAllProjects()),
            new Button({
              text: 'Назад',
              icon: 'keyboard-return',
            }, () => App.closeGlobalDialog()),
          ],
        }),
    );
  }

  openProject(item) {
    App.closeGlobalDialog();
    this.openConfirmUnsavedDialog(() => ProjectsStorage.loadProject(item));
  }

  deleteProject(item) {
    App.closeGlobalDialog();
    if ('type' in item && item.type === 'autosave') {
      ProjectsStorage.deleteProject('autosave');
    } else {
      ProjectsStorage.deleteProject(item.id);
    }
  }

  deleteAllProjects() {
    App.closeGlobalDialog();
    ProjectsStorage.deleteAllProjects();
  }

  openConfirmUnsavedDialog(action) {
    if (!App.panels.blockly.wasTouched) {
      action();
      return;
    }

    App.showGlobalDialog(
        new GlobalDialog({
          title: 'Редактируемый проект<br>будет закрыт!',
          text: 'Несохранённые изменения<br>будут безвозвратно удалены.',
          classes: 'text-center',
          buttons: [
            new Button({
              text: 'Открыть',
              icon: 'puzzle',
            }, () => {
              App.closeGlobalDialog(); action();
            }),
            new Button({
              text: 'Назад',
              icon: 'keyboard-return',
            }, () => App.closeGlobalDialog()),
          ],
        }),
    );
  }

  openConfirmDeleteDialog(item) {
    App.closeGlobalDialog();

    const isAutosave = 'type' in item && item.type === 'autosave';
    const projectName = item.name ? item.name : 'без названия';
    const name = isAutosave ? `авто-сохранённый проект<br>«${projectName}»` : `проект<br>«${projectName}»`;

    App.showGlobalDialog(
        new GlobalDialog({
          title: 'Действительно удалить проект?',
          text: `Будет удалён ${name}`,
          classes: 'text-center',
          buttons: [
            new Button({
              text: 'Удалить',
              icon: 'trash-can',
              iconColor: 'red',
            }, () => this.deleteProject(item) ),
            new Button({
              text: 'Назад',
              icon: 'keyboard-return',
            }, () => App.closeGlobalDialog()),
          ],
        }),
    );
  }
}
