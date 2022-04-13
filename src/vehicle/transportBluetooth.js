// import Vue from 'vue'
// import EventBus from './eventBus'
import bluetoothClassicSerial from 'cordova-plugin-bluetooth-classic-serial-port/www/bluetoothClassicSerial'
import barcodeScanner from 'cordova-plugin-qr-barcode-scanner/www/barcodescanner'

/* TODO: add statuses - scanning, network-unavailable */

export default {
  name: 'transport',
  type: 'bluetooth',
  spp: '00001101-0000-1000-8000-00805F9B34FB',
  state: 'closed',

  devices: {
    active: null,
    paired: [],
    unpaired: [],
    all: []
  },

  // macAddress: null,
  macAddress: 'D8:A0:1D:5C:FF:26', // TODO: don't hardcode
  // macAddress: '50:02:91:AC:B3:BA',
  /* TODO:
   * 1) show list of paired / discovered devices
   * 2) open system bluetooth settings for manual pairing
   * 3) qr code scan?
   */
  // TODO: save last successfully connected device

  checkStatus: function () {
    return this.state
  },

  start: function () {
    bluetoothClassicSerial.setDeviceDiscoveredListener((device) => {
      if (!this.devices.unpaired.includes(device) && this.isDeviceCompatible(device)) {
        this.devices.unpaired.push(device)
      }
      this.deviceDiscovered(device, false)
    })
  },

  isDeviceCompatible: function (device) {
    return (device.name && device.name.startsWith('ElementaryAUV-'))
    // return true // TODO //
  },

  deviceDiscovered: function (device, isPaired) {
    const deviceActive = this.macAddress === device.address
    const newAllDevices = []

    const currentDevice = {
      type: this.isDeviceCompatible(device) ? 'elauv' : 'unknown', // TODO:   type deduction
      address: device.address,
      name: device.name ? device.name : '',
      isPaired: isPaired,
      isActive: deviceActive // TODO: active means selected, but not connected and working device
    }

    let replaced = false
    for (const i in this.devices.all) {
      const comparedDevice = this.devices.all[i]
      if (currentDevice.address === comparedDevice.address) {
        if (currentDevice.isPaired || currentDevice.isActive) {
          newAllDevices.push(currentDevice)
        } else {
          newAllDevices.push(comparedDevice)
        }
        replaced = true
      } else {
        newAllDevices.push(comparedDevice)
      }
    }

    if (!replaced) {
      newAllDevices.push(currentDevice)
    }

    if (deviceActive) {
      this.devices.active = currentDevice
    }

    // this.devices.all = newAllDevices
    Vue.set(this.devices, 'all', newAllDevices)

    // console.log(this.devices.all)
  },

  scanUnpaired: function () {
    this.disconnect()
    this.state = 'closed' // TODO: 'scanning' status??
    this.onScan()

    this.devices.unpaired = []
    bluetoothClassicSerial.discoverUnpaired(
      (results) => {
        // for (const i in results) {
        //   if (this.isDeviceCompatible(results[i])) {
        //     this.devices.paired.push(results[i])
        //   }
        // }
        // EventBus.$emit('bt-discovered-unpaired', { devices: results })
        this.state = 'closed'
      },
      (error) => {
        // EventBus.$emit('notify', { text: 'discoverUnpaired failed: ' + error })
      }
    )
  },

  scanPaired: function () {
    this.devices.paired = []
    bluetoothClassicSerial.list(
      (results) => {
        for (const i in results) {
          const device = results[i]
          if (this.isDeviceCompatible(device)) {
            this.devices.paired.push(device)
          }
          this.deviceDiscovered(device, true)
        }
        // EventBus.$emit('bt-discovered-paired', { devices: results })
      },
      (error) => {
        // EventBus.$emit('notify', { text: 'bt list failed: ' + error })
      }
    )
  },

  scanAll: function () {
    bluetoothClassicSerial.enable(() => {
      this.state = 'closed'
    }, () => {
      this.state = 'closed'
    })

    this.devices.all = []
    this.scanPaired()
    this.scanUnpaired()
  },

  // TODO: move from transportBluetooth
  scanCode: function () {
    barcodeScanner.scan(
      (result) => {
        this.processCodeInfo(result)
      },
      null,
      {
        showTorchButton: false,
        torchOn: false,
        prompt: 'Наведите камеру на код',
        resultDisplayDuration: 0,
        formats: 'QR_CODE,AZTEC',
        disableSuccessBeep: true
      }
    )
  },

  // TODO: move from transportBluetooth
  processCodeInfo (code) {
    try {
      const msgSplitted = code.text.split('/')
      const dataSplitted = msgSplitted[0].split('-')

      const data = {
        incomingCrc: msgSplitted[1],
        calculatedCrc: msgSplitted[1], // TODO!! calcCrc32(msgSplitted[0])
        headerMagic: dataSplitted[0],
        vehicleType: dataSplitted[1],
        vehicleVersion: dataSplitted[2],
        macAddress: dataSplitted[3]
      }

      if (data.incomingCrc !== data.calculatedCrc) {
        throw new Error('CRC mismatch')
      }

      // TODO: should procces all fields!

      if (data.vehicleType.toLowerCase() === 'elauv') {
        // EventBus.$emit('notify', { text: 'code parsed: ' + data.macAddress })
        this.disconnect()
        this.macAddress = data.macAddress
        this.connect()
      }
    } catch (e) {
      // EventBus.$emit('notify', { text: 'Code parse error: ' + e })
    }
  },

  setMac: function (address) {
    this.macAddress = address
  },

  connect: async function (address) {
    if (address && (this.macAddress !== address)) {
      this.disconnect()
      this.macAddress = address
      // return
    }

    if (!this.macAddress || this.state === 'connecting') {
      this.scanPaired()
      return
    }

    this.state = 'connecting'
    // EventBus.$emit('notify', { text: 'Подключаемся к ' + this.macAddress })

    bluetoothClassicSerial.isEnabled(
      () => {
        this.scanPaired()
        bluetoothClassicSerial.connect(
          this.macAddress,
          [this.spp],
          (result) => {
            // EventBus.$emit('notify', { text: 'ВКЛЮЧЕНО ' + result })
            this.state = 'open'
            this.onOpen()
            bluetoothClassicSerial.subscribeRawData(this.macAddress, async (data) => {
              this.onMessage({
                data: {
                  arrayBuffer: function () {
                    return new Promise((resolve, reject) => {
                      resolve(data)
                    })
                  }
                }
              })
            })
            setTimeout(() => { this.scanPaired() }, 100)
          },
          (error) => {
            // EventBus.$emit('notify', { text: 'ОШИБКА! ' + error })
            this.state = 'closed'
            bluetoothClassicSerial.unsubscribeRawData(this.macAddress)
          }
        )
      },
      () => {
        bluetoothClassicSerial.enable(() => {
          this.state = 'closed'
        }, () => {
          this.state = 'closed'
        })
      }
    )
  },

  disconnect: async function () {
    // if (this.state !== 'closed') {
    this.state = 'closed'
    this.onClose()
    bluetoothClassicSerial.disconnect(this.macAddress)
    // }
  },

  sendMessage: function (message) {
    if (this.state === 'open') {
      const data = new Uint8Array(message.length)

      for (const i in message) {
        data[i] = message[i]
      }

      // console.log(data)
      bluetoothClassicSerial.write(this.macAddress, data,
        (a) => { },
        // (b) => { EventBus.$emit('notify', { text: 'WRITE ERROR! ' + b }) }
      )
    }
  },

  onScan: null,
  onOpen: null,
  onClose: null,
  onError: null,
  onMessage: null
}