import App from '/src/App.js';

if (typeof cordova !== 'undefined') {
  App.isCordova = true;

  document.addEventListener('deviceready', () => {
    window.cutout.has().then((hasCutout) => {
      if (hasCutout) {
        document.querySelector('#app').classList.add('with-statusbar-spacer');
        // TODO: make it better?
        document.addEventListener('resume', triggerStatusbar, false);
        triggerStatusbar();

        // TODO: stupid fix (statusbar disappers after activating android menu)
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
  App.isCordova = false;
  window.onload = () => main();
}


function triggerStatusbar() {
  setTimeout(() => {
    window.StatusBar.show();
    window.StatusBar.overlaysWebView(true);
    // window.StatusBar.backgroundColorByHexString("FFF");
    // window.StatusBar.styleDefault();
  }, 500);
}


function main() {
  document.app = App;
  App.init();
}
