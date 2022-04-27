import Panel from './Panel'

import * as Blockly from 'blockly/core'
import * as Ru from 'blockly/msg/ru'

import 'blockly/blocks';
import 'blockly/javascript';
import BlocklyLua from 'blockly/lua'

import MurToolbox from '../blockly-wrapper/Toolbox'
import Blocks from '../blockly-wrapper/Blocks'
import '../blockly-wrapper/BlocklyStyle'

import mur from '../vehicle/apiGameMur'

const blocklyConfig = {
  grid: {
    spacing: 26,
    length: 2,
    colour: '#ccc',
    snap: true
  },
  zoom: {
    controls: true,
    wheel: true,
    pinch: true,
    startScale: 1.0,
    maxScale: 2.0,
    minScale: 0.3,
    scaleSpeed: 1.15,
  },
  // css: false,
  move: {
    drag: true,
    wheel: true
  },
  scrollbars: true,
  media: '/blockly-media/', // TODO!!!
  trashcan: true,
  // renderer: 'thrasos', // thrasos, zelos
  // renderer: 'zelos',
  renderer: 'custom_renderer',
  horizontalLayout: true,
  collapse: false,
  toolbox: MurToolbox,
  // toolbox: document.getElementById('toolbox')
}

// const example_code = {"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defreturn","id":"xeua1:/f#:}ln3|l(jJO","x":100,"y":-87,"extraState":{"params":[{"name":"ticks","id":"r)`vzf?vojnEoKMg?x*f"}]},"icons":{"comment":{"text":"Опишите эту функцию…","pinned":false,"height":80,"width":160}},"fields":{"NAME":"super_sinus"},"inputs":{"STACK":{"block":{"type":"variables_set","id":"WmDo=bA9|q6Sfo+}h6VX","fields":{"VAR":{"id":"Iun5SN}x^sIKG[Gwyd*u"}},"inputs":{"VALUE":{"block":{"type":"math_round","id":"a$C)e$VZ2)jqY2`!7pxL","fields":{"OP":"ROUND"},"inputs":{"NUM":{"block":{"type":"math_arithmetic","id":"HM/lgMnV(W9uE(edSQ}O","fields":{"OP":"ADD"},"inputs":{"A":{"block":{"type":"math_single","id":"ul04wZG7T4*T]c(;W,aU","fields":{"OP":"ABS"},"inputs":{"NUM":{"block":{"type":"math_arithmetic","id":"H2HLgv:WUUx4W8nw!T)y","fields":{"OP":"MULTIPLY"},"inputs":{"A":{"block":{"type":"math_trig","id":",d%Hu@@)/ZSf5oT1$x{3","fields":{"OP":"SIN"},"inputs":{"NUM":{"block":{"type":"variables_get","id":"b.x^]tVFNop4n2G:8oFo","fields":{"VAR":{"id":"r)`vzf?vojnEoKMg?x*f"}}}}}}},"B":{"block":{"type":"math_number","id":"b#}UO2Q2w7!N`vJS-s4@","fields":{"NUM":80}}}}}}}}},"B":{"block":{"type":"math_number","id":"6MnoRUC%v]aepjGC_E}!","fields":{"NUM":20}}}}}}}}}}}},"RETURN":{"block":{"type":"variables_get","id":"=cSjbJ%-wCmM@m)AKG@*","fields":{"VAR":{"id":"Iun5SN}x^sIKG[Gwyd*u"}}}}}},{"type":"variables_set","id":"Wk4.6|J2AY3/]kh`w$?i","x":123,"y":145,"fields":{"VAR":{"id":"97;yimqMJ0z-Lg`:,2Jj"}},"inputs":{"VALUE":{"block":{"type":"math_number","id":"$c7_yAKX[M_H4lFX]*dS","fields":{"NUM":0}}}},"next":{"block":{"type":"controls_whileUntil","id":"1Mq]mK{Ls~F~%8:qaaRK","fields":{"MODE":"WHILE"},"inputs":{"BOOL":{"block":{"type":"logic_boolean","id":")Q26Cpa=@-)SWE({i_cH","fields":{"BOOL":"TRUE"}}},"DO":{"block":{"type":"math_change","id":"x;3?YR(R*fATqA@fMBk@","fields":{"VAR":{"id":"97;yimqMJ0z-Lg`:,2Jj"}},"inputs":{"DELTA":{"shadow":{"type":"math_number","id":"opb/F~=oe2@zy(mZ=Z?4","fields":{"NUM":25}}}},"next":{"block":{"type":"controls_if","id":"v6|$h37U4Cc:)L[3fa(a","extraState":{"hasElse":true},"inputs":{"IF0":{"block":{"type":"mur_get_color","id":"CmK3wBd{NKSPG=8n~3s(","fields":{"MODE":"SENSOR_COLOR_WHITE"}}},"DO0":{"block":{"type":"mur_actuator","id":"DH^UqR6RQ[az0D5L`cLh","inputs":{"Index":{"block":{"type":"math_number","id":"CwC-5gD?,0!92:YS2dP]","fields":{"NUM":0}}},"Power":{"block":{"type":"math_number","id":"x9[!-sc[v.RPC@GIWm.O","fields":{"NUM":75}}},"Delay":{"block":{"type":"math_number","id":"Y/^=,v?hX!6b7elg[S/G","fields":{"NUM":0}}}}}},"ELSE":{"block":{"type":"mur_actuator","id":"9xV;|z=pt}]0mb4yEKu8","inputs":{"Index":{"block":{"type":"math_number","id":"8|qVODcr^+!]Q$;q{Vy#","fields":{"NUM":0}}},"Power":{"block":{"type":"math_number","id":"%k09nPRmR+#%,993(0kf","fields":{"NUM":0}}},"Delay":{"block":{"type":"math_number","id":"$37oUCC~+3t~~S0;VgYC","fields":{"NUM":0}}}}}}},"next":{"block":{"type":"mur_actuator","id":"P5i`s@c)X8DtRk]DwXdE","inputs":{"Index":{"block":{"type":"math_number","id":"-Ia]5%3fUJ[f9)bcra}U","fields":{"NUM":1}}},"Power":{"block":{"type":"procedures_callreturn","id":"pq5i^{M6A){+F!*2syc;","inline":true,"extraState":{"name":"super_sinus","params":["ticks"]},"inputs":{"ARG0":{"block":{"type":"variables_get","id":"Gg32W-+y78lNG2H4gQ*v","fields":{"VAR":{"id":"97;yimqMJ0z-Lg`:,2Jj"}}}}}}},"Delay":{"block":{"type":"math_number","id":"XL1NeY*]G,kEb,Lc6@|,","fields":{"NUM":0}}}},"next":{"block":{"type":"mur_set_power","id":"NDq:-Aw+).{S}Fr=0[g4","enabled":false,"inputs":{"Index":{"block":{"type":"math_number","id":"NVn)n{ueANKh.s$3aT}9","fields":{"NUM":0}}},"Power":{"block":{"type":"math_number","id":"HN)@aD8O]aDh4+FF?}Ug","fields":{"NUM":0}}},"Delay":{"block":{"type":"math_number","id":"|/t^+(rzyE2:rX|6zTt^","fields":{"NUM":0}}}},"next":{"block":{"type":"mur_delay","id":"}oF=Fx3rL}5YR?mBj7*j","enabled":false,"inputs":{"sleepSeconds":{"block":{"type":"math_number","id":"W|sT4J:KfmR+MVLDK1OU","fields":{"NUM":0.1}}}}}}}}}}}}}}}}}}]},"variables":[{"name":"ticks","id":"r)`vzf?vojnEoKMg?x*f"},{"name":"counter","id":"97;yimqMJ0z-Lg`:,2Jj"},{"name":"res","id":"Iun5SN}x^sIKG[Gwyd*u"},{"name":"delay","id":"29jU7naadNhY~_e}zI,q"}]};

