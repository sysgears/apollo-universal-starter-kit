# Getting Started with Apollo Universal Starter Kit

In this section, you'll install Apollo Universal Starter Kit and run the project for web or mobile development.

Follow the links below to the installation sections you're interested in:

1. [Installing and Running Apollo Universal Starter Kit](#installing-and-running-apollo-universal-starter-kit)
2. [Running the Mobile App in Expo Client](#running-the-mobile-app-with-expo)
3. [Running the Starter Kit in a Mobile Simulator](#running-the-starter-kit-in-a-mobile-simulator)
    * [Android Studio](#android-studio)
    * [Genymotion](#genymotion)
    * [Xcode](#xcode)

## Installing and Running Apollo Universal Starter Kit

1. Install Node.js 6.x or higher. Using Node.js 8.x is recommended.

2. Clone the stable branch of Apollo Universal Starter Kit.

```bash
git clone -b stable https://github.com/sysgears/apollo-universal-starter-kit.git
cd apollo-universal-starter-kit
```

The stable branch contains only the approved and tested functionalities that were introduced in Apollo Universal Starter
Kit. You may clone the master branch instead of the stable branch, but the application from master may not work
consistently.

3. Install the dependencies:

```bash
yarn
```

**NOTE**: Apollo Starter Kit uses Yarn's special feature called _workspaces_ along with [Lerna] to handle the package
architecture. Using Yarn workspaces and Lerna allows us to build libraries and applications in a single repository.
This is why, though the starter kit comes with four `package.json` files with different dependencies, you can install
all the dependencies with `yarn` from the root directory.

Managing packages architecture this way isn't possible with NPM, which is why we recommend Yarn. Otherwise, you'll have
to install the dependencies separately for each package &ndash; client, server, and mobile &ndash; to be able to run the
project.

4. Seed sample data to the database. The command below will create new tables with sample data in SQLite:

```bash
yarn seed
```

5. Run the starter kit in development mode:

```bash
yarn watch
```

After running `yarn watch`, your default browser will automatically open the web application at [http://localhost:3000/].
You can start changing the application code, and the changes will be applied immediately thanks to the live reload. You
can also open the app in multiple tabs and test it: Increase the counter or add a new post or comment, and you'll see
that all opened tabs are updated simultaneously.

**NOTE**: Apollo Universal Starter Kit provides React, Angular and Vue frontends.

To run Angular frontend execute:
`yarn watch:angular`

To run Vue frontend execute:
`yarn watch:vue`

## Running the Mobile App with Expo

1. Install the Expo Client app on [your Android] or [iOS device].

2. Create data in the database (if you've already run Apollo Universal Starter Kit before, skip this step):

```bash
yarn seed
```

3. Launch the project:

```bash
yarn watch:android
```

or

```bash
yarn watch:ios
```

**NOTE**: It may take up to a minute or more to build the mobile version of the app. The next runs will be much faster.

5. Scan the QR codes using Expo Client on your Android or iOS device.

If scanning the codes with Expo Client doesn't launch the mobile app, you can manually enter the link to the app:

1. Tap **Explore** in Expo Client.
2. Enter the link similar to this: `exp://000.000.000:19000`. Use your real IP address instead of 000.000.000.

You can look for the link for Expo Client in the console: Apollo Starter Kit kindly provides the links you can use to
open the app on your device.

## Running the Starter Kit in a Mobile Simulator

### Android Studio

1. Install and launch [Android Studio].
2. On the **Tools** menu, click **AVD Manager** and [configure your virtual smartphone].
3. Choose a device from the list in **Select Hardware**. Click **Next**.
4. Choose a system image from the list. You can open the **x86 Images** tab and install the suitable image.

**NOTE**: we recommend installing the Lollipop x86_64 API image. With this low-level API, the emulator will work more
rapidly than with other APIs.

5. Open the `~/.bashrc` file in your favorite text editor and add the following line:

```bash
export PATH="/home/username/Android/Sdk/platform-tools:$PATH"
```

This line will add the `~/Android/Sdk/platform-tools/` directory into `PATH` and allow Expo (inside the starter kit) to
use the `adb` instance from the Android SDK. Put simply, the Expo client will be automatically installed and run in the
simulator when you run the Apollo Universal Starter Kit project for mobile.

**NOTE**: use the username on you development computer instead of the `/username/` part in `PATH`, for example,
`"/home/johndoe/Android/Sdk/platform-tools:$PATH"`.

6. Launch your virtual phone from AVD Manager: open the **Tools** menu and click **AVD Manager**. In the list of
available virtual devices, run the one you created.

7. Launch the starter kit with `yarn watch:android` or `yarn watch:ios`.

**NOTE**: If you're launching the starter kit for the first time, you may need to first run `yarn seed` to generate
sample data.

8. The Expo Client app will automatically start. You don't need to additionally install Expo Client on the virtual
smartphone.

**NOTE**: It may take up to a minute or two to build and run the mobile app on Android for the first time. The next runs
will be more rapid.

### Genymotion

1. Downloading and install [Genymotion].

2. Install [VirtualBox].

3. Create a new emulator and start it.

4. After starting the server, Expo Client will start on it's own.

5. To bring up the developer menu, press ⌘ + M on your keyboard.

If you are using Genymotion, on the **Settings** menu select **ADB**. Then select **Use custom Android SDK tools**, and
add the path to your Android SDK directory.

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

**NOTE**: If the iOS simulator fails to start Expo Client or the starter kit mobile app, try resetting the simulator:

* On the **Hardware** menu, click **Erase all content and settings**.
* Restart the application.

[lerna]: https://lernajs.io/
[http://localhost:3000/]: http://localhost:3000/
[your android]: https://play.google.com/store/apps/details?id=host.exp.exponent
[ios device]: https://itunes.apple.com/app/expo-client/id982107779?mt=8
[android studio]: https://developer.android.com/studio/
[configure your virtual smartphone]: https://developer.android.com/studio/run/managing-avds
[genymotion]: https://www.genymotion.com
[virtualbox]: https://www.virtualbox.org/wiki/Downloads
[xcode]: https://developer.apple.com/xcode/
