import Panel from './Panel'
import Zdog from 'zdog'
import mur from '/src/vehicle/apiGameMur.js'

export default class VizAuv extends Panel {

  begin() {
    this.isBottomPanel = true;

    this.html = /*html*/`
      <canvas class="zdog-canvas" width="300" height="300"></canvas>
    `
  }

  init() {
    pan = this;

    this.setIcon('rotate-orbit');

    // this.container.classList.add("panel-floating");

    // this.vizauv = makeVizauv();

    // setInterval(() => {
    //   if ('direct_power' in mur.context) {
    //     context.motors.hl = mur.context.direct_power[0];
    //     context.motors.vl = mur.context.direct_power[1];
    //     context.motors.vr = mur.context.direct_power[2];
    //     context.motors.hr = mur.context.direct_power[3];
    //   }

    //   if ('imuYaw' in mur.telemetry) {
    //     context.rot.yaw = mur.telemetry.imuYaw;
    //     context.rot.pitch = mur.telemetry.imuPitch;
    //     context.rot.roll = mur.telemetry.imuRoll;
    //   }

    // }, 100);
  }

  static makeVizauv(parent) {
    return makeVizauv(parent);
  }
}


/////////////////////////////



const transparent = '#FFF0';
const black = '#333';
const grey = '#555';
const acryl = '#777';
const orange = '#E62';
const garnet = '#C25';
const purple = '#636';
const cyan = '#39B';
// const cyan = 'rgba(68, 170, 204, 1.0);'

let dragged = false;

const abs = Math.abs;
const max = Math.max;
const min = Math.min;

const zero_xyz = { x: 0, y: 0, z: 0 };

let c = new Date();

let context = {
    motors: {
        hl: 0,
        hr: 0,
        vl: 0,
        vr: 0,
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
    ]
};

let illo = null;
let origin = null;

let vehicle = null;
let th_hl = null;
let th_hr = null;
let th_vl = null;
let th_vr = null;

let parent_obj = undefined;

function makeVizauv (parent) {
  parent_obj = parent;

  illo = new Zdog.Illustration({
    element: '.zdog-canvas',
    dragRotate: true,
    // rotate: {x: Zdog.TAU/8, y: Zdog.TAU/8},
    // rotate: {x: -Zdog.TAU/8, y: Zdog.TAU/8 * 3},
    rotate: {x: -Zdog.TAU/8 * 1, y: Zdog.TAU/8 * 4},
    zoom: 1.5,
    onDragStart: function() {
        dragged = true;
    },
  });

  origin = new Zdog.Shape({
    addTo: illo,
    stroke: false,
    // color: purple,
  });


  vehicle = makeVehicle(origin, zero_xyz);
  th_hl = makeThruster(vehicle.origin, { x: -35, y: 0, z: -35}, {y:  Zdog.TAU/8});
  th_hr = makeThruster(vehicle.origin, { x:  35, y: 0, z: -35}, {y: -Zdog.TAU/8});
  th_vl = makeThruster(vehicle.origin, { x:   0, y: 0, z:  35}, {x:  Zdog.TAU/4});
  th_vr = makeThruster(vehicle.origin, { x:   0, y: 0, z: -35}, {x:  Zdog.TAU/4});

  let vizauv = {
    vehicle: vehicle,
    th_hl: th_hl,
    th_hr: th_hr,
    th_vl: th_vl,
    th_vr: th_vr,
  }

  animate();

  vizauv.updContext = (ctx) => {context = ctx};

  return vizauv;
}

function sign(number) {
    return number > 0 ? 1 : -1
}