const example_code = {"blocks":{"languageVersion":0,"blocks":[{"type":"mur_loop_infinite","id":"3PnRlq%TAfi=WNER?K?+","x":819,"y":-117,"enabled":false,"inputs":{"STACK":{"block":{"type":"controls_if","id":"v6|$h37U4Cc:)L[3fa(a","extraState":{"hasElse":true},"inputs":{"IF0":{"block":{"type":"mur_get_color","id":"CmK3wBd{NKSPG=8n~3s(","fields":{"MODE":"SENSOR_COLOR_WHITE"}}},"DO0":{"block":{"type":"mur_set_power","id":"0m5MKkq3KTmM(aV(Y.T~","inputs":{"Index":{"block":{"type":"math_number","id":"cnR.$qR.a!EPcUyqzN--","fields":{"NUM":1}}},"Power":{"block":{"type":"math_number","id":"$sop}Q}xa[Z(R7eB|KFE","fields":{"NUM":-15}}},"Delay":{"block":{"type":"math_number","id":"eRx{LyeJ2$t-V$i_#wS|","fields":{"NUM":0}}}},"next":{"block":{"type":"mur_set_power","id":"IdseiGBxVAF8iUN@H0_|","inputs":{"Index":{"block":{"type":"math_number","id":"Pyughp!SVwnBVf,4X^no","fields":{"NUM":0}}},"Power":{"block":{"type":"math_number","id":"I##|).zC~qG3YRVvNF`H","fields":{"NUM":15}}},"Delay":{"block":{"type":"math_number","id":"N*HGddcAwj%_/Tj4l5Fj","fields":{"NUM":0}}}}}}}},"ELSE":{"block":{"type":"mur_set_power","id":"2M:o/;*RsQvJw|6/sp9+","inputs":{"Index":{"block":{"type":"math_number","id":"Ar+0C)t%~Kd:s}9Kc^nY","fields":{"NUM":0}}},"Power":{"block":{"type":"math_number","id":"TI8*S{0To5NPUU3#bP!q","fields":{"NUM":0}}},"Delay":{"block":{"type":"math_number","id":"dT8nl::v^Wab/=54[OM7","fields":{"NUM":0}}}},"next":{"block":{"type":"mur_set_power","id":"P5x?38Cs_t1Fj@Yc4xVP","inputs":{"Index":{"block":{"type":"math_number","id":"6x6wworL~?6ReT+BEsw*","fields":{"NUM":1}}},"Power":{"block":{"type":"math_number","id":"Yg9LfgIFYt_bEJRpvYUY","fields":{"NUM":0}}},"Delay":{"block":{"type":"math_number","id":"m#(C8G3y[eIZIu=0z]5)","fields":{"NUM":0}}}}}}}}}}}}},{"type":"mur_loop_infinite","id":"_^t-Oo;`o(AhJY^qZDN;","x":1261,"y":-117,"enabled":false,"inputs":{"STACK":{"block":{"type":"variables_set","id":"(22;{D,qAwk#:q4pyuZu","fields":{"VAR":{"id":"]QI~H-_-/5O61CUw54kN"}},"inputs":{"VALUE":{"block":{"type":"math_round","id":"3tSHTNZyudNW^.:jrXA^","fields":{"OP":"ROUND"},"inputs":{"NUM":{"block":{"type":"math_arithmetic","id":"Dj0aYE[;+L~X]C9T2|cN","fields":{"OP":"MULTIPLY"},"inputs":{"A":{"block":{"type":"math_number","id":"W@WZv99WrLk_STB1n]I+","fields":{"NUM":-0.3}}},"B":{"block":{"type":"mur_get_imu_axis","id":"gC/Ut4qCrJdVJWCkEs/7","fields":{"MODE":"IMU_AXIS_YAW"}}}}}}}}}},"next":{"block":{"type":"mur_set_power","id":"QIhZm-!CUnmQH(N,(b]C","inputs":{"Index":{"block":{"type":"math_number","id":"*Q9ajvHR}%8!c+i^5QR3","fields":{"NUM":0}}},"Power":{"block":{"type":"variables_get","id":"NgKG8:|P9yMO^dJe_8ST","fields":{"VAR":{"id":"]QI~H-_-/5O61CUw54kN"}}}},"Delay":{"block":{"type":"math_number","id":"Wt(VMHybcgP|WLo?h.@H","fields":{"NUM":0}}}},"next":{"block":{"type":"mur_set_power","id":"k-8q]n9xvtTH}GD`jWm?","inputs":{"Index":{"block":{"type":"math_number","id":"*XpTBOMyLE12@G-8xot4","fields":{"NUM":1}}},"Power":{"block":{"type":"variables_get","id":"5;iQ2{}EQf1kIebnC78c","fields":{"VAR":{"id":"]QI~H-_-/5O61CUw54kN"}}}},"Delay":{"block":{"type":"math_number","id":":BQ,,s~.=?(xKN}=`yBe","fields":{"NUM":0}}}}}}}}}}}},{"type":"mur_loop_infinite","id":"9{,v|IYy6m(P;bLc+P.^","x":273,"y":-143,"inputs":{"STACK":{"block":{"type":"mur_delay","id":"+4f`RI;sY;c:vwf*7msv","inputs":{"sleepSeconds":{"block":{"type":"math_number","id":"{1X}!Cx^G@{uVSwVYV^W","fields":{"NUM":3}}}},"next":{"block":{"type":"variables_set","id":"d1qFhw1rS[EqjS?ZM[=6","fields":{"VAR":{"id":"8@4vQig94DBNTyq{5EJ,"}},"inputs":{"VALUE":{"block":{"type":"math_number","id":"*Q?~Dq@.7x0k-z+nG}z6","fields":{"NUM":12}}}},"next":{"block":{"type":"mur_loop_infinite","id":"=W0XIrd@U,nDsHIh9wO7","inputs":{"STACK":{"block":{"type":"controls_if","id":"}ItEHH/=:/dss^-i^0Ij","extraState":{"hasElse":true},"inputs":{"IF0":{"block":{"type":"mur_get_color","id":"r@3=$^dw|{}~R{zk@xaM","fields":{"MODE":"SENSOR_COLOR_WHITE"}}},"DO0":{"block":{"type":"variables_set","id":"L2j]|_:$LLdp+}@F/P(_","fields":{"VAR":{"id":"]QI~H-_-/5O61CUw54kN"}},"inputs":{"VALUE":{"block":{"type":"math_number","id":":;1XP-#[WkZ!5PWV[~0X","fields":{"NUM":7}}}}}},"ELSE":{"block":{"type":"variables_set","id":"ri;;;U3o1fb}w|hsaYh*","fields":{"VAR":{"id":"]QI~H-_-/5O61CUw54kN"}},"inputs":{"VALUE":{"block":{"type":"math_number","id":"2bQ9L*35sA0M+62s.hd#","fields":{"NUM":-5}}}}}}},"next":{"block":{"type":"mur_set_power","id":"/GLhR[TZ[cLR.Sy:AA_m","inputs":{"Index":{"block":{"type":"math_number","id":"!-9Z{f=$F]w@?+d0Q[s{","fields":{"NUM":0}}},"Power":{"block":{"type":"math_arithmetic","id":"nO35c.CkLO^M~mo3C?8]","fields":{"OP":"ADD"},"inputs":{"A":{"block":{"type":"variables_get","id":"Xz.@7MnaepQ$iAyz9y_J","fields":{"VAR":{"id":"]QI~H-_-/5O61CUw54kN"}}}},"B":{"block":{"type":"variables_get","id":"~!Q2IXM}[H*|jCpvV=mc","fields":{"VAR":{"id":"8@4vQig94DBNTyq{5EJ,"}}}}}}},"Delay":{"block":{"type":"math_number","id":"uEHt{qKY-~uaq@Q[c0(W","fields":{"NUM":0}}}},"next":{"block":{"type":"mur_set_power","id":"|lNq5eS3Q2OSh5^F)G.E","inputs":{"Index":{"block":{"type":"math_number","id":"+j+H;2A^7h?CTPaRn}]!","fields":{"NUM":1}}},"Power":{"block":{"type":"math_arithmetic","id":"7^QbQKAOa~$opUP9|FVT","fields":{"OP":"MINUS"},"inputs":{"A":{"block":{"type":"variables_get","id":"I#wlCX:#:7@KrZYi)b?Y","fields":{"VAR":{"id":"]QI~H-_-/5O61CUw54kN"}}}},"B":{"block":{"type":"variables_get","id":"XSXc}9iT9Hu^G[oAcS|-","fields":{"VAR":{"id":"8@4vQig94DBNTyq{5EJ,"}}}}}}},"Delay":{"block":{"type":"math_number","id":"bEJj7UNf#yP:mY7WriIn","fields":{"NUM":0}}}}}}}}}}}}}}}}}}},{"type":"mur_loop_infinite","id":"V5}Tlw7|ZbA-8E2nSG{)","x":273,"y":325,"enabled":false,"inputs":{"STACK":{"block":{"type":"variables_set","id":".hUrWa2KEG1ZHhPrB2)`","fields":{"VAR":{"id":"8@4vQig94DBNTyq{5EJ,"}},"inputs":{"VALUE":{"block":{"type":"math_number","id":"o1`cq#6F$p@Zu$uXWAJ9","fields":{"NUM":0}}}},"next":{"block":{"type":"variables_set","id":"_11_iZYJxh2YRZ~#G1qa","fields":{"VAR":{"id":"vwFV3XnP_JtZ=%;2[-Wy"}},"inputs":{"VALUE":{"block":{"type":"mur_get_imu_axis","id":"RO-^II]k$J6O}Vawh%`f","fields":{"MODE":"IMU_AXIS_YAW"}}}},"next":{"block":{"type":"mur_loop_infinite","id":".RBpkR`lYE2_kg}EeRo2","inputs":{"STACK":{"block":{"type":"variables_set","id":"5d}Goc].T)ONjb4]fVjG","enabled":false,"fields":{"VAR":{"id":"8@4vQig94DBNTyq{5EJ,"}},"inputs":{"VALUE":{"block":{"type":"logic_ternary","id":"e98E[G.(q`LAcH/@-MuK","inline":false,"inputs":{"IF":{"block":{"type":"mur_get_color","id":"}p4#$ILAH{U-#[aB[RQ3","fields":{"MODE":"SENSOR_COLOR_WHITE"}}},"THEN":{"block":{"type":"math_number","id":"d/1?Qw)u=^+i5/QIaEpp","fields":{"NUM":20}}},"ELSE":{"block":{"type":"math_number","id":"$@mjvYLr%gCZ.:0~L82]","fields":{"NUM":0}}}}}}},"next":{"block":{"type":"variables_set","id":"(r5|.Fmf^$4,JRs+K}ac","fields":{"VAR":{"id":"]QI~H-_-/5O61CUw54kN"}},"inputs":{"VALUE":{"block":{"type":"math_round","id":"lMD=%=7O!-I(sc%n~LsH","fields":{"OP":"ROUND"},"inputs":{"NUM":{"block":{"type":"math_arithmetic","id":"!]-_9KkB(h,K4hMs[K8@","fields":{"OP":"MULTIPLY"},"inputs":{"A":{"block":{"type":"math_number","id":"B,6^w*,xc!L~f;13%o1N","fields":{"NUM":-0.3}}},"B":{"block":{"type":"math_arithmetic","id":"s2oDZ,{b=E*b]5Ei?!!B","fields":{"OP":"MINUS"},"inputs":{"A":{"block":{"type":"mur_get_imu_axis","id":"rm4|m$.4A.Kh:p9CEmVt","fields":{"MODE":"IMU_AXIS_YAW"}}},"B":{"block":{"type":"variables_get","id":"m,xJlZ,yw^Eq@u_Y?pWT","fields":{"VAR":{"id":"vwFV3XnP_JtZ=%;2[-Wy"}}}}}}}}}}}}}},"next":{"block":{"type":"mur_set_power","id":"@*lvQwmSAk3#2P-V/zo+","inputs":{"Index":{"block":{"type":"math_number","id":"ULyQ{H3a~u@^s)73o^Uh","fields":{"NUM":0}}},"Power":{"block":{"type":"math_arithmetic","id":"nVRAyM#((tatl;@{S*$1","fields":{"OP":"ADD"},"inputs":{"A":{"block":{"type":"variables_get","id":"iby(:Wz8_DTP]YslutHQ","fields":{"VAR":{"id":"]QI~H-_-/5O61CUw54kN"}}}},"B":{"block":{"type":"variables_get","id":"hvl6O@jK:ZnZcr:RziJd","fields":{"VAR":{"id":"8@4vQig94DBNTyq{5EJ,"}}}}}}},"Delay":{"block":{"type":"math_number","id":"eygl{hE;(JDhip4nHy~L","fields":{"NUM":0}}}},"next":{"block":{"type":"mur_set_power","id":"!#!dV[|7#-f-Uc@h;Tug","inputs":{"Index":{"block":{"type":"math_number","id":"(j(KrL==8Mj,LYY!(5@e","fields":{"NUM":1}}},"Power":{"block":{"type":"math_arithmetic","id":"2_wKt`sKD0D;zan/Q$pA","fields":{"OP":"MINUS"},"inputs":{"A":{"block":{"type":"variables_get","id":"J/|(Q/;ff3;FRi5p)#(|","fields":{"VAR":{"id":"]QI~H-_-/5O61CUw54kN"}}}},"B":{"block":{"type":"variables_get","id":"^]aAq:a8]oQN*VzPhNF`","fields":{"VAR":{"id":"8@4vQig94DBNTyq{5EJ,"}}}}}}},"Delay":{"block":{"type":"math_number","id":"9lw_.%Q`VzDo%V=XMCnE","fields":{"NUM":0}}}}}}}}}}}}}}}}}}}}}]},"variables":[{"name":"ticks","id":"r)`vzf?vojnEoKMg?x*f"},{"name":"counter","id":"97;yimqMJ0z-Lg`:,2Jj"},{"name":"res","id":"Iun5SN}x^sIKG[Gwyd*u"},{"name":"delay","id":"29jU7naadNhY~_e}zI,q"},{"name":"yaw_delta","id":"]QI~H-_-/5O61CUw54kN"},{"name":"speed","id":"8@4vQig94DBNTyq{5EJ,"},{"name":"yaw_target","id":"vwFV3XnP_JtZ=%;2[-Wy"}]};


