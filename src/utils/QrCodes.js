let barcodeScanner = null;

if (typeof cordova !== 'undefined') {
  barcodeScanner = require('cordova-plugin-qr-barcode-scanner/www/barcodescanner');
}

import crc32 from 'crc-32';
import api from '/src/vehicle/api';
import App from '/src/App';
import GlobalDialog from '/src/components/GlobalDialog';
import Button from '/src/components/Button';
import AppVersion from '/src/utils/AppVersion';

const versionError = 'Too new version';

export default class QrCodes {
  static scanCode() {
    if (barcodeScanner === null) {
      this.dialog(`Доступно только на мобильных устройствах!`);
    }

    barcodeScanner.scan(
        (result) => this.processCode(result),
        null,
        {
          showTorchButton: true,
          torchOn: false,
          prompt: 'Наведите камеру на код',
          resultDisplayDuration: 0,
          formats: 'QR_CODE,AZTEC',
          disableSuccessBeep: true,
        },
    );
  }

  static dialog(text) {
    App.showGlobalDialog(
        new GlobalDialog({
          closable: true,
          title: 'Ошибка',
          text: text,
          classes: ['text-center', 'buttons-collapsed'],
          buttons: [
            new Button({
              text: 'Закрыть',
              icon: 'keyboard-return',
            }, () => App.closeGlobalDialog()),
          ],
        }),
    );
  }

  static processCode(code) {
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

      if (Number('0x' + msg.version[0]) > 0x01 || Number('0x' + msg.version[1]) > 0x01) {
        throw new Error(versionError);
      }

      console.log('Success code scan: ' + msg.address);
      api.connect(msg.address, true);
    } catch (e) {
      console.error('Scan code parse error:');
      console.error(e);
      if (e.message === versionError) {
        AppVersion.openDialogOutdatedApp();
      } else {
        this.dialog('Произошла ошибка при чтении кода.');
      }
    }
  }
}
