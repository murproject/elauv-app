import Panel from './Panel';
import Zdog from 'zdog';

export default class VizAuv extends Panel {
  begin() {
    this.isBottomPanel = true;

    this.html = /*html*/`
      <canvas class="zdog-canvas" width="300" height="300"></canvas>
    `;
  }

  init() {
    pan = this;
    this.setIcon('rotate-orbit');
  }

  static makeVizauv(parent) {
    return makeVizauv(parent);
  }
}

const transparent = '#FFF0';
const black = '#333';
const grey = '#555';
const acryl = '#777';
const orange = '#E62';
const garnet = '#CC2255';
const purple = '#663366';
const cyan = '#3399BB';
const green = '#22AA22';

const greenLight = '#55AA55';
const greenDark = '#88CC88';

let dragged = false;

const abs = Math.abs;
const max = Math.max;
const min = Math.min;

const zero_xyz = {x: 0, y: 0, z: 0};

let c = new Date();

let context = {
  motors: {
    hl: 0,
    hr: 0,
    vf: 0,
    vb: 0,
  },

  rot: {
    yaw: 0,
    pitch: 0,
    roll: 0,
  },

  leds: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

let illo = null;
let origin = null;

let vehicle = null;
let th_hl = null;
let th_hr = null;
let th_vf = null;
let th_vb = null;

let parent_obj = undefined;

function makeVizauv(parent) {
  parent_obj = parent;

  illo = new Zdog.Illustration({
    element: '.zdog-canvas',
    dragRotate: true,
    rotate: {x: -Zdog.TAU/8 * 1, y: Zdog.TAU/8 * 4},
    zoom: 1.5,
    onDragStart: function() {
      dragged = true;
    },
  });

  origin = new Zdog.Shape({
    addTo: illo,
    stroke: false,
  });

  vehicle = makeVehicle(origin, zero_xyz);

  th_hl = makeThruster(vehicle.origin, {x:  35, y: 0, z: -35}, {y: -Zdog.TAU/8});
  th_hr = makeThruster(vehicle.origin, {x: -35, y: 0, z: -35}, {y:  Zdog.TAU/8});
  th_vf = makeThruster(vehicle.origin, {x:   0, y: 0, z:  35}, {x:  Zdog.TAU/4});
  th_vb = makeThruster(vehicle.origin, {x:   0, y: 0, z: -35}, {x:  Zdog.TAU/4});

  console.log(vehicle);

  const vizauv = {
    vehicle: vehicle,
    th_hl: th_hl,
    th_hr: th_hr,
    th_vf: th_vf,
    th_vb: th_vb,
  };

  animate();

  vizauv.updContext = (ctx) => {
    context = ctx;
  };

  return vizauv;
}

function sign(number) {
  return number > 0 ? 1 : -1;
}

function makeGizmo(parent) {
  const gizmo = {};

  gizmo.origin = new Zdog.Polygon({
    addTo: parent,
    color: transparent,
    stroke: false,
  });

  function makeGizmoLine(axis, color = cyan) {
    const line = new Zdog.Shape({
      addTo: gizmo.origin,
      path: [{}, {}],
      stroke: 1,
      color: color + '22',
    });
    line.path[0][axis] = -50;
    line.path[1][axis] = 50;
    line.updatePath();
    return line;
  }

  gizmo.lineX = makeGizmoLine('x', green);
  gizmo.lineZ = makeGizmoLine('z', garnet);

  return gizmo;
}

function makeVehicle(parent, pos = zero_xyz, rot = zero_xyz) {
  const vehicle = {
    pos: {x: pos.x, y: pos.y, z: pos.z},
    rot: {x: rot.x, y: rot.y, z: rot.z},
  };

  vehicle.origin = new Zdog.Polygon({
    addTo: parent,
    translate: vehicle.pos,
    rotate: vehicle.rot,
    color: transparent,
    stroke: false,
  });

  vehicle.gr = new Zdog.Group({
    translate: vehicle.pos,
    rotate: vehicle.rot,
    addTo: vehicle.origin,
    color: transparent,
    stroke: false,
  });

  vehicle.grBody = new Zdog.Group({
    translate: vehicle.pos,
    rotate: vehicle.rot,
    addTo: vehicle.origin,
    color: transparent,
    stroke: false,
  });

  vehicle.bodyTop = new Zdog.RoundedRect({
    addTo: vehicle.origin,
    width: 100,
    height: 100,
    fill: true,
    cornerRadius: 30,
    stroke: 5,
    color: '#59B1',
    translate: {z: 0, y: -15},
    rotate: {x:  Zdog.TAU/4},
  });

  vehicle.bodyBottom = new Zdog.RoundedRect({
    addTo: vehicle.gr,
    width: 100,
    height: 100,
    fill: true,
    cornerRadius: 30,
    stroke: 5,
    color: '#59B1',
    translate: {z: 0, y:  15},
    rotate: {x:  Zdog.TAU/4},
  });

  new Zdog.Shape({
    addTo: vehicle.gr,
    visible: false,
    translate: {z: 0, y:  200},
  });

  vehicle.bodyColba = new Zdog.Cylinder({
    addTo: vehicle.grBody,
    diameter: 35,
    length: 18,
    fill: true,
    stroke: 5,
    color: '#ADF2',
    translate: {z: 0, y: 0},
    rotate: {x:  Zdog.TAU/4},
  });

  vehicle.bodyColbaBottom = new Zdog.Ellipse({
    addTo: vehicle.grBody,
    diameter: 35,
    length: 18,
    fill: true,
    stroke: 5,
    color: '#79AF',
    translate: {z: 0, y: 10},
    rotate: {x:  Zdog.TAU/4},
  });

  vehicle.bodyColbaTop = new Zdog.Ellipse({
    addTo: vehicle.grBody,
    diameter: 40,
    length: 18,
    fill: true,
    stroke: 0,
    color: '#FFF7',
    translate: {z: 0, y: -10},
    rotate: {x:  Zdog.TAU/4},
  });

  function makeLed(x, z, rot) {
    return [
      new Zdog.Box({
        addTo: vehicle.grBody,
        stroke: 3,
        width: 1.5,
        height: 1.5,
        depth: 2.5,
        translate: {x: x, y: +10, z: z},
        rotate: {y: rot != 0 ? Zdog.TAU / rot : 0},
        color: '#0007',
      }),
      new Zdog.Box({
        addTo: vehicle.grBody,
        stroke: 1,
        width: 0.25,
        height: 0.25,
        depth: 0.75,
        translate: {x: x, y: +10, z: z},
        rotate: {y: rot != 0 ? Zdog.TAU / rot : 0},
        color: '#0007',
      }),
    ];
  }

  vehicle.leds = [
    makeLed(-14, 5, -16),
    makeLed(-14, -5, 16),
    makeLed( 14, -5, -16),
    makeLed( 14, 5, 16),
  ];

  return vehicle;
}

function makeThruster(parent, pos = zero_xyz, rot = zero_xyz) {
  const th = {
    pos: {x: pos.x, y: pos.y, z: pos.z},
    rot: {x: rot.x, y: rot.y, z: rot.z},
  };

  th.origin = new Zdog.Polygon({
    addTo: parent,
    translate: th.pos,
    rotate: th.rot,
    color: transparent,
    stroke: false,
  });

  th.group = new Zdog.Group({
    translate: th.pos,
    rotate: th.rot,
    addTo: parent,
    color: transparent,
    stroke: false,
  });

  th.cylinder = new Zdog.Cylinder({
    addTo: th.group,
    diameter: 30,
    length: 25,
    fill: true,
    stroke: true,
    color: black,
    backface: grey,
  });

  th.propeller = new Zdog.Rect({
    addTo: th.group,
    width: 20,
    height: 1,
    stroke: 10,
    rotate: {z: Math.random() * 100},
    color: black + 'A',
  });

  th.arrow = makeArrow(th);
  th.sprinkle = makeSprinkle(th.origin);

  th.update = function(power, isAuto = false) {
    th.cylinder.color = isAuto ? greenDark : black;
    th.propeller.color = isAuto ? greenDark + 'AA' : black + 'A',

    th.propeller.rotate.z += power * 0.005;
    th.arrow.upd(power, isAuto);
    th.sprinkle.upd(power);
  };

  return th;
}

function makeArrow(parent, pos = zero_xyz, rot = zero_xyz, color = cyan) {
  const arrow = {
    pos: {x: pos.x, y: pos.y, z: pos.z},
    rot: {x: rot.x, y: rot.y, z: rot.z},
    colorBase: color,
    color: color,
    opacity: 0.0,
    parent: parent,
  };

  arrow.rot.x += Zdog.TAU/4;

  arrow.origin = new Zdog.Polygon({
    addTo: arrow.parent.origin,
    translate: arrow.pos,
    rotate: arrow.rot,
    color: transparent,
  });

  arrow.trig = new Zdog.Polygon({
    addTo: arrow.origin,
    radius: 10,
    sides: 3,
    stroke: 10,
    color: arrow.color,
  });

  arrow.trig.upd = function(power) {
    this.translate.y = power + arrow.y;
    this.scale.y = min(abs(power) * 0.1, 1.0) * -sign(power);
    this.color = arrow.color;
    this.updatePath();
  };

  arrow.line = new Zdog.Shape({
    addTo: arrow.origin,
    path: [{x: 0, y: 0}, {x: 0}],
    stroke: 6,
  });

  arrow.line.upd = function(power) {
    const length = power;
    this.path[1].y = length;
    this.updatePath();
    this.color = arrow.color;
  };

  arrow.upd = function(power, isAuto = false) {
    power *= 0.75;
    this.y = 7 * sign(power);
    arrow.trig.upd(power);
    this.opacity = Math.pow(abs(power * 0.3), 2);
    this.colorBase = isAuto ? greenLight : cyan;
    this.color = this.colorBase + decToHex(arrow.opacity);
    arrow.line.upd(power);
  };

  arrow.upd(0);

  return arrow;
}

function makeSprinkle(parent, color = cyan) {
  const sprinkle = {
    parent: parent,
    color: color,
  };

  function makeSprinkleLine() {
    const line = new Zdog.Shape({
      addTo: sprinkle.parent,
      path: [
        { },
        { },
      ],
      stroke: 5,
      color: color + '1',
    });
    line.rand = Math.random();
    return line;
  }

  sprinkle.line = new Zdog.Rect({
    addTo: sprinkle.parent,
    width: 0,
    height: 100,
    stroke: 25,
    rotate: {x: Zdog.TAU/4},
    color: sprinkle.color + '3',
  });

  sprinkle.upd = function(power) {
    function rand(k = 10) {
      const r = ((k % 2 !== 0 ? Math.sin : Math.cos)(c * 0.015)) * k;
      return (abs(r) <= abs(power) ? r : power);
    }

    const line = sprinkle.line;
    const r = -power + rand();

    line.translate.z = r / 3 + (-sign(power) * 20);
    line.height = r / 2;
    line.stroke = rand(5) + 30;
    line.color = sprinkle.color + toHex((Math.floor(abs(power * 0.5))));
    line.updatePath();
  };
  return sprinkle;
}

function clamp(value) {
  return Math.min(Math.max(value, -100), 100);
}

function ease(oldVal, newVal, factor = 3) {
  return ((oldVal * factor + newVal) / (factor + 1));
}

const contextSmoothed = {
  motors: {
    hl: 0,
    hr: 0,
    vf: 0,
    vb: 0,
  },

  rot: {
    yawOld: 0,
    rollOld: 0,
    pitchOld: 0,

    yawDelta: 0,
    rollDelta: 0,
    pitchDelta: 0,

    yaw: 0,
    roll: 0,
    pitch: 0,
  },

  illoRot: {
    x: 0,
    y: 0,
    z: 0,
  },

  leds: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

let framesCount = 0;

function decToHex(value) {
  return (Math.min(Math.floor(Math.abs(value)), 255)).toString(16).padStart(2, '0');
}

function toHex(value) {
  return value.toString(16).padStart(2, '0');
}

function makeHexColor(r, g, b) {
  r = Math.min(Math.abs(Math.round(r)) + 0, 255);
  g = Math.min(Math.abs(Math.round(g)) + 0, 255);
  b = Math.min(Math.abs(Math.round(b)) + 0, 255);

  return '#' + decToHex(r) + decToHex(g) + decToHex(b);
}


function animate() {
  c = new Date();

  illo.rotate.x = illo.rotate.x > (-Zdog.TAU / 32) ? -Zdog.TAU / 32 :
                    illo.rotate.x < (-Zdog.TAU / 4) ? -Zdog.TAU / 4 :
                    illo.rotate.x;

  if (parent_obj.active) {
    contextSmoothed.motors.hl = ease(contextSmoothed.motors.hl, context.motors.hl);
    contextSmoothed.motors.hr = ease(contextSmoothed.motors.hr, context.motors.hr);
    contextSmoothed.motors.vf = ease(contextSmoothed.motors.vf, context.motors.vf);
    contextSmoothed.motors.vb = ease(contextSmoothed.motors.vb, context.motors.vb);
    const rot = (Math.PI/180);

    function normalizeAngle(angle) {
      return (Math.abs(((angle) + 180) % 360 ) - 180) * ((angle % 360) >= -180 ? 1.0 : - 1.0);
    }

    contextSmoothed.rot.yawDelta = normalizeAngle(ease(
        contextSmoothed.rot.yawDelta,
        -normalizeAngle(contextSmoothed.rot.yawOld - (context.rot.yaw)),
    ));

    origin.rotate.y += contextSmoothed.rot.yawDelta * rot;
    contextSmoothed.rot.yawOld = (context.rot.yaw);

    contextSmoothed.rot.rollDelta = normalizeAngle(ease(
        contextSmoothed.rot.rollDelta,
        -normalizeAngle(contextSmoothed.rot.rollOld - (context.rot.roll)),
    ));

    vehicle.origin.rotate.z -= contextSmoothed.rot.rollDelta * rot;
    contextSmoothed.rot.rollOld = (context.rot.roll);

    contextSmoothed.rot.pitchDelta = normalizeAngle(ease(
        contextSmoothed.rot.pitchDelta,
        -normalizeAngle(contextSmoothed.rot.pitchOld - (context.rot.pitch)),
    ));

    vehicle.origin.rotate.x += contextSmoothed.rot.pitchDelta * rot;
    contextSmoothed.rot.pitchOld = (context.rot.pitch);

    contextSmoothed.leds.forEach((led, ledIndex) => {
      contextSmoothed.leds[ledIndex].forEach((color, colorIndex) => {
        contextSmoothed.leds[ledIndex][colorIndex] = Math.round(ease(
            contextSmoothed.leds[ledIndex][colorIndex], context.leds[ledIndex][colorIndex], 0.5,
        ));
      });
    });

    th_hl.update(contextSmoothed.motors.hl + 0, context.auto_axes.hl);
    th_hr.update(contextSmoothed.motors.hr + 0, context.auto_axes.hr);
    th_vf.update(contextSmoothed.motors.vf + 0, context.auto_axes.vf);
    th_vb.update(contextSmoothed.motors.vb + 0, context.auto_axes.vb);

    if ('leds' in context) {
      vehicle.leds.forEach((led, index) => {
        const rgb = contextSmoothed.leds[index];
        const glowOpacity = toHex(Math.round(Math.max(Math.abs(rgb[0]), Math.abs(rgb[1]), Math.abs(rgb[2])) * 0.1));
        const mainOpacity = toHex(Math.round(Math.max(Math.abs(rgb[0]) + 50, Math.abs(rgb[1]) + 50, Math.abs(rgb[2]) + 50) * 0.5));

        led[0].color = makeHexColor(
            Math.abs(rgb[0]),
            Math.abs(rgb[1]),
            Math.abs(rgb[2]),
        ) + glowOpacity;

        led[1].color = makeHexColor(
            Math.abs(rgb[0]) + 100,
            Math.abs(rgb[1]) + 130,
            Math.abs(rgb[2]) + 150,
        ) + mainOpacity;
      });
    }

    if (framesCount == 0) {
      illo.updateRenderGraph();
    }
  }

  framesCount++;

  /* frames skipping */
  if (framesCount >= 2) {
    framesCount = 0;
  }

  requestAnimationFrame(animate);
}
