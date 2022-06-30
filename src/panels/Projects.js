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

import ProjectListItem from '/src/components/ProjectItem.js'



function generateId() {
  return (+new Date()).toString(36) + Math.random().toString(36).substring(1);
}

let autosave = {
  date: new Date(Date.parse('2022-06-28T13:18:31+1000')),
  id: null,
  data: {},
  version: 0,
}

let exampleList = [
  {
    name: 'Простые движения',
    description: 'Движения вперёд и назад',
    data: {},
    version: 0,
  },
  {
    name: 'Пропорциональный регулятор',
    description: 'Удержание курса с помощью<br>пропорционального регулятора',
    data: {},
    version: 0,
  },
  {
    name: 'Исследователь стенок',
    description: 'Ехать вперёд и назад до<br>удара в стену аквариума',
    data: {},
    version: 0,
  },
  {
    name: 'Кладоискатель',
    description: 'Дойти до чёрной зоны и<br>поднять монетку из сундука',
    data: {},
    version: 0,
  },
];

let example = [
  {
    id: 'l4xobb5i.wpbw9nbor9h',
    name: 'Тестовый проект',
    date: new Date(Date.parse('2022-06-25T16:34:56+1000')),
    data: {"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defnoreturn","id":"#QG288GCWgX(%a%r*#;@","x":377,"y":39,"fields":{"NAME":"ехать вперёд"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"6gkF.56#8%=9Ly,j/d{2","fields":{"Text":"статус"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"YaG$Zqd*EQthehxh!2MY","fields":{"Text":"едем вперед"}}}},"next":{"block":{"type":"mur_set_power","id":"ENS|418(oF/cc`KwMjOW","fields":{"Index":"MOTOR_A"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"6:#qPNZbX(eoI[8!HFKT","fields":{"Value":10}}}},"next":{"block":{"type":"mur_set_power","id":"{|oJOQNp,Gi8PV$2gO)7","fields":{"Index":"MOTOR_D"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"3hs1.ihhzti(xbjdC,gK","fields":{"Value":10}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"-aT)?%%Z++*QEXPg#dei","x":377,"y":247,"fields":{"NAME":"ехать назад"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"+![8UyY?{i_^HN[AN3e%","fields":{"Text":"статус"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":")Q#os:`$J*QY3xudW?_K","fields":{"Text":"едем назад"}}}},"next":{"block":{"type":"mur_set_power","id":"c[~^j@f=r};5T`jG+)|B","fields":{"Index":"MOTOR_A"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"-Zy|vi*$`=;yWXZ}$2/)","fields":{"Value":-10}}}},"next":{"block":{"type":"mur_set_power","id":"(J%K$I*_deC$[o,dR@4L","fields":{"Index":"MOTOR_D"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"$pG%{#kvT=/9EdpC|9ZC","fields":{"Value":-10}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"#DbkJ)798dL{YRonm5c+","x":377,"y":481,"fields":{"NAME":"остановиться на ударе"},"inputs":{"STACK":{"block":{"type":"mur_wait_imu_tap","id":"!?dXFo51)gQB7Lh|a!bC","fields":{"MODE":"IMU_TAP_ONE"},"next":{"block":{"type":"mur_stop_motors","id":"msV/PMjA|6/s2d.^fVX#","next":{"block":{"type":"mur_print","id":"jh1i{ho=+(5j]CghY:XI","fields":{"Text":"статус"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":":9+_}pP|,?Fl4o]dEx|n","fields":{"Text":"стоп"}}}},"next":{"block":{"type":"math_change","id":",JwLyOw=-|e~//VF-v0y","fields":{"VAR":{"id":"!QAM_twPqog#*BJ,a^-g"}},"inputs":{"DELTA":{"shadow":{"type":"math_number","id":"VYvSkOQ)y+=g,wI(bM)0","fields":{"NUM":1}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"-u@3Ga.moZm_zLyZDAh7","inline":false,"extraState":{"name":"мигать","params":["кол-во вспышек"]},"inputs":{"ARG0":{"block":{"type":"variables_get","id":"+u:_KGSK2^df?n#F%r^4","fields":{"VAR":{"id":"!QAM_twPqog#*BJ,a^-g"}}}}},"next":{"block":{"type":"controls_if","id":"`B)bG!-9+iMpS@[0M;.e","inputs":{"IF0":{"block":{"type":"logic_compare","id":"lJl#J3Hl74l~6N=:(,`k","fields":{"OP":"GTE"},"inputs":{"A":{"block":{"type":"variables_get","id":"6;*R^)VSQyuYS!V]9vp_","fields":{"VAR":{"id":"!QAM_twPqog#*BJ,a^-g"}}}},"B":{"block":{"type":"mur_number","id":"(65-)D%fmXIBod^%yX1C","fields":{"Value":4}}}}}},"DO0":{"block":{"type":"mur_set_led","id":"9@?F{bQ@$[pR8=K$wqoj","inputs":{"Index":{"block":{"type":"mur_number","id":"KiwpP_V9V;]s}?nso1-N","fields":{"Value":0}}},"Colour":{"block":{"type":"colour_picker","id":"Ba,_*g5K)S}QYDe[l`N_","fields":{"COLOUR":"#ff0000"}}}},"next":{"block":{"type":"mur_delay","id":"))f8IX=-grrM=HK7DyoT","inputs":{"sleepSeconds":{"block":{"type":"mur_number","id":"@t;+/ek8k1fWhlZ+;~U`","fields":{"Value":1}}}},"next":{"block":{"type":"mur_end_thread","id":"W8D|uJtMWetf{rVSK~{v","fields":{"MODE":"MODE_END_SCRIPT"}}}}}}}}}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"`6e8|p~bCJ7;{`])i!0Q","x":377,"y":975,"extraState":{"params":[{"name":"кол-во вспышек","id":"Y|9tv`4sCPkMLwXXb:oP","argId":"gqiY{s=UY-ZwL8hJkP+K"}]},"fields":{"NAME":"мигать","gqiY{s=UY-ZwL8hJkP+K":"кол-во вспышек"},"inputs":{"STACK":{"block":{"type":"controls_repeat_ext","id":"]B*i`nAOv~U6`lt!4_?X","inputs":{"TIMES":{"block":{"type":"variables_get","id":"2(9Cme-l@y!I)iV2l@pd","fields":{"VAR":{"id":"Y|9tv`4sCPkMLwXXb:oP"}}}},"DO":{"block":{"type":"mur_set_led","id":"k.HCQq5xt_OnAC%Ep$|b","inputs":{"Index":{"block":{"type":"mur_number","id":"fu:O((^^0*E,*=SC~68B","fields":{"Value":0}}},"Colour":{"block":{"type":"colour_picker","id":"9AshO`RQk/`_9D.-j!iU","fields":{"COLOUR":"#ffff00"}}}},"next":{"block":{"type":"mur_delay","id":"-=UzNx}wok4.Flt?s}=P","inputs":{"sleepSeconds":{"block":{"type":"mur_number","id":"K%+Oyt}3QByUNp.@l1/3","fields":{"Value":0.3}}}},"next":{"block":{"type":"mur_set_led","id":"}=%tGn1{2?gQ~sV`%ooA","inputs":{"Index":{"block":{"type":"mur_number","id":"s99zs2:zs8elQDh,8GEe","fields":{"Value":0}}},"Colour":{"block":{"type":"colour_picker","id":"z$nGGApfFWL$s|!bzb}y","fields":{"COLOUR":"#000000"}}}},"next":{"block":{"type":"mur_delay","id":"R2{D$w,QG:c_L|bJv)/v","inputs":{"sleepSeconds":{"block":{"type":"mur_number","id":"ae24*E`^:-olE]c.hN00","fields":{"Value":0.3}}}}}}}}}}}}},"next":{"block":{"type":"mur_delay","id":"^Wro4_-HKZ(1bi^3.hp*","inputs":{"sleepSeconds":{"block":{"type":"mur_number","id":"KonJ=Lr[Ne9tUn?7mYDr","fields":{"Value":1}}}}}}}}}},{"type":"mur_thread","id":"K7QiB]=7WsDSYyPKQ0@{","x":-117,"y":221,"fields":{"ThreadName":"имя"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"lfad,=iZ]Zi4a+cBy$5}","fields":{"Text":"статус"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"ByG$13enk4okpK^:dTpM","fields":{"Text":"ждем"}}}},"next":{"block":{"type":"mur_delay","id":"%~rS@D*u_w:EwevbO7jK","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"ckD3rj_+)nBgzc#Gvo!3","fields":{"Value":1}}}},"next":{"block":{"type":"procedures_callnoreturn","id":";?KE9*Vl![Z?qJfR~wAp","inline":true,"extraState":{"name":"мигать","params":["кол-во вспышек"]},"inputs":{"ARG0":{"block":{"type":"mur_number","id":"|y6/UI.*(/Cqizp~,0j:","fields":{"Value":1}}}},"next":{"block":{"type":"mur_loop_infinite","id":"va5Sa;(ko7g21zq@@cHS","inputs":{"STACK":{"block":{"type":"procedures_callnoreturn","id":"%HFUInjq4h{7ZTQzLyG:","extraState":{"name":"ехать вперёд"},"next":{"block":{"type":"procedures_callnoreturn","id":"U!w;!GKe#DN|R9ka4MZU","extraState":{"name":"остановиться на ударе"},"next":{"block":{"type":"procedures_callnoreturn","id":"!HmBY=p;Nt87V(z+Lzv~","extraState":{"name":"ехать назад"},"next":{"block":{"type":"procedures_callnoreturn","id":"ZVEdGutrUu]Ol$H7H~cX","extraState":{"name":"остановиться на ударе"}}}}}}}}}}}}}}}}}}}},{"type":"mur_thread","id":"d{jBs4WfND2qv*28m-%~","x":-117,"y":663,"fields":{"ThreadName":"имя"},"inputs":{"STACK":{"block":{"type":"mur_loop_infinite","id":"zl^4/e%i[0`?RE=,jOM0","inputs":{"STACK":{"block":{"type":"mur_print","id":"YudXE;@H4_;O[N;HK_.G","fields":{"Text":"время"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"(:cw~2xsd3ueX+[;`%em","fields":{"Text":"Текст"}},"block":{"type":"mur_get_timestamp","id":"tMb6wd(m`C{0A(aCwQMo","fields":{"MODE":"MODE_SEC"}}}},"next":{"block":{"type":"mur_print","id":"fCL9$+@9La+e507{^r+W","fields":{"Text":"удары"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"]Z1=}oARYXW.v{wh~%6F","fields":{"Text":"Текст"}},"block":{"type":"variables_get","id":"aw?DaBLIIC5mBm$[}ErO","fields":{"VAR":{"id":"!QAM_twPqog#*BJ,a^-g"}}}}},"next":{"block":{"type":"mur_delay","id":"{_%Dh{J~oSZ+=Ii,k;8h","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"8iM|O0zbui,cW]E[450I","fields":{"Value":0.3}}}}}}}}}}}}}}},{"type":"variables_set","id":"y~U@0]|c+@YB9?v_DaT=","x":-117,"y":169,"fields":{"VAR":{"id":"!QAM_twPqog#*BJ,a^-g"}},"inputs":{"VALUE":{"block":{"type":"mur_number","id":"NNEKaQ6dIcot6*YCgWiw","fields":{"Value":0}}}}}]},"variables":[{"name":"количество ударов","id":"!QAM_twPqog#*BJ,a^-g"},{"name":"кол-во вспышек","id":"Y|9tv`4sCPkMLwXXb:oP"}]},
    version: 0,
  },
  {
    id: 'l4xobbwh.rsprfdb4sj',
    name: 'Интересная программа',
    date: new Date(Date.parse('2022-06-06T09:02:43+1000')),
    data: {"blocks":{"languageVersion":0,"blocks":[{"type":"mur_thread","id":"vL7iCh6T!@X@=7)#Wb)]","x":143,"y":273,"fields":{"ThreadName":"one"},"inputs":{"STACK":{"block":{"type":"mur_loop_infinite","id":"eScpd$F]IG/VZgOZzd^{","inputs":{"STACK":{"block":{"type":"mur_print","id":"Mcp_Fs5l:i4xn6ROtr{H","fields":{"Text":"name"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"W^5k-fKKp*!AJi=SH_+O","fields":{"Text":"text"}}}},"next":{"block":{"type":"mur_delay","id":"y2X.J^GStbkUl;hy}:bl","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":";=0PY!Y^Hv]7qRwP8:-w","fields":{"Value":1}}}},"next":{"block":{"type":"mur_delay","id":"E[c=-Z4+fVig)UT$m(4n","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"}d3)77NzF#lPu3(C0E^3","fields":{"Value":1}}}}}}}}}}}}}}},{"type":"mur_thread","id":"AN)4ky/K+OFYgzBY?$]=","x":429,"y":273,"fields":{"ThreadName":"two"},"inputs":{"STACK":{"block":{"type":"mur_loop_infinite","id":"o~RLWv7gEcL(-(m:|eeQ","inputs":{"STACK":{"block":{"type":"mur_print","id":"-C5JET^#02V?4h(;ma%p","fields":{"Text":"tww"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"AnBi:R_RSAlyAa~;cqX=","fields":{"Text":"2222"}}}},"next":{"block":{"type":"mur_delay","id":"NU(1q^fxsT]/Ds+%ZZJD","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"ueK:7[TADvH$/J1Q%PO5","fields":{"Value":0.5}}}},"next":{"block":{"type":"mur_delay","id":"ds?N`Zr;C3Z:xPiUXp;:","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"R[qViU1%qnEFM9nZT2@c","fields":{"Value":0.5}}}}}}}}}}}}}}},{"type":"mur_loop_timeout","id":"@3@l#afC~R@K0)QweCcv","x":299,"y":-13,"inputs":{"Delay":{"shadow":{"type":"mur_number","id":"prFD:wvdOR6@$q~5+?*4","fields":{"Value":1}}},"STACK":{"block":{"type":"mur_delay","id":"xhb}7a@~EuRXWWBtoF=~","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"1@).Ce[bX7DN1RCkm*I,","fields":{"Value":0.2}}}},"next":{"block":{"type":"mur_delay","id":"sFD:sJH|T:~RJj`Qf=+0","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"7._S6-Sjzi=%:PjQ@s[!","fields":{"Value":0.2}}}},"next":{"block":{"type":"mur_delay","id":"33d_m;#o749PPjPM7S7T","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"uB=?!^,hdWiitd#ZPBLd","fields":{"Value":0.2}}}}}}}}}}}}]},"variables":[{"name":"arg_x","id":"%O:gDtv4Jp@{?/e]@Y.q"},{"name":"counter","id":"ecqms.{//*3w@s$CpWp/"}]},
    version: 0,
  },
  {
    id: 'l4xobckk.9h7juwro69m',
    name: 'Урок такой-то',
    date: new Date(Date.parse('2022-06-21T18:10:09+1000')),
    data: {"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defreturn","id":"{t}c=y,Q!/0T?|dleXA3","x":91,"y":117,"extraState":{"params":[{"name":"arg_x","id":"%O:gDtv4Jp@{?/e]@Y.q","argId":")6Y3;aO]hg=3DR(Uo_my"}]},"fields":{"NAME":"do_something",")6Y3;aO]hg=3DR(Uo_my":"arg_x"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"@ER)+kLeDFTpS2m^q@O0","fields":{"Text":"var_counter"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"=4G(S4+d8`!U#a}8Y;eQ","fields":{"Text":"Текст"}},"block":{"type":"variables_get","id":"pOowvkmWyXuC)H6H`KU$","fields":{"VAR":{"id":"ecqms.{//*3w@s$CpWp/"}}}}},"next":{"block":{"type":"mur_delay","id":"r=.M30/L0T4*g`Pto`f4","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"z2y@nFdLCDJo8f0]7+GS","fields":{"Value":1}}}}}}}},"RETURN":{"block":{"type":"math_arithmetic","id":"|k.7v]D1f:bE[FTTrcqX","fields":{"OP":"MULTIPLY"},"inputs":{"A":{"shadow":{"type":"mur_number","id":"zPD_cjU.:QtOZ[U0Qr**","fields":{"Value":1}},"block":{"type":"variables_get","id":"Mv5tNy6Ha7/*[*wx=WV7","fields":{"VAR":{"id":"%O:gDtv4Jp@{?/e]@Y.q"}}}},"B":{"shadow":{"type":"mur_number","id":"+Cq.7%K18gXk0_Z~#Zzz","fields":{"Value":2}},"block":{"type":"mur_number","id":"DL+c947+sQwnk-_,01b$","fields":{"Value":10}}}}}}}},{"type":"mur_thread","id":":U%0lg#tzG`.=0MD8Jr}","x":91,"y":351,"fields":{"ThreadName":"thread_one"},"inputs":{"STACK":{"block":{"type":"variables_set","id":"oYY51Z)?(+j8dj-p:$e~","fields":{"VAR":{"id":"ecqms.{//*3w@s$CpWp/"}},"inputs":{"VALUE":{"block":{"type":"mur_number","id":"Rn-Swz}v[CchgwrPr$Dk","fields":{"Value":0}}}},"next":{"block":{"type":"mur_loop_infinite","id":"kQLVm^4Nx@*0APzX^TfU","inputs":{"STACK":{"block":{"type":"math_change","id":"]+DYt-WVV7ajf!8C$6`A","fields":{"VAR":{"id":"ecqms.{//*3w@s$CpWp/"}},"inputs":{"DELTA":{"shadow":{"type":"math_number","id":"s4Y{di=dhXbwH)6UDKXc","fields":{"NUM":1}}}},"next":{"block":{"type":"mur_print","id":"@i{HbQ(gExAii!v]|(c:","fields":{"Text":"func_output_0"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"=4G(S4+d8`!U#a}8Y;eQ","fields":{"Text":"Текст"}},"block":{"type":"procedures_callreturn","id":"OAl0$v6.@u7uSuafox*.","inline":true,"extraState":{"name":"do_something","params":["arg_x"]},"inputs":{"ARG0":{"block":{"type":"variables_get","id":"MGxbIi/MoFWq!o8!?wpv","fields":{"VAR":{"id":"ecqms.{//*3w@s$CpWp/"}}}}}}}},"next":{"block":{"type":"mur_print","id":",.c6ZDT5{Ekn!weP%ZNP","fields":{"Text":"func_output_1"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"=4G(S4+d8`!U#a}8Y;eQ","fields":{"Text":"Текст"}},"block":{"type":"math_arithmetic","id":"bg^o+ZZ{k+x0iG%A5t%S","fields":{"OP":"MULTIPLY"},"inputs":{"A":{"shadow":{"type":"mur_number","id":"]{tNZbtf4PTRJ^2j%W9W","fields":{"Value":1}},"block":{"type":"procedures_callreturn","id":"6|RX]Cp~M3|h@Xv(_gn0","inline":true,"extraState":{"name":"do_something","params":["arg_x"]},"inputs":{"ARG0":{"block":{"type":"variables_get","id":"yJQ12HfV$i+Cw+zqLD!D","fields":{"VAR":{"id":"ecqms.{//*3w@s$CpWp/"}}}}}}},"B":{"shadow":{"type":"mur_number","id":"D%a5ee%T%Uzseqa=gTc9","fields":{"Value":10}}}}}}},"next":{"block":{"type":"mur_delay","id":"F7KuH;$UYJM$aW7](Y1]","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"G]tE8Km^1h+un1zg;VAg","fields":{"Value":1}}}}}}}}}}}}}}}}}}},{"type":"mur_thread","id":"Mm0*8Jo)v/bB(05ggc47","x":91,"y":715,"fields":{"ThreadName":"thread_two"},"inputs":{"STACK":{"block":{"type":"mur_loop_infinite","id":"Jhalr~K(2pQ5|(-;4Z!A","inputs":{"STACK":{"block":{"type":"mur_delay","id":"q/~MAhGzGEaypcG4d~tz","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"rO,$5PeOo]g.SZTlkfbw","fields":{"Value":0.5}}}},"next":{"block":{"type":"mur_print","id":"Yc4Ox+/7,SKO+I@ji66%","fields":{"Text":"separate_thread_counter"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"y;/?Hsvrl5@h{bEz}W(P","fields":{"Text":"Текст"}},"block":{"type":"variables_get","id":"XaY=+Ir@tf~AT`{|/;;6","fields":{"VAR":{"id":"ecqms.{//*3w@s$CpWp/"}}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"DfTo`@UpQ4dsv$AWi81c","extraState":{"name":"do_noreturn"}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"ZnI)C,(vlb=SUe4q~*Qd","x":91,"y":975,"fields":{"NAME":"do_noreturn"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"7^Ay8ybSD*@(BwWS!;ur","fields":{"Text":"noreturn"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"IDDwgL?lt~LyD8z9Umb#","fields":{"Text":"done"}}}}}}}}]},"variables":[{"name":"arg_x","id":"%O:gDtv4Jp@{?/e]@Y.q"},{"name":"counter","id":"ecqms.{//*3w@s$CpWp/"}]},
    version: 0,
  },
  {
    id: 'l4xobdi4.wyq2mi425fd',
    name: '',
    date: new Date(Date.parse('2022-05-27T11:25:17+1000')),
    data: {},
    version: 0,
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
    this.name = "Проекты";

    this.html = /*html*/`
      <div class="container">
        <div class="list-wrapper soft-edges">
          <div id="projects-list" class="width-fill"></div>
        </div>

        <div id="projects-head-buttons" class="row font-thin"></div>
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
    this.loadProjectsList(true);
    this.displayProjects();
  }

  makeButtons() {
    this.headButtonsEl = this.q('#projects-head-buttons')

    new Button({
      name: 'save',
      text: 'Сохранить',
      action: () => {},
      icon: 'content-save',
      // classes: 'button-vertical',
    }).inject(this.headButtonsEl);

    new Button({
      name: 'import',
      text: 'Импорт из&nbsp;файла',
      action: () => {},
      icon: 'import',
      // classes: 'button-vertical',
    }).inject(this.headButtonsEl);

    new Button({
      name: 'export',
      text: 'Экспорт в&nbsp;файл',
      action: () => {},
      icon: 'export',
      // classes: 'button-vertical',
    }).inject(this.headButtonsEl);

    new Button({
      name: 'wipe',
      text: 'Удалить всё',
      action: () => {},
      icon: 'trash-can-outline',
      iconColor: 'red',
      // classes: 'button-vertical',
    }).inject(this.headButtonsEl);
  }

  loadProjectsList(populate = false) {
    this.projectsList = example; // TODO
    if (populate) {
      for (let i = 0; i < 22; i++) {
        let name = '';
        const iter = Math.round(Math.random() * 6) + 1
        for (let j = 0; j < iter; j++) {
          name += Math.random().toString(36).slice(2, Math.random() * 8 + 3) + ' ';
        }
        const item = {
          name: name,
          date: new Date(+new Date - Math.round(Math.random() * 100000000000)),
          data: {},
        };
        this.projectsList.push(item);
      }
    }
    this.projectsList = this.projectsList.sort((a, b) => b.date - a.date);
  }

  makeProjectItem(item, index) {

    let itemEl = document.createElement("div");
    itemEl.classList.add("list-item");

    if (isEditing) {
      itemEl.classList.add("active");
    }

    itemEl.innerHTML = /*html*/`
      <!-- ${Icon('file-table-outline', 'opacity-75')} -->

      ${Icon(isEditing ? 'puzzle-edit' : 'puzzle', isEditing ? 'cyan opacity-75' : 'opacity-50')}

      <div class="list-item-title">
        ${item.name ? item.name : '(без названия)'}
      </div>

      <div class="dateRelative">
        <span class="opacity-50">${dateRelative(item.date)}</span>
      </div>

      <div class="dateAbsolute">
        <span>${dateString(item.date)}</span>
      </div>

      <!-- <div class="icon-button">
        ${Icon('trash-can-outline', 'red opacity-50')}
      </div> -->
    `;

    itemEl.onclick = () => setTimeout(() => this.projectListSelect(index), 50); // TODO //

    return itemEl;
  }

  makeExampleProjectItem(item, index) {
    let itemEl = document.createElement("div");
    itemEl.classList.add("list-item");

    itemEl.innerHTML = /*html*/`
      ${Icon('star', 'opacity-50')}

      <div class="list-item-title">
        ${item.name ? item.name : '(без названия)'}
      </div>

      <div class="dateRelative">
        <span class="opacity-50">${item.description}</span>
      </div>

      <div>
        <br><br>
      </div>
    `;

    itemEl.onclick = () => this.projectListSelectExample(index);

    return itemEl;
  }

  makeExamplesFolderItem() {
    let itemEl = document.createElement("div");
    itemEl.classList.add("list-item");

    itemEl.innerHTML = /*html*/`
      ${Icon('folder-outline', 'dark opacity-50')}
      <div class="list-item-title">Примеры</div>

      <div class="dateRelative">
        <span class="opacity-50">Встроенные примеры программ</span>
      </div>
    `;

    itemEl.onclick = () => setTimeout(() => this.displayExamples(), 50); // TODO //
    return itemEl;
  }

  makeReturnItem() {
    let itemEl = document.createElement("div");
    itemEl.classList.add("list-item");

    itemEl.innerHTML = /*html*/`
      ${Icon('keyboard-backspace', 'dark opacity-50')}
      <div class="list-item-title">Назад</div>

      <div>
        <br><br>
      </div>

      <div class="dateRelative">
        <span class="opacity-50">Вернуться в список проектов</span>
      </div>
    `;

    itemEl.onclick = () => setTimeout(() => this.displayProjects(), 100); // TODO //
    return itemEl;
  }

  makeAutosaveItem() {
    let itemEl = document.createElement("div");
    itemEl.classList.add("list-item");

    const item = autosave; // TODO //

    itemEl.innerHTML = /*html*/`
      ${Icon('clock-time-three-outline', 'dark opacity-50')}

      <div class="list-item-title">
        Авто-сохранение
      </div>

      <div class="dateRelative">
        <span class="opacity-50">${dateRelative(item.date)}</span>
      </div>

      <div class="dateAbsolute">
        <span>${dateString(item.date)}</span>
      </div>

      <!-- <div class="icon-button">
        ${Icon('trash-can-outline', 'red opacity-50')}
      </div> -->
    `;

    itemEl.onclick = () => {

    }; // TODO //
    return itemEl;
  }

  makeNewProjectItem() {
    let itemEl = document.createElement("div");
    itemEl.classList.add("list-item");

    const item = autosave; // TODO //

    itemEl.innerHTML = /*html*/`
      ${Icon('puzzle-outline', 'dark opacity-50')}

      <div class="list-item-title">
        Новый проект
      </div>

      <div class="dateRelative">
        <span class="opacity-50">Создать чистый проект</span>
      </div>
    `;

    itemEl.onclick = () => {

    }; // TODO //
    return itemEl;
  }

  updateTitle(title) {
    this.name = title;
    if (this.active) {
      this.setActive(true);
    }
  }

  displayProjects() {
    // this.headerTitleEl.innerText = 'Сохранённые проекты';
    this.updateTitle('Проекты');

    this.projectsListEl.innerText = '';
    this.projectsListEl.appendChild(this.makeExamplesFolderItem());
    this.projectsListEl.appendChild(this.makeNewProjectItem());
    this.projectsListEl.appendChild(this.makeAutosaveItem());

    this.projectsList.forEach((item, index) => {
      const isEditing = index == 1; // TODO - TODO - TODO //
      item.active = isEditing;
      this.projectsListEl.appendChild(new ProjectListItem(item, () => this.projectListSelect(index)));
    });
  }

  displayExamples() {
    // this.headerTitleEl.innerText = 'Примеры';
    this.updateTitle('Примеры');

    this.projectsListEl.innerText = '';
    this.projectsListEl.appendChild(this.makeReturnItem());

    // this.examplesList.forEach((item, index) => {
    exampleList.forEach((item, index) => {
      this.projectsListEl.appendChild(this.makeExampleProjectItem(item, index));
    });
  }

  projectListSelect(index) {
    document.app.setLoading(true, 0);

    setTimeout(() => {
      console.log(this.projectsList[index]);
      document.app.panels.blockly.load(this.projectsList[index].data);
      document.app.panelSelect(document.app.panels.blockly);
    }, 75);
  }

}