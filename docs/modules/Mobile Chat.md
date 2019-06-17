# Apollo Universal Starter Kit &ndash; Mobile Chat

Apollo Universal Starter Kit comes with the mobile chat module, which you can use as a starting point for creating a
mobile chat in your React Native app. The mobile chat implementation in the starter kit is based on
[React Native Gifted Chat].

The server-side and client-side components of the mobile chat module are located in the `packages/server/src/modules/chat`
and `packages/client/src/modules/chat` directories respectively.

## Getting Started

To be able to use the mobile chat, you need to run Apollo Universal Starter Kit on a mobile device.

You can run the project in Android Studio or Xcode, or you can install Expo Client on your [Android] or [iOS] device and
scan the QR codes that will be provided in the terminal.

To run Apollo Universal Starter Kit with the mobile chat, follow the steps below:

1. Clone the repository and enter the project root directory:

```bash
git clone -b stable https://github.com/sysgears/apollo-universal-starter-kit.git
cd apollo-universal-starter-kit
```

2. Run `yarn` from the root directory to install the dependencies.

3. Set the Android and iOS builders in `packages/mobile/.spinrc.js`:

    * For Android, set `config.builders.android.enabled` to true
    * For iOS, set `config.builders.ios.enabled` to true

Consult the example below:

```javascript
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
      enabled: false // set to true to run the project for Android
    },
    ios: {
      entry: './src/index.ts',
      buildDir: 'build/ios',
      dllBuildDir: 'build/ios/dll',
      stack: ['react-native', 'ios'],
      defines: {
        __CLIENT__: true
      },
      enabled: false // set to true to run the project for iOS
    }
  },
};
```

4. Run `yarn seed` from the root to create the default data in the database.

**NOTE**: If you're already using the starter kit, and your project is already connected to a database, the `yarn seed`
command will overwrite the data that was already created in the database. In order not to overwrite the data, you need
to run `yarn migrate` from the `packages/server/` directory instead of `yarn seed`.

5. Run `yarn watch` to launch the project. It may take a couple of minutes to build and run the project the first time.

6. Scan the QR code(s) that will be shown in the terminal with your Android or iOS device (or both).

7. In the mobile app, tap on the **Menu** icon. In the menu, tap **Chat** and start sending your messages. To start a
dialog in the mobile chat, you can run the Apollo Universal Starter Kit project on the other device.

## Available Features

The mobile chat provides the following features:

* Messages are sent with the help of WebSockets in real time
* Access rights management for authenticated and non-authenticated users
* Single live chat for all users who connected to the app
    * Users can send, delete, and edit their messages
    * Users can respond to messages of other users
    * Users can copy messages in chat
* Users can send, crop, rotate, and flip images

### Access Rights Management for Users

The current implementation of the mobile chat has two types of users &ndash; the anonymous user and the registered user.

If the user isn’t logged in, he or she will be able to chat as _anonymous user_, and the user's messages are labelled
accordingly. Alternately, if the user has logged in, the user's messages are signed with the username.

Authorization in the mobile chat is configured in such a way that a _logged-in user_ can’t edit or delete messages that
he or she sent as _anonymous user_ from the same mobile device. And vice versa, the _anonymous_ user isn't authorized to
change or delete the messages sent by a _logged-in_ user from the same device.

The mobile app uses the Universally Unique Identifier to differentiate which messages are sent by a non-authenticated
user.

You can test this functionality with the following demo users in Apollo Universal Starter Kit:

* username `admin@example.com` and password `admin123`, or
* username `user@example.com` and password `user1234`

### Loading Messages as a Batch

Users can view all the messages that were sent via the mobile chat, but the chat doesn't load all of the messages in one
go. Instead, the chat can load up to 50 messages at once as a batch.

The chat loads up to 50 latest messages by default. If there are more than 50 messages, the older messages can be loaded
only if you specifically requested them. You can scroll to the top of the chat and tap **Load More** to get the older
messages.

You can change the limit for messages to load in the [mobile chat configurations](#mobile-chat-configurations).

### How Images Are Stored on a Mobile Device

The mobile app caches all the images that users send via the chat in their device's cache.

When a user sends an image via the mobile chat, the image is copied and saved in the device's cache, and is immediately
shown to the sender. If the user re-sizes or crops the image before sending, the device will store the
_modified image_ to the cache (the original image stays unchanged.)

When an image is sent via the chat, the other users are first notified that an image was loaded, and the mobile app
checks whether that image was already loaded before. Put simply, the app searches for the image in the device's cache.
If the image was found, then it's loaded directly from cache thus economizing the network traffic. Otherwise, the image
is loaded via the network.

Before the image is loaded to the mobile chat, the users first see the pre-loader icon, and only after that the image is
shown.

### How Images Are Stored by the App

The images sent via the mobile chat are stored as _plain files_ in the Apollo Universal Starter Kit project in the
directory `packages/server/public/`. You can change the directory for images in the `config/chat.js` configuration file.

## Mobile Chat Configurations

All the mobile chat configurations are stored in the `config/chat.js` file. Consult the table below for possible mobile
chat configurations for your Apollo Starter Kit-based project:

| Configuration | Type    | Description                                                                                        |
| ------------- | ------- | -------------------------------------------------------------------------------------------------- |
| limit         | Number  | Specify the number of messages to be loaded when the chat is open. Defaults to 50                  |
| allowImages   | Boolean | Allow sending and displaying images. Defaults to `true`                                            |
| uploadDir     | String  | Set the directory to store the images sent via the mobile chat. Defaults to `public`               |
| giftedChat    | Object  | React Native Gifted Chat settings. Consult the [Gifted Chat documentation] about possible settings |
| ------------- | ------- | -------------------------------------------------------------------------------------------------- |
| image         | Object  | Contains various settings related to image quality and image processing in chat                    |
| maxSize       | Number  | `image` property. Set the maximal size for images in bytes. Defaults to 1 MB                       |
| ------------- | ------- | -------------------------------------------------------------------------------------------------- |
| imagePicker   | Object  | The property of `image`. Consult the [Expo documentation on ImagePicker] for configurations        |
| allowsEditing | Boolean | `imagePicker` property. Allow image editing for users. Defaults to `true`                          |
| base64        | Boolean | `imagePicker` property. Convert images to byte code. Defaults to `false`                           |
| quality       | Number  | `imagePicker` property. Set the image quality within the range from 0 to 1. Defaults to `0.75`     |

## Deploying a Mobile App with Chat

To deploy the Apollo Universal Starter Kit mobile app with chat, consult the [Deployment] section.

[react native gifted chat]: https://github.com/FaridSafi/react-native-gifted-chat
[android]: https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US
[ios]: https://itunes.apple.com/ru/app/expo-client/id982107779?mt=8
[gifted chat documentation]: https://github.com/FaridSafi/react-native-gifted-chat#props
[expo documentation on imagepicker]: https://docs.expo.io/versions/latest/sdk/imagepicker
[Deployment]: /docs/deployment.md