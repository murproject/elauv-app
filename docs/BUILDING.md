# ElementaryAUV – Android app

- Cordova for Android support.
- No (more) frontend frameworks (because of serious performance issues on low cost / old devices).

## Prepare

- Set up Node.JS, NPM.
- VueCLI is optional (may be more convenient way to run tasks).
- Set up Cordova. May require Android Studio / Android SDK.

## Building – easy way

    npm run cordova-build-android

## Building – long way (more flexible)

Two stages to build app:

1. Build web app bundle (`cordova-build-only-www-android` task) via NPM or Vue CLI.
2. Build Android APK via Cordova

### Build `src-cordova/www` for Android

Run `cordova-build-only-www-android` task via NPM:

    npm run cordova-build-only-www-android

Or run live builds with changes watching:

    npx cross-env CORDOVA_PLATFORM=android vue-cli-service \
    --watch --mode development cordova-build-only-www-android

### Build / Run Android APK

After building web app, you can use Cordova to build APK.
Don't forget to set path to Android SDK (ANDROID_SDK_ROOT).

Start cordova build from `src-cordova` directory:

    cd src-cordova
    cordova build android --release -- --packageType=apk

You can build and deploy debug app build to your device (requires enabled debugging on your device):

    cordova run android

## Signing build

Final app build should be signed.
And all builds should be signed with the **same key**.

Without correct sign, graceful app update will be impossible.
User will be forced to delete old version and install new one.

App is signed automatically via `build.json` config:
the only thing you should to do, is to place keystore file in right place
(or manually set correct path in `build.json`):

```
- mur-keystore-android
    - keystore-mur.jks
- elauv-app
    - src
    - src-cordova
    ...
```

So, `keystore-mur.jks` file should be available with `../../mur-keystore-android/keystore-mur.jks` relative path from the `src-cordva` directory.

If you need to sign app build manually, then refer to
[Cordova docs](https://cordova.apache.org/docs/en/11.x/guide/platforms/android/?#signing-an-app), or you can generate signed build using Android Studio.