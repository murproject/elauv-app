import barcodeScanner from 'cordova-plugin-qr-barcode-scanner/www/barcodescanner';
import crc32 from 'crc-32';
import api from '/src/vehicle/api';

export default class QrCodes {
  static scanCode() {
    barcodeScanner.scan(
        (result) => this.processCode(result),
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

      // TODO: if version is too new: show "outdated app" dialog

      console.log('Success code scan: ' + msg.address);
      api.connect(msg.address, true);
    } catch (e) {
      // TODO: dialog with error
      console.error('Scan code parse error:');
      console.error(e);
    }
  }
}
