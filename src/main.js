import App from '/src/App.js';

if (typeof cordova !== 'undefined') {
  App.runsOnCordova = true;
  App.runsOnElectron = cordova.platformId === 'electron';

  document.addEventListener('deviceready', () => {
    if (cordova.platformId === 'android') {
      window.cutout.has().then((hasCutout) => {
        if (hasCutout) {
          /* additional space on top of header if screen has cutout */
          App.container.classList.add('with-statusbar-spacer');
          document.addEventListener('resume', triggerStatusbar, false);
          triggerStatusbar();
          setInterval(() => window.StatusBar.overlaysWebView(true), 500);
        } else {
          AndroidFullScreen.immersiveMode();
        }
      });

      document.addEventListener('backbutton', function(e) {
        e.preventDefault();
      });
    }

    main();

    setTimeout(() => {
      window.IsekaiFakeSplash.hide();
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
