import App from '/src/App';
import GlobalDialog from '/src/components/GlobalDialog';
import Button from '/src/components/Button';

export default {
  get version() {
    return '[AIV]{version}[/AIV]';
  },

  get buildDate() {
    return '[AIV]{date}[/AIV]';
  },

  get isDevBuild() {
    return true;
  },

  get copyright() {
    return /*html*/`
      ООО "Центр робототехники"<br>
      г. Владивосток, 2022 г.
    `;
  },

  get siteLink() {
    return 'https://murproject.com/elauv';
  },

  openSite() {
    if (App.isCordova) {
      cordova.InAppBrowser.open(this.siteLink, '_system');
    } else {
      location.open(this.siteLink, '_blank');
    }
  },

  openDialogOutdatedApp() {
    App.showGlobalDialog(
        new GlobalDialog({
          closable: true,
          title: 'Ошибка',
          text: 'Пожалуйста, обновите приложение!',
          classes: ['text-center', 'buttons-collapsed'],
          buttons: [
            new Button({
              text: 'Открыть сайт',
              icon: 'web',
            }, () => this.openSite()),
            new Button({
              text: 'Закрыть',
              icon: 'keyboard-return',
            }, () => App.closeGlobalDialog()),
          ],
        }),
    );
  },
};
