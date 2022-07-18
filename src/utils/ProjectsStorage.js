// TODO: use unique IDs instead of index
import App from "/src/App.js";
import Utils from "./Utils.js";
import ProjectsExamples from "./ProjectsExamples.js";

import GlobalDialog from "/src/components/GlobalDialog.js";
import Button from "/src/components/Button.js";

/* TODO: сделать безымянные проекты с нумерацией "Проект №" */

const emptyAutosaved =  {
  type: "autosave",
  name: "",
  date: 0,
};

function makeEmptyProject(isAutosave = false) {
  if (isAutosave) {
    return {
      type: "autosave",
      name: "",
      date: 0,
    };
  } else {
    return {
      id: Utils.generateId(),
      name: "",
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

    this.projects.saved = JSON.parse(Utils.notNull(localStorage.savedProjects, "{}"));
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

    // this.projects.saved = example; // TODO // // // //

    this.projects.savedSorted = [];

    for (const id in this.projects.saved) {
      this.projects.savedSorted.push({
        id: id,
        date: this.projects.saved[id].date
      })

      this.projects.saved[id].id = id;
    }

    this.projects.savedSorted = this.projects.savedSorted.sort((a, b) => b.date - a.date)

    this.projects.backpack = JSON.parse(localStorage.backpack ? localStorage.backpack : "[]")

    // this.projects.saved = this.projects.saved.sort((a, b) => b.date - a.date);
    // this.autosave = Utils.notNull(localStorage.autosave, {})

    // this.autosave = {
    //   name: 'Авто-сохранение',
    //   date: new Date(Date.parse('2022-06-28T13:18:31+1000')),
    //   id: null,
    //   data: {},
    //   version: 0,
    // }
  },

  setCurrentProject(item) {
    // item.id = Utils.notNull(item.id, Utils.generateId());
    this.projects.current = item;
    console.log(item.id);
    this.projects.current.autosaved = true;
    // this.projects.autosaved.id = item.id
    this.onChanged();
    console.log(item)
  },

  loadProject(item) {
    // TODO: what if script is running? 1) forbid; 2) stop script.

    item = JSON.parse(JSON.stringify(item)) // depp clone
    this.setCurrentProject(item);
    App.closeGlobalDialog();
    App.panels.blockly.load(item.data);
    App.panelSelect(App.panels.blockly);
  },

  autoSave() {
    this.projects.autosaved.type = "autosave";
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
        this.projects.current.name = "Проект №" + this.projects.emptyCounter;
        this.projects.emptyCounter++;
      }

      this.projects.current.description = "";
      this.projects.current.date = Date.now();
      this.projects.saved[this.projects.current.id] = JSON.parse(JSON.stringify(this.projects.current));
      this.projects.current.autosaved = true;

      this.saveStorage();
      App.closeGlobalDialog();
    } else {
      let projectName = "";

      App.showGlobalDialog(
        new GlobalDialog({
          title: 'Введите имя проекта',
          classes: 'text-center',
          textInput: value => projectName = value,
          buttons: [
            new Button({
              text: 'Сохранить',
              icon: 'content-save',
            }, () => this.createProject(projectName, true)), // TODO
            new Button({
              text: 'Назад',
              icon: 'keyboard-return',
            }, () => App.closeGlobalDialog()),
          ]
        })
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
    console.warn("CREATING " + name);
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
      alert("This feature is available only in Android app!");
      return false;
    } else {
      return true;
    }
  },

  exportProject(item) {   // TODO //
    if (!this.checkCordova()) return;

    const autosaveLabel = 'type' in item && item.type === 'autosave' ? 'Авто-сохранение ' : '';
    const name = `${autosaveLabel}${item.name} (${Utils.dateShortAbsolute(item.date)})`;
    this.exportProjectsArray(name, [item]);
  },

  exportAllProjects() {   // TODO //
    if (!this.checkCordova()) return;

    let projectsArray = [];
    for (const id in this.projects.saved) {
      projectsArray.push(this.projects.saved[id]);
    }

    const name = `Все проекты (${Utils.dateShortAbsolute(Date.now())})`;
    this.exportProjectsArray(name, projectsArray)
  },

  exportProjectsArray(name, projects) {
    let fileData = {
      type: "MUR-ELAUV-PROJECTS",
      version: 0,
      date: Date.now(),
      name: name,
      projects: projects
    }

    this.saveFile(name, JSON.stringify(fileData));
  },

  importProject() {
    if (!this.checkCordova()) return;
    this.openFiles();
  },

  saveFile(name, data) {
    const blob = new Blob([data], { type: "application/json" });
    const fileName = name + ".mur.json";

    window.cordova.plugins.saveDialog.saveFile(blob, fileName).then(() => {
      console.info("The file has been successfully saved");
    }).catch(reason => {
      console.warn(reason);
    });
  },

  openFiles() {
    chooser.getFile("*/*", file => this.processImportFile(file), err => console.war(err))
  },

  /*

path = "file:///storage/emulated/0/Download/Все проекты (2022-07-08, 15-17-33).mur.json"

newPath = window.resolveLocalFileSystemURL(path)

console.log(newPath)

window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

    console.log('file system open: ' + fs.name);
    fs.root.getFile(newPath, { create: false, exclusive: false }, function (fileEntry) {

        console.log("fileEntry is file?" + fileEntry.isFile.toString());
        // fileEntry.name == 'someFile.txt'
        // fileEntry.fullPath == '/someFile.txt'
        writeFile(fileEntry, null);

    }, err => console.error(err));

}, err => console.error(err));

  */

  processImportFile(file) {
    const dataString = new TextDecoder().decode(file.data);
    const data = JSON.parse(dataString);

    if ("type" in data && data.type === 'MUR-ELAUV-PROJECTS' && 'projects' in data && Array.isArray(data.projects)) {
      data.projects.forEach(project => {
        this.projects.saved[project.id] = project;
      });
    }

    this.saveStorage();
  },

  deleteProject(id) {
    if (id in this.projects.saved) {
      delete this.projects.saved[id];
    } else if (id === "autosave") {
      this.projects.autosaved = makeEmptyProject(true);
    }

    this.saveStorage();
  },

  deleteAllProjects() {
    this.projects.autosaved = makeEmptyProject(true);
    this.projects.saved = {};
    this.projects.emptyCounter = 1;
    this.saveStorage();
  },

  setBackpack(contents) {
    this.projects.backpack = contents;
    localStorage.backpack = JSON.stringify(contents);
  }
}

