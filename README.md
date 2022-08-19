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
    cordova build android

You can build and deploy app to your device (requires enabled debugging on your device):

    cordova run android

## Signing build

You need to sign the final build.
All builds should be signed with the same key.

Without correct sign, app update would be impossible.
User will be forced to delete old version and install new one.

<!-- TODO -->
