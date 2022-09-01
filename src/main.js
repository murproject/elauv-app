import App from '/src/App.js';

if (typeof cordova !== 'undefined') {
  App.runsOnCordova = true;
  App.runsOnElectron = cordova.platformId === 'electron';

  document.addEventListener('deviceready', () => {
    window.cutout.has().then((hasCutout) => {
      /* additional space on top of header if screen has cutout */
      if (hasCutout) {
        App.container.classList.add('with-statusbar-spacer');
        document.addEventListener('resume', triggerStatusbar, false);
        triggerStatusbar();
        setInterval(() => window.StatusBar.overlaysWebView(true), 500);
      }
    });

    document.addEventListener('backbutton', function(e) {
      e.preventDefault();
    });

    main();

    setTimeout(() => {
      window.IsekaiFakeSplash.hide();
      console.warn('ready!!');
    }, 2000);
  }, false);
} else {
  App.runsOnCordova = false;
  window.onload = () => main();
}


function triggerStatusbar() {
  setTimeout(() => {
    window.StatusBar.show();
    window.StatusBar.overlaysWebView(true);
  }, 500);
}


function main() {
  document.app = App;
  App.init();
}
