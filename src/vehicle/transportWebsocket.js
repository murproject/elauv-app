// import EventBus from './eventBus'

export default {
  name: 'transport',
  type: 'websocket',
  ws: null, // instance
  devices: {},

  checkStatus: function () {
    if (this.ws != null) {
      let state
      switch (this.ws.readyState) {
        case 0: {
          state = 'connecting'
          break
        }
        case 1: {
          state = 'open'
          break
        }
        case 2: {
          state = 'closing'
          break
        }
        case 3: {
          state = 'closed'
          break
        }
        default: {
          state = 'unknown'
          break
        }
      }
      return state
    } else {
      return 'null'
    }
  },

  start: function () {

  },

  connect: function (url) {
    this.url = url
    try {
      // if (this.ws && this.ws.readyState === 1) {
      if (this.ws) {
        this.ws.close()
      }
      this.ws = new WebSocket(this.url)
      this.ws.onopen = this.onOpen
      this.ws.onclose = this.onClose
      this.ws.onmessage = this.onMessage
      this.ws.onerror = this.onError
    } catch (exception) {
      // EventBus.$emit('notify', { text: 'WebSocket init failed: ' + exception })
    }
  },

  sendMessage: function (message) {
    if (this.ws) {
      // console.log(message)
      this.ws.send(message)
    }
  },

  onOpen: null,
  onClose: null,
  onError: null,
  onMessage: null
}
