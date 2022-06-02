# GameMUR / ElementaryAUV JS app.

- Cordova for Android support.
- No (more) frontend frameworks (serious performance issues on low cost / old devices).

## Build `src-cordova/www` for Android (with watching changes)

    $ npx cross-env CORDOVA_PLATFORM=android vue-cli-service --watch --mode development cordova-build-only-www-android

## Build / Run Android APK

    $ cd src-cordova

    $ cordova build android

or

    $ cordova run android