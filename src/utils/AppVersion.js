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

  // TODO: make logo+link global, and show in aobut panel too?

  openSite() {
    cordova.InAppBrowser.open(this.siteLink, '_system');
  },

  openDialogOutdatedApp() {
    // TODO //
  },
};