var workspace = null;

const filterGlow = `
    <filter id="filterGlow">
      <feDropShadow
        id="filterGlowShadow"
        stdDeviation="1.5"
        dx="0"
        dy="0"
        flood-color="#FFC"
        flood-opacity="0.85"
      ></feDropShadow>

      <feComposite
        in2="specOut"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
      ></feComposite>
    </filter>

    <filter id="filterShadow">
      <feDropShadow
        stdDeviation="1.0"
        dx="0"
        dy="0"
        flood-color="black"
        flood-opacity="0.5"
      ></feDropShadow>
    </filter>
    `

export default class BlocklyPanel extends Panel {

  onActiveChanged() {
    if (this.toolButtons) {
      if (this.active) {
        this.toolButtons.classList.remove("hidden");
      } else {
        this.toolButtons.classList.add("hidden");
      }
    }
  }


  init() {
    this.container.classList.add("fluid");

    this.toolButtons = document.createElement("div");
    this.toolButtons.classList.add("buttons-group");
    this.toolButtons.id = "buttons-blockly";
    document.querySelector("#head").appendChild(this.toolButtons);

    this.onActiveChanged();

    const actions = [
      { name: 'run_lua',  func: this.run_lua },
      { name: 'run_js',   func: this.run_js },
      { name: 'stop',     func: this.stop },
      { name: 'example',  func: this.example },
      { name: 'load',     func: this.load },
      { name: 'save',     func: this.save },
    ];

    actions.forEach(action => {
      const actionButton = document.createElement("div");
      actionButton.classList.add("panel-button");
      actionButton.onclick = () => {
        window.setTimeout(() => this[action.func.name](), 50);
      };
      actionButton.innerText = action.name;
      this.toolButtons.appendChild(actionButton);
    });

    /* --- Blockly --- */

    this.workspace = null;
    this.scriptWorker = null;

    Blocks.init();
    Ru["CLEAN_UP"] = "Упорядочить блоки";
    Blockly.setLocale(Ru)

    this.blocklyDiv = document.createElement("div");
    this.blocklyDiv.id = "blocklyDiv";
    this.blocklyDiv.classList.add("pretty");
    this.container.appendChild(this.blocklyDiv);

    this.reinject(false);
  }