let example = {
  'l4xobb5i.wpbw9nbor9h': {
    name: 'Тестовый проект',
    date: new Date(Date.parse('2022-06-25T16:34:56+1000')),
    data: {"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defnoreturn","id":"#QG288GCWgX(%a%r*#;@","x":377,"y":39,"fields":{"NAME":"ехать вперёд"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"6gkF.56#8%=9Ly,j/d{2","fields":{"Text":"статус"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"YaG$Zqd*EQthehxh!2MY","fields":{"Text":"едем вперед"}}}},"next":{"block":{"type":"mur_set_power","id":"ENS|418(oF/cc`KwMjOW","fields":{"Index":"MOTOR_A"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"6:#qPNZbX(eoI[8!HFKT","fields":{"Value":10}}}},"next":{"block":{"type":"mur_set_power","id":"{|oJOQNp,Gi8PV$2gO)7","fields":{"Index":"MOTOR_D"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"3hs1.ihhzti(xbjdC,gK","fields":{"Value":10}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"-aT)?%%Z++*QEXPg#dei","x":377,"y":247,"fields":{"NAME":"ехать назад"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"+![8UyY?{i_^HN[AN3e%","fields":{"Text":"статус"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":")Q#os:`$J*QY3xudW?_K","fields":{"Text":"едем назад"}}}},"next":{"block":{"type":"mur_set_power","id":"c[~^j@f=r};5T`jG+)|B","fields":{"Index":"MOTOR_A"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"-Zy|vi*$`=;yWXZ}$2/)","fields":{"Value":-10}}}},"next":{"block":{"type":"mur_set_power","id":"(J%K$I*_deC$[o,dR@4L","fields":{"Index":"MOTOR_D"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"$pG%{#kvT=/9EdpC|9ZC","fields":{"Value":-10}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"#DbkJ)798dL{YRonm5c+","x":377,"y":481,"fields":{"NAME":"остановиться на ударе"},"inputs":{"STACK":{"block":{"type":"mur_wait_imu_tap","id":"!?dXFo51)gQB7Lh|a!bC","fields":{"MODE":"IMU_TAP_ONE"},"next":{"block":{"type":"mur_stop_motors","id":"msV/PMjA|6/s2d.^fVX#","next":{"block":{"type":"mur_print","id":"jh1i{ho=+(5j]CghY:XI","fields":{"Text":"статус"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":":9+_}pP|,?Fl4o]dEx|n","fields":{"Text":"стоп"}}}},"next":{"block":{"type":"math_change","id":",JwLyOw=-|e~//VF-v0y","fields":{"VAR":{"id":"!QAM_twPqog#*BJ,a^-g"}},"inputs":{"DELTA":{"shadow":{"type":"math_number","id":"VYvSkOQ)y+=g,wI(bM)0","fields":{"NUM":1}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"-u@3Ga.moZm_zLyZDAh7","inline":false,"extraState":{"name":"мигать","params":["кол-во вспышек"]},"inputs":{"ARG0":{"block":{"type":"variables_get","id":"+u:_KGSK2^df?n#F%r^4","fields":{"VAR":{"id":"!QAM_twPqog#*BJ,a^-g"}}}}},"next":{"block":{"type":"controls_if","id":"`B)bG!-9+iMpS@[0M;.e","inputs":{"IF0":{"block":{"type":"logic_compare","id":"lJl#J3Hl74l~6N=:(,`k","fields":{"OP":"GTE"},"inputs":{"A":{"block":{"type":"variables_get","id":"6;*R^)VSQyuYS!V]9vp_","fields":{"VAR":{"id":"!QAM_twPqog#*BJ,a^-g"}}}},"B":{"block":{"type":"mur_number","id":"(65-)D%fmXIBod^%yX1C","fields":{"Value":4}}}}}},"DO0":{"block":{"type":"mur_set_led","id":"9@?F{bQ@$[pR8=K$wqoj","inputs":{"Index":{"block":{"type":"mur_number","id":"KiwpP_V9V;]s}?nso1-N","fields":{"Value":0}}},"Colour":{"block":{"type":"colour_picker","id":"Ba,_*g5K)S}QYDe[l`N_","fields":{"COLOUR":"#ff0000"}}}},"next":{"block":{"type":"mur_delay","id":"))f8IX=-grrM=HK7DyoT","inputs":{"sleepSeconds":{"block":{"type":"mur_number","id":"@t;+/ek8k1fWhlZ+;~U`","fields":{"Value":1}}}},"next":{"block":{"type":"mur_end_thread","id":"W8D|uJtMWetf{rVSK~{v","fields":{"MODE":"MODE_END_SCRIPT"}}}}}}}}}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"`6e8|p~bCJ7;{`])i!0Q","x":377,"y":975,"extraState":{"params":[{"name":"кол-во вспышек","id":"Y|9tv`4sCPkMLwXXb:oP","argId":"gqiY{s=UY-ZwL8hJkP+K"}]},"fields":{"NAME":"мигать","gqiY{s=UY-ZwL8hJkP+K":"кол-во вспышек"},"inputs":{"STACK":{"block":{"type":"controls_repeat_ext","id":"]B*i`nAOv~U6`lt!4_?X","inputs":{"TIMES":{"block":{"type":"variables_get","id":"2(9Cme-l@y!I)iV2l@pd","fields":{"VAR":{"id":"Y|9tv`4sCPkMLwXXb:oP"}}}},"DO":{"block":{"type":"mur_set_led","id":"k.HCQq5xt_OnAC%Ep$|b","inputs":{"Index":{"block":{"type":"mur_number","id":"fu:O((^^0*E,*=SC~68B","fields":{"Value":0}}},"Colour":{"block":{"type":"colour_picker","id":"9AshO`RQk/`_9D.-j!iU","fields":{"COLOUR":"#ffff00"}}}},"next":{"block":{"type":"mur_delay","id":"-=UzNx}wok4.Flt?s}=P","inputs":{"sleepSeconds":{"block":{"type":"mur_number","id":"K%+Oyt}3QByUNp.@l1/3","fields":{"Value":0.3}}}},"next":{"block":{"type":"mur_set_led","id":"}=%tGn1{2?gQ~sV`%ooA","inputs":{"Index":{"block":{"type":"mur_number","id":"s99zs2:zs8elQDh,8GEe","fields":{"Value":0}}},"Colour":{"block":{"type":"colour_picker","id":"z$nGGApfFWL$s|!bzb}y","fields":{"COLOUR":"#000000"}}}},"next":{"block":{"type":"mur_delay","id":"R2{D$w,QG:c_L|bJv)/v","inputs":{"sleepSeconds":{"block":{"type":"mur_number","id":"ae24*E`^:-olE]c.hN00","fields":{"Value":0.3}}}}}}}}}}}}},"next":{"block":{"type":"mur_delay","id":"^Wro4_-HKZ(1bi^3.hp*","inputs":{"sleepSeconds":{"block":{"type":"mur_number","id":"KonJ=Lr[Ne9tUn?7mYDr","fields":{"Value":1}}}}}}}}}},{"type":"mur_thread","id":"K7QiB]=7WsDSYyPKQ0@{","x":-117,"y":221,"fields":{"ThreadName":"имя"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"lfad,=iZ]Zi4a+cBy$5}","fields":{"Text":"статус"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"ByG$13enk4okpK^:dTpM","fields":{"Text":"ждем"}}}},"next":{"block":{"type":"mur_delay","id":"%~rS@D*u_w:EwevbO7jK","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"ckD3rj_+)nBgzc#Gvo!3","fields":{"Value":1}}}},"next":{"block":{"type":"procedures_callnoreturn","id":";?KE9*Vl![Z?qJfR~wAp","inline":true,"extraState":{"name":"мигать","params":["кол-во вспышек"]},"inputs":{"ARG0":{"block":{"type":"mur_number","id":"|y6/UI.*(/Cqizp~,0j:","fields":{"Value":1}}}},"next":{"block":{"type":"mur_loop_infinite","id":"va5Sa;(ko7g21zq@@cHS","inputs":{"STACK":{"block":{"type":"procedures_callnoreturn","id":"%HFUInjq4h{7ZTQzLyG:","extraState":{"name":"ехать вперёд"},"next":{"block":{"type":"procedures_callnoreturn","id":"U!w;!GKe#DN|R9ka4MZU","extraState":{"name":"остановиться на ударе"},"next":{"block":{"type":"procedures_callnoreturn","id":"!HmBY=p;Nt87V(z+Lzv~","extraState":{"name":"ехать назад"},"next":{"block":{"type":"procedures_callnoreturn","id":"ZVEdGutrUu]Ol$H7H~cX","extraState":{"name":"остановиться на ударе"}}}}}}}}}}}}}}}}}}}},{"type":"mur_thread","id":"d{jBs4WfND2qv*28m-%~","x":-117,"y":663,"fields":{"ThreadName":"имя"},"inputs":{"STACK":{"block":{"type":"mur_loop_infinite","id":"zl^4/e%i[0`?RE=,jOM0","inputs":{"STACK":{"block":{"type":"mur_print","id":"YudXE;@H4_;O[N;HK_.G","fields":{"Text":"время"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"(:cw~2xsd3ueX+[;`%em","fields":{"Text":"Текст"}},"block":{"type":"mur_get_timestamp","id":"tMb6wd(m`C{0A(aCwQMo","fields":{"MODE":"MODE_SEC"}}}},"next":{"block":{"type":"mur_print","id":"fCL9$+@9La+e507{^r+W","fields":{"Text":"удары"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"]Z1=}oARYXW.v{wh~%6F","fields":{"Text":"Текст"}},"block":{"type":"variables_get","id":"aw?DaBLIIC5mBm$[}ErO","fields":{"VAR":{"id":"!QAM_twPqog#*BJ,a^-g"}}}}},"next":{"block":{"type":"mur_delay","id":"{_%Dh{J~oSZ+=Ii,k;8h","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"8iM|O0zbui,cW]E[450I","fields":{"Value":0.3}}}}}}}}}}}}}}},{"type":"variables_set","id":"y~U@0]|c+@YB9?v_DaT=","x":-117,"y":169,"fields":{"VAR":{"id":"!QAM_twPqog#*BJ,a^-g"}},"inputs":{"VALUE":{"block":{"type":"mur_number","id":"NNEKaQ6dIcot6*YCgWiw","fields":{"Value":0}}}}}]},"variables":[{"name":"количество ударов","id":"!QAM_twPqog#*BJ,a^-g"},{"name":"кол-во вспышек","id":"Y|9tv`4sCPkMLwXXb:oP"}]},
    version: 0,
  },
  'l4xobbwh.rsprfdb4sj': {
    name: 'Интересная программа',
    date: new Date(Date.parse('2022-06-06T09:02:43+1000')),
    data: {"blocks":{"languageVersion":0,"blocks":[{"type":"mur_thread","id":"vL7iCh6T!@X@=7)#Wb)]","x":143,"y":273,"fields":{"ThreadName":"one"},"inputs":{"STACK":{"block":{"type":"mur_loop_infinite","id":"eScpd$F]IG/VZgOZzd^{","inputs":{"STACK":{"block":{"type":"mur_print","id":"Mcp_Fs5l:i4xn6ROtr{H","fields":{"Text":"name"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"W^5k-fKKp*!AJi=SH_+O","fields":{"Text":"text"}}}},"next":{"block":{"type":"mur_delay","id":"y2X.J^GStbkUl;hy}:bl","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":";=0PY!Y^Hv]7qRwP8:-w","fields":{"Value":1}}}},"next":{"block":{"type":"mur_delay","id":"E[c=-Z4+fVig)UT$m(4n","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"}d3)77NzF#lPu3(C0E^3","fields":{"Value":1}}}}}}}}}}}}}}},{"type":"mur_thread","id":"AN)4ky/K+OFYgzBY?$]=","x":429,"y":273,"fields":{"ThreadName":"two"},"inputs":{"STACK":{"block":{"type":"mur_loop_infinite","id":"o~RLWv7gEcL(-(m:|eeQ","inputs":{"STACK":{"block":{"type":"mur_print","id":"-C5JET^#02V?4h(;ma%p","fields":{"Text":"tww"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"AnBi:R_RSAlyAa~;cqX=","fields":{"Text":"2222"}}}},"next":{"block":{"type":"mur_delay","id":"NU(1q^fxsT]/Ds+%ZZJD","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"ueK:7[TADvH$/J1Q%PO5","fields":{"Value":0.5}}}},"next":{"block":{"type":"mur_delay","id":"ds?N`Zr;C3Z:xPiUXp;:","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"R[qViU1%qnEFM9nZT2@c","fields":{"Value":0.5}}}}}}}}}}}}}}},{"type":"mur_loop_timeout","id":"@3@l#afC~R@K0)QweCcv","x":299,"y":-13,"inputs":{"Delay":{"shadow":{"type":"mur_number","id":"prFD:wvdOR6@$q~5+?*4","fields":{"Value":1}}},"STACK":{"block":{"type":"mur_delay","id":"xhb}7a@~EuRXWWBtoF=~","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"1@).Ce[bX7DN1RCkm*I,","fields":{"Value":0.2}}}},"next":{"block":{"type":"mur_delay","id":"sFD:sJH|T:~RJj`Qf=+0","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"7._S6-Sjzi=%:PjQ@s[!","fields":{"Value":0.2}}}},"next":{"block":{"type":"mur_delay","id":"33d_m;#o749PPjPM7S7T","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"uB=?!^,hdWiitd#ZPBLd","fields":{"Value":0.2}}}}}}}}}}}}]},"variables":[{"name":"arg_x","id":"%O:gDtv4Jp@{?/e]@Y.q"},{"name":"counter","id":"ecqms.{//*3w@s$CpWp/"}]},
    version: 0,
  },
  'l4xobckk.9h7juwro69m': {
    name: 'Урок такой-то',
    date: new Date(Date.parse('2022-06-21T18:10:09+1000')),
    data: {"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defreturn","id":"{t}c=y,Q!/0T?|dleXA3","x":91,"y":117,"extraState":{"params":[{"name":"arg_x","id":"%O:gDtv4Jp@{?/e]@Y.q","argId":")6Y3;aO]hg=3DR(Uo_my"}]},"fields":{"NAME":"do_something",")6Y3;aO]hg=3DR(Uo_my":"arg_x"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"@ER)+kLeDFTpS2m^q@O0","fields":{"Text":"var_counter"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"=4G(S4+d8`!U#a}8Y;eQ","fields":{"Text":"Текст"}},"block":{"type":"variables_get","id":"pOowvkmWyXuC)H6H`KU$","fields":{"VAR":{"id":"ecqms.{//*3w@s$CpWp/"}}}}},"next":{"block":{"type":"mur_delay","id":"r=.M30/L0T4*g`Pto`f4","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"z2y@nFdLCDJo8f0]7+GS","fields":{"Value":1}}}}}}}},"RETURN":{"block":{"type":"math_arithmetic","id":"|k.7v]D1f:bE[FTTrcqX","fields":{"OP":"MULTIPLY"},"inputs":{"A":{"shadow":{"type":"mur_number","id":"zPD_cjU.:QtOZ[U0Qr**","fields":{"Value":1}},"block":{"type":"variables_get","id":"Mv5tNy6Ha7/*[*wx=WV7","fields":{"VAR":{"id":"%O:gDtv4Jp@{?/e]@Y.q"}}}},"B":{"shadow":{"type":"mur_number","id":"+Cq.7%K18gXk0_Z~#Zzz","fields":{"Value":2}},"block":{"type":"mur_number","id":"DL+c947+sQwnk-_,01b$","fields":{"Value":10}}}}}}}},{"type":"mur_thread","id":":U%0lg#tzG`.=0MD8Jr}","x":91,"y":351,"fields":{"ThreadName":"thread_one"},"inputs":{"STACK":{"block":{"type":"variables_set","id":"oYY51Z)?(+j8dj-p:$e~","fields":{"VAR":{"id":"ecqms.{//*3w@s$CpWp/"}},"inputs":{"VALUE":{"block":{"type":"mur_number","id":"Rn-Swz}v[CchgwrPr$Dk","fields":{"Value":0}}}},"next":{"block":{"type":"mur_loop_infinite","id":"kQLVm^4Nx@*0APzX^TfU","inputs":{"STACK":{"block":{"type":"math_change","id":"]+DYt-WVV7ajf!8C$6`A","fields":{"VAR":{"id":"ecqms.{//*3w@s$CpWp/"}},"inputs":{"DELTA":{"shadow":{"type":"math_number","id":"s4Y{di=dhXbwH)6UDKXc","fields":{"NUM":1}}}},"next":{"block":{"type":"mur_print","id":"@i{HbQ(gExAii!v]|(c:","fields":{"Text":"func_output_0"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"=4G(S4+d8`!U#a}8Y;eQ","fields":{"Text":"Текст"}},"block":{"type":"procedures_callreturn","id":"OAl0$v6.@u7uSuafox*.","inline":true,"extraState":{"name":"do_something","params":["arg_x"]},"inputs":{"ARG0":{"block":{"type":"variables_get","id":"MGxbIi/MoFWq!o8!?wpv","fields":{"VAR":{"id":"ecqms.{//*3w@s$CpWp/"}}}}}}}},"next":{"block":{"type":"mur_print","id":",.c6ZDT5{Ekn!weP%ZNP","fields":{"Text":"func_output_1"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"=4G(S4+d8`!U#a}8Y;eQ","fields":{"Text":"Текст"}},"block":{"type":"math_arithmetic","id":"bg^o+ZZ{k+x0iG%A5t%S","fields":{"OP":"MULTIPLY"},"inputs":{"A":{"shadow":{"type":"mur_number","id":"]{tNZbtf4PTRJ^2j%W9W","fields":{"Value":1}},"block":{"type":"procedures_callreturn","id":"6|RX]Cp~M3|h@Xv(_gn0","inline":true,"extraState":{"name":"do_something","params":["arg_x"]},"inputs":{"ARG0":{"block":{"type":"variables_get","id":"yJQ12HfV$i+Cw+zqLD!D","fields":{"VAR":{"id":"ecqms.{//*3w@s$CpWp/"}}}}}}},"B":{"shadow":{"type":"mur_number","id":"D%a5ee%T%Uzseqa=gTc9","fields":{"Value":10}}}}}}},"next":{"block":{"type":"mur_delay","id":"F7KuH;$UYJM$aW7](Y1]","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"G]tE8Km^1h+un1zg;VAg","fields":{"Value":1}}}}}}}}}}}}}}}}}}},{"type":"mur_thread","id":"Mm0*8Jo)v/bB(05ggc47","x":91,"y":715,"fields":{"ThreadName":"thread_two"},"inputs":{"STACK":{"block":{"type":"mur_loop_infinite","id":"Jhalr~K(2pQ5|(-;4Z!A","inputs":{"STACK":{"block":{"type":"mur_delay","id":"q/~MAhGzGEaypcG4d~tz","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"rO,$5PeOo]g.SZTlkfbw","fields":{"Value":0.5}}}},"next":{"block":{"type":"mur_print","id":"Yc4Ox+/7,SKO+I@ji66%","fields":{"Text":"separate_thread_counter"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"y;/?Hsvrl5@h{bEz}W(P","fields":{"Text":"Текст"}},"block":{"type":"variables_get","id":"XaY=+Ir@tf~AT`{|/;;6","fields":{"VAR":{"id":"ecqms.{//*3w@s$CpWp/"}}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"DfTo`@UpQ4dsv$AWi81c","extraState":{"name":"do_noreturn"}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"ZnI)C,(vlb=SUe4q~*Qd","x":91,"y":975,"fields":{"NAME":"do_noreturn"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"7^Ay8ybSD*@(BwWS!;ur","fields":{"Text":"noreturn"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"IDDwgL?lt~LyD8z9Umb#","fields":{"Text":"done"}}}}}}}}]},"variables":[{"name":"arg_x","id":"%O:gDtv4Jp@{?/e]@Y.q"},{"name":"counter","id":"ecqms.{//*3w@s$CpWp/"}]},
    version: 0,
  },
  'l4xobdi4.wyq2mi425fd': {
    name: '',
    date: new Date(Date.parse('2022-05-27T11:25:17+1000')),
    data: {},
    version: 0,
  },
};