# Configuring Apollo Universal Starter Kit

This section contains information about configuring your Apollo Universal Starter Kit project.

## Global Application Settings

The global application settings are located in the `config/app.js` file. You can change the following global application 
settings:

| Option              | Type    | Description                                                                       |
| ------------------- | ------- | --------------------------------------------------------------------------------- |
| name                | String  | The project name. Defaults to 'Apollo Starter Kit'                                |
| ------------------- | ------- | --------------------------------------------------------------------------------- |
| logging             | Object  | Sets the `level`, `debugSQL`, and `apolloLogging` properties                      |
| level               | String  | Sets to `debug` for development environment and `info` for production environment |
| debugSQL            | Boolean | Print SQL commands that are executed on the back end. Defaults to `false`         |
| apolloLogging       | Boolean | Log all Apollo GraphQL operations in development environment                      |
| ------------------- | ------- | --------------------------------------------------------------------------------- |
| stackFragmentFormat | String  | Special URL setting for Visual Studio Code IDE                                    |

You can learn more about the last setting, `stackFragmentFormat`, in the following docs:

* For Windows and MacOS, consult [Opening VS Code with URLs]
* For Linux, consult [Visual Studio Code URL Handler]

## Configuring Your Apollo Starter Kit Project with SpinJS 

Apollo Universal Starter Kit uses a custom library [SpinJS] for configuring and building your project. 

You can change the SpinJS configurations in the `.spinrc.js` files that are located in each of the starter kit packages 
(but `packages/common/`):

* `packages/client/.spinrc.js` for the client-side application
* `packages/server/.spinrc.js` for the server-side application
* `packages/mobile/.spinrc.js` for the React Native mobile app

In the following section, we'll explain how you can set up Apollo Universal Starter Kit using SpinJS.

## How to Enable and Disable Code Compilation for Different Packages 

To enable or disable building the code for a specific platform &ndash; web, server, and mobile &ndash; you need to 
update a respective property in `.spinrc.js` file in the respective starter kit package. 

By default, Apollo Universal Starter Kit builds the code for the client and server applications. If you want to turn off 
building the client or server code (or both), do the following:

* Set `builders.web.enabled` to `false` in `packages/client/.spinrc.js` to turn off building the web application. 
* Set `builders.server.enabled` to `false` in `packages/server/.spinrc.js` to turn off building the server application.

Building the code for the mobile platform is disabled by default. To enable building the mobile app, do the following:

* Set `builders.mobile.android.enabled` to `true` in `packages/mobile/.spinrc.js` to build the project for Android. 
* Set `builders.mobile.ios.enabled` to `true` in `packages/mobile/.spinrc.js` to build the project for iOS.

The following example shows a default configuration for the server stored in `packages/server/.spinrc.js`:

```javascript
const config = {
  builders: {
    server: {
      entry: './src/index.ts',
      stack: ['server'],
      defines: {
        __SERVER__: true
      },
      enabled: true // set to false to turn off building the project for the server
    }
  }
}
```

## SpinJS Configuration Options

In the table below, you can find more about the options that you can add to `options` in `.spinrc.js`:

| Options                        | Type    | Description                                                                 |
| ------------------------------ | ------- | --------------------------------------------------------------------------- |
| buildDir                       | String  | Output directory for build files. Set to the relative path                  |
| dllBuildDir                    | String  | Output directory for webpack DLL files that speed up the incremental builds |
| webpackDevPort                 | Number  | The local port used for webpack-dev-server to host web application files    |
| ssr                            | Boolean | Enable Server Side Rendering on the back end                                |
| webpackDll                     | Boolean | Use Webpack DLLs to speed up incremental builds                             |
| frontendRefreshOnBackendChange | Boolean | Trigger refreshing the web application code when server code changes        |
| reactHotLoader                 | Boolean | Use React Hot Loader. Defaults to `false`                                   |
| persistGraphQL                 | Boolean | Generate and use persistent GraphQL queries                                 |

The `options.defines` property allows you to specify the variables that will be available to the application during the 
build process, such as the server port, the website URL, the development environment, and the API endpoint:

| defines         | Type    | Description                                                                           |
| --------------- | ------- | ------------------------------------------------------------------------------------- |
| __DEV__         | Boolean | The development environment. Defaults to `true`. Is set to `false` in production mode |
| __SERVER_PORT__ | Number  | Set the server port                                                                   |
| __API_URL__     | String  | The URL to the GraphQL back-end endpoint                                              |
| __WEBSITE_URL__ | String  | The URL for the web application                                                       |

Here's an example of the `defines` property taken from the `packages/server/.spinrc.js`:

```javascript
const config = {
  // other code is omitted for brevity
  options: {
    // other options are omitted
    defines: {
      __DEV__: process.env.NODE_ENV !== 'production',
      __SERVER_PORT__: 8080,
      __API_URL__: '"/graphql"', // Use a full URL if API is external, e.g. https://example.com/graphql
      __WEBSITE_URL__: '"http://localhost:3000"'
    }
  }
};
```

## Managing Application Styles

Apollo Universal Starter Kit uses [Twitter Bootstrap] for styling the client application. Besides Twitter Bootstrap, the
starter kit integrate [Ant Design] for the web application. As for styling the React Native mobile app, you can use
[Ant Design Mobile] or [NativeBase].

By default, Apollo Universal Starter Kit uses Twitter Bootstrap for the client application and NativeBase for the mobile
app. You can enable and disable the integrated styling libraries as explained below: 

* To use Ant Design instead of Bootstrap, uncomment the respective import for Ant Design and comment out the import for 
Bootstrap in the `packages/client/src/modules/common/components/web/index.jsx` file: 

```javascript
// export * from './ui-bootstrap';
export * from './ui-antd';
```

* To use Ant Design Mobile instead of NativeBase, uncomment the Ant Design Mobile export and comment out the NativeBase
export in the `packages/client/src/modules/common/components/native/index.jsx` file:

```javascript
// export * from './ui-native-base';
export * from './ui-antd-mobile';
```

[opening vs code with urls]: https://code.visualstudio.com/docs/editor/command-line#_opening-vs-code-with-urls
[visual studio code url handler]: https://github.com/sysgears/vscode-handler#visual-studio-code-url-handler
[spinjs]: https://github.com/sysgears/spinjs
[ant design]: https://ant.design
[ant design mobile]: https://mobile.ant.design
[twitter bootstrap]: http://getbootstrap.com
[nativebase]: https://nativebase.io/