import bluetoothClassicSerial from 'cordova-plugin-bluetooth-classic-serial-port/www/bluetoothClassicSerial';
import api from './api';

export default {
  name: 'transport',
  type: 'bluetooth',
  spp: '00001101-0000-1000-8000-00805F9B34FB',

  macAddress: null,
  state: 'closed',
  devices: [],

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
  },

  deviceDiscovered: function(device) {
    console.log(device);
    const compatible = this.isDeviceCompatible(device);

    const currentDevice = {
      type: compatible ? 'elauv' : 'unknown',
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
    this.state = 'scanning';
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

  setMac: function(address) {
    this.macAddress = address;
  },

  connect: async function(address) {
    if (address && (this.macAddress !== address)) {
      this.disconnect();
      this.macAddress = address;
    }

    if (!this.macAddress || this.state === 'connecting') {
      return;
    }

    this.state = 'connecting';

    bluetoothClassicSerial.isEnabled(
        () => {
          bluetoothClassicSerial.connect(
              this.macAddress,
              [this.spp],
              (result) => {
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
    bluetoothClassicSerial.disconnect(this.macAddress);
    this.state = 'closed';
    this.onClose();
  },

  sendMessage: function(message) {
    if (this.state === 'open') {
      const data = new Uint8Array(message.length);

      for (const i in message) {
        data[i] = message[i];
      }

      bluetoothClassicSerial.write(this.macAddress, data,
          (a) => { },
          (b) => {
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
  onMessage: null,
};
