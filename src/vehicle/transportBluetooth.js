// import Vue from 'vue'
// import EventBus from './eventBus'
import bluetoothClassicSerial from 'cordova-plugin-bluetooth-classic-serial-port/www/bluetoothClassicSerial';
import barcodeScanner from 'cordova-plugin-qr-barcode-scanner/www/barcodescanner';
import crc32 from 'crc-32';

import api from './api';

/* TODO: add statuses - scanning, network-unavailable */

document.crc = crc32;

export default {
  name: 'transport',
  type: 'bluetooth',
  spp: '00001101-0000-1000-8000-00805F9B34FB',
  state: 'closed',

  devices: [],

  macAddress: null,

  checkStatus: function() {
    return this.state;
  },

  start: function() {
    bluetoothClassicSerial.setDeviceDiscoveredListener((device) => {
      this.deviceDiscovered(device);
    });
  },

  isDeviceCompatible: function(device) {
    return ('name' in device && device.name.startsWith('ElementaryAUV-'));
    // return true // TODO //
  },

  deviceDiscovered: function(device) {
    console.log(device);
    const compatible = this.isDeviceCompatible(device);

    const currentDevice = {
      type: compatible ? 'elauv' : 'unknown', // TODO:   type deduction
      address: device.address,
      name: device.name ? device.name : '',
      isCompatible: compatible,
      tag: `${compatible ? 0 : 1}-${device.address}`,
    };

    let deviceAlreadyFound = false;

    this.devices.forEach((item) => {
      if (item.address == currentDevice.address) {
        deviceAlreadyFound = true;
      }
    });

    if (deviceAlreadyFound) {
      return;
    }

    this.devices.push(currentDevice);
    this.devices = this.devices.sort((a, b) => a.tag.localeCompare(b.tag, 'en', {numeric: true}));
    console.log(this.devices);
    this.onDeviceDiscovered(this.devices);
  },

  scanUnpaired: function() {
    this.disconnect();
    this.state = 'scanning'; // TODO: 'scanning' status??
    this.onScan();

    this.devices = [];

    bluetoothClassicSerial.discoverUnpaired(
        (results) => {
          console.log(results);
          this.state = 'closed';
        },
        (error) => {
          console.error(error);
        },
    );
  },

  scanAll: function() {
    this.disconnect();

    bluetoothClassicSerial.enable(() => {
      this.state = 'scanning';
    }, () => {
      this.state = 'scanning';
    });

    this.devices = [];
    this.scanUnpaired();
  },

  // TODO: move from transportBluetooth
  scanCode: function() {
    barcodeScanner.scan(
        (result) => this.processCodeInfo(result),
        null,
        {
          showTorchButton: false,
          torchOn: false,
          prompt: 'Наведите камеру на код',
          resultDisplayDuration: 0,
          formats: 'QR_CODE,AZTEC',
          disableSuccessBeep: true,
        },
    );
  },

  // TODO: move from transportBluetooth
  processCodeInfo(code) {
    try {
      const text = code.text;
      const prefix = 'https://murproject.com/elauv?';

      if (!text.startsWith(prefix)) {
        throw new Error('Prefix mismatch');
      }

      const rawData = text.replace(prefix, '').split('-');

      const msg = {
        version: rawData[0].split('.'),
        address: rawData[1],
        crc: rawData[2].toUpperCase(),
      };

      function calcCrc(data) {
        const crcFull = (crc32.str(data) >>> 0).toString(16).toUpperCase();
        const crcShort = crcFull.slice(-2);
        return crcShort;
      }

      const exceptedCrc = calcCrc(text.slice(0, -3));

      if (msg.crc != exceptedCrc) {
        throw new Error('CRC mismatch');
      }

      // TODO: if version is too new: show "outdated app" dialog

      console.log('Success code scan: ' + msg.address);
      api.connect(msg.address, true);
    } catch (e) {
      console.error('Scan code parse error:');
      console.error(e);
    }
  },

  setMac: function(address) {
    this.macAddress = address;
  },

  connect: async function(address) {
    if (address && (this.macAddress !== address)) {
      this.disconnect();
      this.macAddress = address;
      // return
    }

    if (!this.macAddress || this.state === 'connecting') {
      return;
    }

    this.state = 'connecting';
    // EventBus.$emit('notify', { text: 'Подключаемся к ' + this.macAddress })

    bluetoothClassicSerial.isEnabled(
        () => {
          bluetoothClassicSerial.connect(
              this.macAddress,
              [this.spp],
              (result) => {
                // EventBus.$emit('notify', { text: 'ВКЛЮЧЕНО ' + result })
                this.state = 'open';
                this.onOpen();
                bluetoothClassicSerial.subscribeRawData(this.macAddress, async (data) => {
                  this.onMessage({
                    data: {
                      arrayBuffer: function() {
                        return new Promise((resolve, reject) => {
                          resolve(data);
                        });
                      },
                    },
                  });
                });
              },
              (error) => {
                // EventBus.$emit('notify', { text: 'ОШИБКА! ' + error })
                console.log('connect error:');
                console.error(error);
                this.state = 'closed';
                bluetoothClassicSerial.unsubscribeRawData(this.macAddress);
              },
          );
        },
        () => {
          bluetoothClassicSerial.enable(() => {
            this.state = 'closed';
          }, () => {
            this.state = 'closed';
          });
        },
    );
  },

  disconnect: async function() {
    // if (this.state !== 'closed') {
    bluetoothClassicSerial.disconnect(this.macAddress);
    this.state = 'closed';
    this.onClose();
    // setTimeout(() => this.onClose(), 1000)

    // }
  },

  sendMessage: function(message) {
    if (this.state === 'open') {
      const data = new Uint8Array(message.length);

      for (const i in message) {
        data[i] = message[i];
      }

      // console.log(data)
      bluetoothClassicSerial.write(this.macAddress, data,
          (a) => { },
          (b) => {
          // EventBus.$emit('notify', { text: 'WRITE ERROR! ' + b })
            console.error('send error:');
            console.error(b);
          },
      );
    }
  },

  onDeviceDiscovered: null,

  onScan: null,
  onOpen: null,
  onClose: null,
  onError: null,
  onMessage: null,
};