function makeGizmo(parent) {
    let gizmo = {};

    gizmo.origin = new Zdog.Polygon({
        addTo: parent,
        color: transparent,
        stroke: false,
    })

    function makeGizmoLine(axis, color = cyan) {
        let line = new Zdog.Shape({
            addTo: gizmo.origin,
            path: [ {}, {} ],
            stroke: 1,
            color: color,
        });
        line.path[0][axis] = -50;
        line.path[1][axis] =  50;
        line.updatePath();
        return line;
    }

    gizmo.lineX = makeGizmoLine('x', cyan);
    gizmo.lineY = makeGizmoLine('y', purple);
    gizmo.lineZ = makeGizmoLine('z', garnet);

    return gizmo;
}

function makeVehicle(parent, pos = zero_xyz, rot = zero_xyz) {
    let vehicle = {
        pos: {x: pos.x, y: pos.y, z: pos.z},
        rot: {x: rot.x, y: rot.y, z: rot.z},
    };

    vehicle.gr = new Zdog.Group({
        translate: vehicle.pos,
        rotate: vehicle.rot,
        addTo: parent,
        color: transparent,
        stroke: false,
    });

    vehicle.grBody = new Zdog.Group({
        translate: vehicle.pos,
        rotate: vehicle.rot,
        addTo: parent,
        color: transparent,
        stroke: false,
    });

    vehicle.origin = new Zdog.Polygon({
        addTo: parent,
        translate: vehicle.pos,
        rotate: vehicle.rot,
        color: transparent,
        stroke: false,
    })

    // vehicle.cylinder = new Zdog.Cylinder({
    //     addTo: vehicle.origin,
    //     diameter: 50,
    //     length: 80,
    //     fill: true,
    //     stroke: true,
    //     color: acryl,
    //     frontFace: '#AAA',
    //     backface: black,
    // });

    // vehicle.body = new Zdog.Box({
    //     addTo: vehicle.origin,
    //     width: 120,
    //     height: 10,
    //     depth: 80,
    //     stroke: false,
    //     color: '#C25',
    //     // remove left & right faces
    //     leftFace: false,
    //     rightFace: false,
    //     frontFace: false,
    //     rearFace: false,
    //     topFace: '#ED05',
    //     bottomFace: '#6365',
    //   });


    // vehicle.bodyBottom  = new Zdog.RoundedRect({
    //     addTo: vehicle.gr,
    //     width: 100,
    //     height: 100,
    //     fill: true,
    //     cornerRadius: 30,
    //     stroke: 2,
    //     color: '#77A7',
    //     translate: {z: 10, y: 0},
    //     rotate: {x:  Zdog.TAU/4},
    // });


    // vehicle.bodyBottom  = new Zdog.RoundedRect({
    //     addTo: vehicle.gr,
    //     width: 70,
    //     height: 70,
    //     fill: true,
    //     cornerRadius: 30,
    //     stroke: 5,
    //     color: '#77A7',
    //     translate: {z: 10, y: 0},
    //     rotate: {x:  Zdog.TAU/4},
    // });

    vehicle.bodyTop  = new Zdog.RoundedRect({
        addTo: parent,
        width: 100,
        height: 100,
        fill: true,
        cornerRadius: 30,
        stroke: 5,
        color: '#59B1',
        translate: {z: 0, y: -15},
        rotate: {x:  Zdog.TAU/4},
    });

    vehicle.bodyBottom  = new Zdog.RoundedRect({
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


    // vehicle.bodyBottomBalance  = new Zdog.RoundedRect({
    //     addTo: vehicle.gr,
    //     width: 100,
    //     height: 100,
    //     visible: false,
    //     translate: {z: 0, y:  100},
    //     rotate: {x:  Zdog.TAU/4},
    // });

    new Zdog.Shape({
        addTo: vehicle.gr,
        visible: false,
        translate: {z: 0, y:  200},
    });


    // vehicle.bodyColba = new Zdog.RoundedRect({
    //     addTo: vehicle.gr,
    //     width: 40,
    //     height: 40,
    //     fill: true,
    //     cornerRadius: 30,
    //     stroke: 15,
    //     color: '#77A7',
    //     translate: {z: 10, y: 0},
    //     rotate: {x:  Zdog.TAU/4},
    // });

    vehicle.bodycolba =  new Zdog.Cylinder({
        addTo: vehicle.grBody,
        diameter: 35,
        length: 18,
        fill: true,
        stroke: 5,
        color: '#ADF2',
        // frontFace: '#7BD',
        // fillColor: "#000",
        translate: {z: 0, y: 0},
        rotate: {x:  Zdog.TAU/4},
        // backface: black,
    });

    vehicle.bodyColbaBottom =  new Zdog.Ellipse({
        addTo: vehicle.grBody,
        diameter: 35,
        length: 18,
        fill: true,
        stroke: 5,
        color: '#79AF',
        translate: {z: 0, y: 10},
        rotate: {x:  Zdog.TAU/4},
    });

    vehicle.bodyColbaTop =  new Zdog.Ellipse({
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
        return new Zdog.Box({
            addTo: vehicle.grBody,
            stroke: 3,
            width: 0.5,
            height: 0.5,
            depth: 1.5,
            translate: {x: x, y: +10, z: z},
            rotate: {y: rot != 0 ? Zdog.TAU / rot : 0},
            color: '#fff7',
        });
    }

    vehicle.leds = [
        makeLed(-14,  5, -16),
        makeLed(-14, -5,  16),
        makeLed( 14, -5, -16),
        makeLed( 14,  5,  16),
    ]

    return vehicle;
}

function makeThruster(parent, pos = zero_xyz, rot = zero_xyz) {
    let th = {
        pos: {x: pos.x, y: pos.y, z: pos.z},
        rot: {x: rot.x, y: rot.y, z: rot.z},
    };

    th.origin = new Zdog.Polygon({
        addTo: parent,
        translate: th.pos,
        rotate: th.rot,
        color: transparent,
        stroke: false,
    })

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
        // color: cyan + '7',
        color: black,
        backface: grey,
    });

    th.propeller = new Zdog.Rect({
        addTo: th.group,
        width: 20,
        height: 1,
        stroke: 10,
        rotate: { z: Math.random() * 100 },
        color: black + 'A',
    });

    th.arrow = makeArrow(th);
    th.sprinkle = makeSprinkle(th.origin);

    th.update = function(power) {
        th.propeller.rotate.z += power * 0.005;
        th.arrow.upd(power);
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
        parent: parent
    };

    arrow.rot.x += Zdog.TAU/4;

    arrow.origin = new Zdog.Polygon({
        addTo: arrow.parent.origin,
        translate: arrow.pos,
        // stroke: 10,
        // color: orange,
        rotate: arrow.rot,
        color: transparent,
    })

    arrow.trig = new Zdog.Polygon({
        addTo: arrow.origin,
        radius: 10,
        sides: 3,
        stroke: 10,
        color: arrow.color,
    });

    // arrow.trig = new Zdog.Cone({
    //     addTo: arrow.origin,
    //     diameter: 15,
    //     length: 15,
    //     stroke: 10,
    //     fill: true,
    //     color: arrow.color,
    // });

    // arrow.trig.rotate.x += Zdog.TAU/4;

    // arrow.trig = new Zdog.Shape({
    //     addTo: arrow.origin,
    //     path: [
    //         { x: 10, y: 10 },
    //         { x: 0, y: 0 },
    //         { x: -10, y: 10 },
    //     ],
    //     stroke: 6,
    //     closed: false,
    //     color: arrow.color,
    // });

    arrow.trig.upd = function (power) {
        this.translate.y = power + arrow.y;
        this.scale.y = min(abs(power) * 0.1, 1.0) * -sign(power);
        // this.scale.z = min(abs(power) * 0.1, 1.0) * -sign(power); // for cone
        // this.scale.y = (power < 0 ? 1 : -1);
        // this.scale.x = this.scale.y * 1.25;

        arrow.trig.rotate.y =
            (illo.rotate.y * (arrow.parent.origin.rotate.x / (Zdog.TAU/4))) +

            // (illo.rotate.x * (arrow.parent.origin.rotate.y / (Zdog.TAU/4))) +
            // (illo.rotate.y * (arrow.parent.origin.rotate.y / (Zdog.TAU/4))) +

            // (illo.rotate.x * (arrow.parent.origin.rotate.x / (Zdog.TAU/4))) +
            // (illo.rotate.z * (arrow.parent.origin.rotate.y / (Zdog.TAU/4))) +
            0;

        // console.log(arrow.parent);

        // arrow.trig.rotate.y = -arrow.parent.propeller.rotate.z / 2;

        this.color = arrow.color;
        this.updatePath();
    };

    arrow.line = new Zdog.Shape({
        // addTo: illo,
        addTo: arrow.origin,
        path: [{ x: 0, y: 0 }, { x: 0 }],
        stroke: 6,
        // color: arrow.trig.color,
    });

    arrow.line.upd = function(power) {
        let length = power;
        // this.translate.y = abs(power);
        // let add = ((arrow.trig.radius + 3.0) * -sign(power));
        // if (sign(length) === sign(length + add)) {
        //     length = length + add
        // }  else {
        //     length = 0
        // }
        // length = max(abs(length), abs(length + add))
        // this.path[0].y = -arrow.y;
        this.path[1].y = length;
        this.updatePath();
        this.color = arrow.color;
    }

    arrow.upd = function(power) {
        power *= 0.75;
        this.y = 7 * sign(power);

        this.opacity = min(abs(power) * 0.03, 1.0);
        this.color = this.colorBase + Math.floor((arrow.opacity * 15.0)).toString(16);

        // arrow.trig.rotate.y;
        arrow.trig.upd(power);

        // this.opacity = min(abs(power) * 0.03, 1.0);
        // this.opacity = max(this.opacity - (0.75 - abs(power) * 0.01), 0.0);
        this.opacity = abs(power) > 50 ? 1 : Math.pow(abs(power * 0.02), 3);
        this.color = this.colorBase + Math.floor((arrow.opacity * 15.0)).toString(16);

        arrow.line.upd(power);
    }

    arrow.upd(0)

    return arrow;
}

function makeSprinkle(parent, color = cyan) {
    let sprinkle = {
        parent: parent,
        color: color,
    }

    function makeSprinkleLine() {
        let line = new Zdog.Shape({
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
        rotate: {x: Zdog.TAU/4 },
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
        line.color = sprinkle.color + (abs(power) < 5 ? 0 : abs(Math.floor(power * 0.04)).toString());
        // console.log(line.color);

        line.updatePath()
    }
    return sprinkle;
}

// arrow_hl = makeArrow(origin, -40, 0, 0)
// arrow_hr = makeArrow(origin,  40, 0, 0)
// arrow_vl = makeArrow(origin, -40, 0, 30, {x: Zdog.TAU/4})
// arrow_vr = makeArrow(origin,  40, 0, 30, {x: Zdog.TAU/4})

// th_hl = makeTruster(origin);


// let gizmo = makeGizmo(origin);

var yaw = 0;
var forward = 0;
var side = 0;
var vertical = 0;
var thresh = 0.1;

function clamp(value) {
    return Math.min(Math.max(value, -100), 100);
}

function ease(oldVal, newVal, factor = 3) {
    return ((oldVal * factor + newVal) / (factor + 1))
}

let contextSmoothed = {
    motors: {
        hl: 0,
        hr: 0,
        vl: 0,
        vr: 0,
    },

    rot: {
      yaw: 0,
      roll: 0,
      pitch: 0,
    },

    leds: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ],
};

let skip = 0;

function makeHexColor(r, g, b) {
    r = Math.min(Math.abs(Math.round(r)) + 0, 255);
    g = Math.min(Math.abs(Math.round(g)) + 0, 255);
    b = Math.min(Math.abs(Math.round(b)) + 0, 255);

    const result = "#" +
            (r).toString(16).padStart(2, '0') +
            (g).toString(16).padStart(2, '0') +
            (b).toString(16).padStart(2, '0');

    // console.log(result);

    return result;
  }

// setInterval(() => animate(), 1000 / 25);

function animate() {
    c = new Date();

    // context.motors.hl = Math.sin(c * 0.001 + 111.111) * 100;
    // context.motors.hr = -context.motors.hl;
    // context.motors.vl = Math.cos(c * 0.0005) * 100;
    // context.motors.vr = context.motors.vl;

    // arrow_hl.translate.y = context.motors.hl;



    // vehicle.origin.rotate.y += yaw / 5000.0;
    // vehicle.origin.translate.x += -forward / 50.0;
    // vehicle.origin.translate.y += -vertical / 50.0;

    // illo.rotate.y = Math.min(illo.rotate.y, 0);

    // illo.rotate.y = contextSmoothed.rot.yaw + (180/50);
    // illo.rotate.x = -contextSmoothed.rot.pitch - (45/50);
    // illo.rotate.z = -contextSmoothed.rot.roll;
    // if (!dragged) {
    //     illo.rotate.x = ease(illo.rotate.x, -Zdog.TAU/8, 100);
    //     illo.rotate.y = ease(illo.rotate.y, Zdog.TAU/8 * 3, 100);
    // }


    // illo.rotate.y += 0.01;

    illo.rotate.x = illo.rotate.x > (-Zdog.TAU / 32) ? -Zdog.TAU / 32 :
                    illo.rotate.x < (-Zdog.TAU /  4) ? -Zdog.TAU /  4 :
                    illo.rotate.x;
    // console.log(illo.rotate.x);

    // if (!skip) {

    if (parent_obj.active) {
        contextSmoothed.motors.hl = ease(contextSmoothed.motors.hl, context.motors.hl);
        contextSmoothed.motors.hr = ease(contextSmoothed.motors.hr, context.motors.hr);
        contextSmoothed.motors.vl = ease(contextSmoothed.motors.vl, context.motors.vl);
        contextSmoothed.motors.vr = ease(contextSmoothed.motors.vr, context.motors.vr);

        contextSmoothed.rot.yaw = ease(contextSmoothed.rot.yaw, context.rot.yaw / 50);
        contextSmoothed.rot.roll = ease(contextSmoothed.rot.roll, context.rot.roll / 50);
        contextSmoothed.rot.pitch = ease(contextSmoothed.rot.pitch, context.rot.pitch / 50);

        contextSmoothed.leds.forEach((led, ledIndex) => {
            contextSmoothed.leds[ledIndex].forEach((color, colorIndex) => {
                contextSmoothed.leds[ledIndex][colorIndex] = ease(contextSmoothed.leds[ledIndex][colorIndex], context.leds[ledIndex][colorIndex], 0.5);
            });
        });

        // console.log(context);

        th_hl.update(contextSmoothed.motors.hl + 0);
        th_hr.update(contextSmoothed.motors.hr + 0);
        th_vl.update(contextSmoothed.motors.vl + 0);
        th_vr.update(contextSmoothed.motors.vr + 0);

        if ('leds' in context) {
            vehicle.leds.forEach((led, index) => {
                const rgb = contextSmoothed.leds[index];
                // console.log(rgb);
                led.color = makeHexColor(rgb[0], rgb[1], rgb[2]) + '22'
                // led.color = context.leds[index] + 'AA';
                // console.log(led.color);
            });
        }

        // if (skip <= 1) {
            illo.updateRenderGraph();
        // }
    }
    // }

    // skip++;

    // if (skip >= 3) {
    //     skip = 0;
    // }

    requestAnimationFrame(animate);
}


// animate();
