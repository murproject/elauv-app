export default {
  version: '[AIV]{version}[/AIV]',
  buildDate: '[AIV]{date}[/AIV]',

  // isDevBuild: false,
  isDevBuild: true,

  copyright: `
    ООО "Центр робототехники"<br>
    г. Владивосток, 2022 г.
  `,

  siteLink: 'https://murproject.com/elauv',

  openSite() {
    cordova.InAppBrowser.open(this.siteLink, '_system');
  },
};