  generate_code(workspace) {
    Blockly.JavaScript.STATEMENT_PREFIX = 'await mur.h(_scriptId, %1);\n'
    var code = Blockly.JavaScript.workspaceToCode(workspace)
    code = code.replace(/(?<=^|\n)function \w+\(.*\)/g, 'async $&') // TODO: do this better
    return code
  }

  stop() {
    this.scriptStatus = 'stopped'
    this.scriptWorker.terminate()

    mur.controlScriptStop()
    const paramsContext = {
      direct_power: [0, 0, 0, 0],
      direct_mode: 0b00001111,
      axes_speed: [0, 0, 0, 0],
      axes_regulators: 0,
      target_yaw: null,
      actuator_power: [0, 0]
    }
    mur.context = paramsContext // TODO: move context to global scope?
    mur.controlContext(paramsContext)

    this.workspace.highlightBlock(null)

    this.reinject(false);

    document.querySelectorAll(`.blocklyDraggable`).forEach(node => {node.childNodes[0].setAttribute('filter', '')});
    // document.querySelectorAll(`.blocklyDraggable`).forEach(node => {node.childNodes[0].setAttribute('filter', 'url(#filterShadow')});
  }

  save() {
    const savedBlocks = Blockly.serialization.workspaces.save(this.workspace)
    console.log(savedBlocks)
    localStorage.savedBlocks = JSON.stringify(savedBlocks)
  }

