import App from '/src/App.js';
import Utils from './Utils.js';
import ProjectsExamples from './ProjectsExamples.js';

import GlobalDialog from '/src/components/GlobalDialog.js';
import Button from '/src/components/Button.js';

const emptyAutosaved = {
  type: 'autosave',
  name: '',
  date: 0,
};

function makeEmptyProject(isAutosave = false) {
  if (isAutosave) {
    return {
      type: 'autosave',
      name: '',
      date: 0,
    };
  } else {
    return {
      id: Utils.generateId(),
      name: '',
      date: Date.now(),
      data: {},
      autosaved: true,
    };
  }
}

export default {
  projects: {
    examples: ProjectsExamples,
    saved: {},
    savedSorted: [],
    autosaved: makeEmptyProject(true),
    current: makeEmptyProject(),
    emptyCounter: 1,
    backpack: [],
  },

  onChanged() {},

  loadStorage() {
    document.storage = this;

    console.warn(this.currentProject);

    this.projects.saved = JSON.parse(Utils.notNull(localStorage.savedProjects, '{}'));
    // this.projects.saved = example;
    console.log(this.projects.saved);

    if (!this.projects.saved || typeof(this.projects.saved) !== 'object') {
      this.projects.saved = {};
      localStorage.savedProjects = JSON.stringify({});
      this.saveStorage();
    }

    if (localStorage.autosavedProject) {
      this.projects.autosaved = JSON.parse(localStorage.autosavedProject);
    }

    this.projects.emptyCounter = Utils.notNull(localStorage.emptyCounter, 1);

    this.projects.savedSorted = [];

    for (const id in this.projects.saved) {
      this.projects.savedSorted.push({
        id: id,
        date: this.projects.saved[id].date,
      });

      this.projects.saved[id].id = id;
    }

    this.projects.savedSorted = this.projects.savedSorted.sort((a, b) => b.date - a.date);

    this.projects.backpack = JSON.parse(localStorage.backpack ? localStorage.backpack : '[]');
  },

  setCurrentProject(item) {
    // item.id = Utils.notNull(item.id, Utils.generateId());
    this.projects.current = item;
    console.log(item.id);
    this.projects.current.autosaved = true;
    // this.projects.autosaved.id = item.id
    this.onChanged();
    console.log(item);
  },

  loadProject(item) {
    // TODO: what if script is running? 1) forbid; 2) stop script.

    item = JSON.parse(JSON.stringify(item)); // depp clone
    this.setCurrentProject(item);
    App.closeGlobalDialog();
    App.panels.blockly.load(item.data);
    App.panelSelect(App.panels.blockly);
  },

  autoSave() {
    this.projects.autosaved.type = 'autosave';
    this.projects.autosaved.id = this.projects.current.id;
    this.projects.autosaved.name = this.projects.current.name;
    this.projects.autosaved.data = this.projects.current.data;
    this.projects.autosaved.date = Date.now();
    this.projects.current.autosaved = true;
    this.saveStorage();
    this.onChanged();
  },

  saveProject(forcedNew = false) {
    if ((this.projects.current.id in this.projects.saved) && !forcedNew) {
      // this.autoSave();
      if (!this.projects.current.name || this.projects.current.name.length == 0) {
        this.projects.current.name = 'Проект №' + this.projects.emptyCounter;
        this.projects.emptyCounter++;
      }

      this.projects.current.description = '';
      this.projects.current.date = Date.now();
      this.projects.saved[this.projects.current.id] = JSON.parse(JSON.stringify(this.projects.current));
      this.projects.current.autosaved = true;

      this.saveStorage();
      App.closeGlobalDialog();
    } else {
      let projectName = '';

      App.showGlobalDialog(
          new GlobalDialog({
            title: 'Введите имя проекта',
            classes: 'text-center',
            textInput: (value) => projectName = value,
            buttons: [
              new Button({
                text: 'Сохранить',
                icon: 'content-save',
              }, () => this.createProject(projectName, true)),
              new Button({
                text: 'Назад',
                icon: 'keyboard-return',
              }, () => App.closeGlobalDialog()),
            ],
          }),
      );
    }
  },

  saveStorage() {
    localStorage.savedProjects = JSON.stringify(this.projects.saved);
    localStorage.autosavedProject = JSON.stringify(this.projects.autosaved);
    localStorage.emptyCounter = this.projects.emptyCounter;
    localStorage.backpack = JSON.stringify(this.projects.backpack);
    this.loadStorage();
    this.onChanged();
  },

  createProject(name, doSaveProject = false) {
    console.warn('CREATING ' + name);
    const id = Utils.generateId();
    this.projects.current.id = id;
    this.projects.current.name = name;
    this.projects.saved[id] = JSON.parse(JSON.stringify(this.projects.current));

    if (doSaveProject) {
      this.saveProject();
    }

    this.onChanged();
  },

  checkCordova() {
    App.closeGlobalDialog();

    if (!App.isCordova) {
      App.showGlobalDialog(
          new GlobalDialog({
            closable: true,
            title: 'Доступно только в Android-приложении',
            classes: ['text-center', 'buttons-collapsed'],
            buttons: [
              new Button({
                text: 'Закрыть',
                icon: 'keyboard-return',
              }, () => App.closeGlobalDialog()),
            ],
          }),
      );
      return false;
    } else {
      return true;
    }
  },

  exportProject(item) {
    if (!this.checkCordova()) return;

    const autosaveLabel = 'type' in item && item.type === 'autosave' ? 'Авто-сохранение ' : '';
    const name = `${autosaveLabel}${item.name} (${Utils.dateShortAbsolute(item.date)})`;
    this.exportProjectsArray(name, [item]);
  },

  exportAllProjects() {
    if (!this.checkCordova()) return;

    const projectsArray = [];
    for (const id in this.projects.saved) {
      projectsArray.push(this.projects.saved[id]);
    }

    const name = `Все проекты (${Utils.dateShortAbsolute(Date.now())})`;
    this.exportProjectsArray(name, projectsArray);
  },

  exportProjectsArray(name, projects) {
    const fileData = {
      type: 'MUR-ELAUV-PROJECTS',
      version: 1,
      date: Date.now(),
      name: name,
      projects: projects,
    };

    this.saveFile(name, JSON.stringify(fileData));
  },

  importProject() {
    if (!this.checkCordova()) return;
    this.openFiles();
  },

  saveFile(name, data) {
    const blob = new Blob([data], {type: 'application/json'});
    const fileName = name + '.mur.json';

    window.cordova.plugins.saveDialog.saveFile(blob, fileName).then(() => {
      console.info('The file has been successfully saved');
    }).catch((reason) => {
      console.warn(reason);
    });
  },

  openFiles() {
    chooser.getFile('*/*', (file) => this.processImportFile(file), (err) => console.war(err));
  },

  processImportFile(file) {
    const dataString = new TextDecoder().decode(file.data);
    const data = JSON.parse(dataString);

    if ('type' in data && data.type === 'MUR-ELAUV-PROJECTS' && 'projects' in data && Array.isArray(data.projects)) {
      data.projects.forEach((project) => {
        this.projects.saved[project.id] = project;
      });
    }

    this.saveStorage();
  },

  deleteProject(id) {
    if (id in this.projects.saved) {
      delete this.projects.saved[id];
    } else if (id === 'autosave') {
      this.projects.autosaved = makeEmptyProject(true);
    }

    this.saveStorage();
  },

  deleteAllProjects() {
    localStorage.savedProjectsBackup = JSON.stringify(this.projects.saved);
    localStorage.backpackBackup = JSON.stringify(this.projects.backpack);
    this.projects.autosaved = makeEmptyProject(true);
    this.projects.saved = {};
    this.projects.emptyCounter = 1;
    this.saveStorage();
  },

  setBackpack(contents) {
    this.projects.backpack = contents;
    localStorage.backpack = JSON.stringify(contents);
  },
};
