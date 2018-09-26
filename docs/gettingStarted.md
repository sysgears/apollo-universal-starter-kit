# Getting Started with Apollo Universal Starter Kit

In this section, you'll install Apollo Universal Starter Kit on your development machine and run the project for web or mobile development.

* For the list of technologies that were used in this starter kit, consult [README.md]
* For the list of available features, consult the [Features and Modules] Wiki section

Follow the links below to read the installation sections you may be interested in:

1. [Installing and Running Apollo Universal Starter Kit](#installing-and-running-apollo-universal-starter-kit)
2. [Running a Mobile App with Expo](#running-a-mobile-app-with-expo)
3. [Running the Starter Kit in a Mobile Simulator](#running-the-starter-kit-in-a-mobile-simulator)
    * [Android Studio](#android-studio)
    * [Genymotion](#genymotion)
    * [Xcode](#xcode)
4. [Running Apollo Universal Starter Kit with Docker](#running-apollo-universal-starter-kit-with-docker)
    * [Running the Starter Kit using Docker for Development](#running-the-starter-kit-using-docker-for-development)
    * [Running the Starter Kit using Docker for Production](#running-the-starter-kit-using-docker-for-production)
5. [Deploying Apollo Starter Kit App to Production](#deploying-apollo-starter-kit-application-to-production)
    * [Deploying to Linux Running Node.js](#deploying-to-linux-running-nodejs)
    * [Publishing a Mobile App](#publishing-a-mobile-app)
    * [Building a Standalone Mobile App for Google Play or App Store](#building-a-standalone-mobile-app-for-google-play-or-app-store)
    * [Deploying to Heroku](#deploying-to-heroku)    

## Installing and Running Apollo Universal Starter Kit
 
1. Use Node.js 6.x or higher (Node.js 8.x is recommended).

2. Clone the stable branch of Apollo Universal Starter Kit.

```bash
git clone -b stable https://github.com/sysgears/apollo-universal-starter-kit.git
cd apollo-universal-starter-kit
```

3. Install the dependencies. Make sure that you use Yarn 1.0.0 or higher; you can also use NPM instead of Yarn.

```bash
yarn
```

Or run:

```bash
npm install
```

4. Seed sample data to the database. The command below will create new tables with sample data in SQLite:

```bash
yarn seed
```

5. Run the starter kit in development mode:

```bash
yarn watch
```

**Note:** If you want to run the project on an Android or iOS device, check out the [Running a React Native App with 
Expo](#running-a-mobile-app-with-expo) and [Running the Starter Kit in a Mobile Simulator](#running-the-starter-kit-in-a-mobile-simulator) sections.

After running `yarn watch`, your default browser will automatically open at [http://localhost:3000/](http://localhost:3000/). You can start changing the application code, and the changes will be applied immediately thanks to live reloading. You can also open the app in multiple tabs and test it: Increase the counter or add a new post or comment, and you'll see that all opened tabs are updated simultaneously.

## Running a Mobile App with Expo

1. Install the Expo app on [your Android](https://play.google.com/store/apps/details?id=host.exp.exponent) or 
[iOS device](https://itunes.apple.com/app/expo-client/id982107779?mt=8).

2. Change the application properties in the `packages/mobile/.spinrc.js` configuration file to run the app on your 
Android or iOS device.
    * Set `config.builders.android.enabled` to `true` to run the app on an Android device. 
    * Set `config.builders.ios.enabled` to `true` to run the app on an iPhone or iPad.

Example:
```javascript
const url = require('url');

const config = {
  builders: {
    android: {
      entry: './src/index.ts',
      buildDir: 'build/android',
      dllBuildDir: 'build/android/dll',
      stack: ['react-native', 'android'],
      defines: {
        __CLIENT__: true
      },
      enabled: false // Set to true to run the app on Android
    },
    ios: {
      entry: './src/index.ts',
      buildDir: 'build/ios',
      dllBuildDir: 'build/ios/dll',
      stack: ['react-native', 'ios'],
      defines: {
        __CLIENT__: true
      },
      enabled: false // Set to true to run the app on iOS
    },
  },
}
  //...other configurations are omitted.
```

3. Launch the project:

```bash
yarn watch
```

**NOTE**: It may take up to a minute to build the mobile version of the app. The next runs will be much faster. 

4. Scan the QR codes using the Expo app on your Android or iOS device.

**NOTE**: If you're running the kit for Android and iOS development at the same time, you must scan the first QR code with an iOS device, and the second QR code with an Android device.

## Running the Starter Kit in a Mobile Simulator

### Android Studio

1. Install and launch [Android Studio].
2. On the **Tools** menu, click **AVD Manager** and [configure your virtual smartphone](https://developer.android.com/studio/run/managing-avds).
3. Choose a device from the list in **Select Hardware**. Click the **Next** button.
4. Choose a system image from the list. You can open the **x86 Images** tab and install the suitable image. 

**Note**: We recommend installing the Lollipop x86_64 API image. With this low-level API, the emulator will work more rapidly than with other APIs. 

5. Open the `~/.bashrc` file in your favorite text editor and add the following line:

```
export PATH="/home/username/Android/Sdk/platform-tools:$PATH"
```

**NOTE**: Use the username on you development machine instead of the `/username/` part in the `PATH`.

This line will add the `~/Android/Sdk/platform-tools/` directory into `PATH` and allow Expo (inside the starter kit) to use the `adb` instance from the Android SDK. Put simply, the Expo client will be automatically installed and run in the simulator when you run the project.

6. Launch your virtual phone from AVD Manager.
7. Launch the starter kit with `yarn watch`.

**Note**: If you're launching the starter kit for the first time, you may need to first run `yarn seed` to generate 
sample data. After that, you can start the app with `yarn watch`. 

8. The Expo app will automatically start. You don't need to install the Expo client on the virtual phone.

**Note**: It may take up to a minute or two to run the application on Android for the first time. The next runs will be much more rapid. 

### Genymotion

1. Downloading and install [Genymotion].
2. Install [VirtualBox]. 
3. Create a new emulator and start it. 
4. After starting the server, the Expo app will start on it's own. 
5. To bring up the developer menu, press ⌘ + M on your keyboard.

If you are using Genymotion, on the **Settings** menu select **ADB**. Then select **Use custom Android SDK tools**, and add the path to your Android SDK directory.

### Xcode

1. Install [Xcode]. 
2. Install the Command Line Tools for Xcode: 

```bash
xcode-select --install
```

3. Launch Xcode, on the **Preferences** menu, click **Components**.
4. Install a necessary simulator from the list.
5. Run the starter kit:

```bash
yarn watch
```

Simulator will start automatically and open the app in Expo. To bring up the developer menu, press ⌘ + D on your 
keyboard.

**Note**: If the iOS simulator fails to start the Expo client or the app, try resetting the simulator:

* On the **Hardware** menu, click **Erase all content and settings**.
* Restart the application.

## Running Apollo Universal Starter Kit with Docker

Get the latest versions of [Docker] and [Docker Compose] before running Apollo Universal Starter Kit with Docker.

### Running the Starter Kit using Docker for Development

To run the starter kit in development mode with live code reloading, run:

```bash
docker-compose up
```

**NOTE**: It may take a couple of minutes to run the application with Docker Compose for the first time.

When the build is ready, visit `http://localhost:3000` in your browser to view the application.

If you need to launch the project in Expo in a simulator (Android Studio or Xcode), follow the steps below:

1. Open the Expo app.
2. Tap **Explore**.
3. Tap the magnifier on the top.
4. Enter the URL `exp://localhost:19000` or `exp://000.00.0.0:19000` (use your actual IP address instead of `000.00.0.0`. The starter kit will suggest the LAN IP address that you need to use to open the mobile app in a simulator.)
5. Tap the pop up to open the app. 

**NOTE**: If you want to open the app on a cell phone, use the LAN IP address of your development machine instead of 
`localhost` in Expo. Scanning the QR codes won't work in this case.

### Running the Starter Kit using Docker for Production

To run the starter kit in production mode with Docker Compose, execute:

```bash
docker-compose -f docker-compose.prod.yml up
```

After that, open URL `http://localhost:3000` in the browser to view the application.

## Deploying Apollo Starter Kit Application to Production

### Deploying to Linux Running Node.js

1. Clone the latest stable starter kit.

```bash
git clone -b stable https://github.com/sysgears/apollo-universal-starter-kit.git
cd apollo-universal-starter-kit
```

2. Install dependencies:

```bash
yarn
```

3. Seed production database data:

```bash
NODE_ENV=production yarn seed
```

4. Set proper values for `config.options.defines.__SERVER_PORT__` and `config.options.defines.__WEBSITE_URL__` in 
`packages/server/.spinrc.js` to match your production setup.

5. If you need to run the mobile app, edit the following lines in `packages/mobile/.spinrc.js`:

```javascript
// Other configurations for the mobile app are omitted for brevity

if (process.env.NODE_ENV === 'production') {
  // Other settings are omitted for brevity
  // Change the following two line
  config.options.defines.__API_URL__ = '"https://apollo-universal-starter-kit.herokuapp.com/graphql"';
  config.options.defines.__WEBSITE_URL__ = '"https://apollo-universal-starter-kit.herokuapp.com"';
  // Other settings are omitted for brevity
}
```

If you are deploying on Heroku without a custom domain name, the production URLs may look like this:

```javascript
// code is omitted for brevity
config.options.defines.__API_URL__ = '"https://<AppName>.herokuapp.com/graphql"';
config.options.defines.__WEBSITE_URL__ = '"https://<AppName>.herokuapp.com"';
// code is omitted for brevity
```

5. Compile the project:

```bash
yarn build
```

6. Run the project in production mode:

```bash
yarn start
```

### Publishing a Mobile App

1. Compile your project for production:

```bash
yarn build
```

2. Run the following command:
```bash
yarn exp publish
```

### Building a Standalone Mobile App for Google Play or App Store

1. Compile your project for production:

```bash
yarn build
```
 
2. Run the command below to build a signed `.apk` for Android:

```bash
yarn exp ba
```

You need to run the command below to build a signed `.iap` for iOS:

```bash
yarn exp bi
```

3. Run `yarn exp bs` to get status and links for signed standalone mobile applications when the build finishes. 
For more details refer to **Building Standalone Apps** in [the Expo documentation], but use `yarn exp ..` instead of 
`exp ...` command.

### Deploying to Heroku

1. Add your app to [Heroku] (follow to the [Deploying a Node.js app] tutorial for more information).
2. Open your [Dashboard] and choose your application. You will need to allow Heroku to install build time dependencies 
from the `devDependencies` in `package.json`. 
3. Under the `Settings` tab, click `Config Variables` and then click `Add`.
4. Set `KEY` to `YARN_PRODUCTION` and `VALUE` to `false`.
5. Add the `EXP_USERNAME` and `EXP_PASSWORD` config variables from [Expo]. These variables will be used to publish your mobile Expo applications.
6. Set proper values for server port and website url in `packages/server/.spinrc.js` to match your production setup.

In order for the mobile Expo app to connect to the back-end URL, edit `packages/mobile/.spinrc.js` and change these 
lines:

```javascript
// Other configurations for the mobile app are omitted for brevity

if (process.env.NODE_ENV === 'production') {
  // Other settings are omitted for brevity
  // Change the following two line
  config.options.defines.__API_URL__ = '"https://apollo-universal-starter-kit.herokuapp.com/graphql"';
  config.options.defines.__WEBSITE_URL__ = '"https://apollo-universal-starter-kit.herokuapp.com"';
  // Other settings are omitted for brevity
}
```

If you are deploying your app on Heroku without a custom domain name, the production URLs will look like this:

```javascript
config.options.defines.__API_URL__ = '"https://<AppName>.herokuapp.com/graphql"';
config.options.defines.__WEBSITE_URL__ = '"https://<AppName>.herokuapp.com"';
```

7. Deploy your app on Heroku.

[heroku]: https://heroku.com
[docker]: https://www.docker.com/
[docker compose]: https://docs.docker.com/compose/
[expo]: https://expo.io
[genymotion]: https://www.genymotion.com
[xcode]: https://developer.apple.com/xcode/
[virtualbox]: https://www.virtualbox.org/wiki/Downloads
[android studio]: https://developer.android.com/studio/
[README.md]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/README.md
[the Expo documentation]: https://docs.expo.io/versions/latest/
[Deploying a Node.js app]: https://devcenter.heroku.com/articles/getting-started-with-nodejs
[Dashboard]: https://dashboard.heroku.com/apps
[Features and Modules]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Features-and-Modules