  load() {
    const savedBlocks = localStorage.savedBlocks
    if (savedBlocks) {
      Blockly.serialization.workspaces.load(JSON.parse(savedBlocks), this.workspace)
    }

    this.workspace.zoomToFit()
  }

  example() {
    console.log(this);
    Blockly.serialization.workspaces.load(example_code, this.workspace)
  }

  run_lua() {
    BlocklyLua.STATEMENT_PREFIX = 'h(%1)\n'
    this.code = BlocklyLua.workspaceToCode(this.workspace)

    this.codeBlockIds = []
    const regexpBlockId = new RegExp(/^ *h\('(.*)'\)$/, 'gm')
    // var result

    this.code = this.code.replace(regexpBlockId, ($0, $1) => {
      this.codeBlockIds.push($1)
      return `h('${this.codeBlockIds.length - 1}')`
    })

    console.log(this.code)

    // result = regexpBlockId.exec(this.code)
    // console.log(result)
    // while ((result = regexpBlockId.exec(this.code)) !== null) {
    //   console.log(result)
    //   this.codeBlockIds.push(result['1'])
    // }

    console.log(this.codeBlockIds)
    mur.controlScriptRun({ script: this.code })

    // TODO: disable editing while executing
  }

  run_js() {
    this.code = this.generate_code(this.workspace)
    console.log(this.code)

    this.reinject(true)

    if (this.scriptWorker != null) {
      this.scriptWorker.terminate()
    }

    this.scriptWorker = new Worker('/js/interpreter.js', { type: 'module' })

    this.scriptWorker.onmessage = this.workerMsgHandler

    var json = Blockly.serialization.workspaces.save(this.workspace)

    // Store top blocks separately, and remove them from the JSON.
    var blocks = json.blocks.blocks
    var topBlocks = blocks.slice() // Create shallow copy.
    blocks.length = 0

    // Load each block into the workspace individually and generate code.
    var allCode = []
    var headless = new Blockly.Workspace()

    topBlocks.forEach(block => {
      blocks.push(block)
      Blockly.serialization.workspaces.load(json, headless)
      allCode.push(this.generate_code(headless))
      blocks.length = 0
    });

    console.log(allCode)

    this.scriptWorker.postMessage({ // TODO: copypasta
      type: 'telemetry',
      telemetry: JSON.parse(JSON.stringify(mur.telemetry))
    })

    this.scriptWorker.postMessage({
      type: 'run',
      scripts: allCode
    })

    this.scriptStatus = 'running'
  }

