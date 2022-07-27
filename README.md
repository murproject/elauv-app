# ElementaryAUV – Android app

- Cordova for Android support.
- No (more) frontend frameworks (because of serious performance issues on low cost / old devices).

## Prepare

- Set up Node.JS, NPM. VueCLI is optional.
- Set up Cordova. May require Android Studio.

## Build `src-cordova/www` for Android (with watching changes)

    $ npx cross-env CORDOVA_PLATFORM=android vue-cli-service --watch --mode development cordova-build-only-www-android

## Build / Run Android APK

    $ cd src-cordova

    $ cordova build android

or

    $ cordova run android