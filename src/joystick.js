import nipplejs from 'nipplejs'

export default {
    axisFormulaDefault: `max_power = 50

a = + x + y
b = + x - y
c = + z
d = - z


/*
x = yaw
y = forward
z = depth
*/`,

    axes: {
        yaw: 0,
        forward: 0,
        side: 0,
        vertical: 0,
    },

    thresh: 0.1,

    nipple0: nipplejs.create({
        zone: document.getElementById('nipple0'),
        mode: 'static',
        position: {left: '50%', top: '50%'},
        color: 'black'
    }),

    nipple1: nipplejs.create({
        zone: document.getElementById('nipple1'),
        mode: 'static',
        position: {left: '50%', top: '50%'},
        color: 'black',
        lockY: true
    }),

    init: function() {
        this.nipple0.on("move", (evt, data) => {
            this.axes.yaw = Math.abs(data.vector.x) >= this.thresh ? Math.round(data.vector.x * 100) : 0;
            this.axes.forward = Math.abs(data.vector.y) >= this.thresh ? Math.round(data.vector.y * 100) : 0;
        })

        this.nipple1.on("move", (evt, data) => {
            this.axes.side = Math.abs(data.vector.x) >= this.thresh ? Math.round(data.vector.x * 100) : 0;
            this.axes.vertical = Math.abs(data.vector.y) >= this.thresh ? Math.round(data.vector.y * 100) :0;
        })

        this.nipple0.on("end", (evt) => {
            this.axes.yaw = 0;
            this.axes.forward = 0;
        })

        this.nipple1.on("end", (evt) => {
            this.axes.side = 0;
            this.axes.vertical = 0;
        })
    }
}