import nipplejs from 'nipplejs'

export default {
    axes: {
        yaw: 0,
        forward: 0,
        side: 0,
        vertical: 0,
    },

    thresh: 10,

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
        this.nipple0.on("move", function(evt, data) {
            this.yaw = Math.abs(data.vector.x) >= this.thresh ? Math.round(data.vector.x * 100) : 0;
            this.forward = Math.abs(data.vector.y) >= this.thresh ? Math.round(data.vector.y * 100) : 0;
        })

        this.nipple1.on("move", function(evt, data) {
            this.side = Math.abs(data.vector.x) >= this.thresh ? Math.round(data.vector.x * 100) : 0;
            this.vertical = Math.abs(data.vector.y) >= this.thresh ? Math.round(data.vector.y * 100) :0;
        })

        this.nipple0.on("end", function(evt) {
            this.yaw = 0;
            this.forward = 0;
        })

        this.nipple1.on("end", function(evt) {
            this.side = 0;
            this.vertical = 0;
        })
    }
}