  updateTelemetry(telemetry) {
    if (this.scriptStatus === 'running') {
      this.scriptWorker.postMessage({
        type: 'telemetry',
        telemetry: JSON.parse(JSON.stringify(telemetry)) // TODO: should do it in better way
      })
    }
  }

  reinject (readonly = false) {
    if (this.workspace) {
      this.workspaceBlocks = Blockly.serialization.workspaces.save(this.workspace)
      this.workspace.dispose()
    }

    // this.$refs.blocklyInstance.inject(readonly)
    blocklyConfig.readOnly = readonly;
    blocklyConfig.zoom.controls = !readonly;
    blocklyConfig.zoom.wheel = !readonly;
    blocklyConfig.zoom.pinch = !readonly;

    blocklyConfig.move.drag = !readonly;
    blocklyConfig.move.wheel = !readonly;
    // blocklyConfig.scrollbars = !readonly;

    this.workspace = Blockly.inject(this.blocklyDiv, blocklyConfig);
    workspace = this.workspace
    Blockly.svgResize(this.workspace);

    if (this.workspaceBlocks) {
      Blockly.serialization.workspaces.load(this.workspaceBlocks, this.workspace)
    }

    this.workspace.zoomToFit()

    if (readonly) {
      document.querySelectorAll(".blocklyMainWorkspaceScrollbar").forEach(el => el.classList.add("hidden"));
    } else {
      document.querySelectorAll(".blocklyMainWorkspaceScrollbar").forEach(el => el.classList.remove("hidden"));
    }

    let defs = document.getElementsByClassName("blocklySvg")[0].getElementsByTagName("defs")[1];
    defs.innerHTML += filterGlow
  }

  workerMsgHandler(e) {
    const data = Object.assign({}, e.data)

    if (!('type' in data)) {
      return
    }

    if (data.type === 'mur.h') {
      const blocks = data.blockId

      for (const key in blocks) {
        // workspace.highlightBlock(key, blocks[key])
        document.querySelector(`[data-id="${key}"`).childNodes[0].setAttribute('filter', blocks[key] ? 'url(#filterGlow)' : '');
      }

      return
    }

    if (data.type === 'context') {
      const ctx = data.context

      const paramsContext = {
        direct_power: ctx.motor_powers,
        direct_mode: 0b00001111, // TODO
        axes_speed: ctx.motor_axes,
        axes_regulators: ctx.regulators,
        target_yaw: null, // TODO
        actuator_power: ctx.actuators
      }

      // TODO: fill context correctly in inpertreter and don't fill it here

      mur.context = paramsContext // TODO: move context to global scope?
      mur.controlContext(paramsContext)
    }

    if (data.type === 'state') {
      if (data.state === 'done') {
        console.log('script done')
        workspace.highlightBlock(null)
        // this.workspace.highlightBlock(null)
      }
    }

    // e = null
  }

}