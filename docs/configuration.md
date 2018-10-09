# Configuring Apollo Universal Starter Kit

In this section, you'll familiarize with how to configure your Apollo Universal Starter Kit project.

## Configuring Your Project with SpinJS 

Apollo Universal Starter Kit uses a unique tool [SpinJS] for configuring and building the projects. In order to configure your starter kit project, you'll need to change the SpinJS configuration files &ndash; `.spinrc.js`.

The starter kit comes with three packages for server, web, and mobile applications. Look for the `server/`, `web/`, and `mobile/` directories in `packages/`. Each package has its own `.spinrc.js` file you'll work with.

The `.spinrc.js` files are located in the root of each package:

* `packages/web/.spinrc.js` for the client-side application;
* `packages/server/.spinrc.js` for the server-side application; and
* `packages/mobile/.spinrc.js` for the mobile app.

In the following two sections, we'll explain how you can set up Apollo Universal Starter Kit using SpinJS.

### Choosing the Platform 

To change the platforms for which you'll run the project, you need to update just one property in `.spinrc.js`. 

* To turn off building the server-side code, set `builders.server.enabled` to `false`.
* To turn off building the client-side code, set `builders.web.enabled` to `false`.
* To turn off building the mobile client-side code, set `builders.mobile.enabled` to `false`.

The following example shows default configurations for the server (`packages/server/.spinrc.js`):

```javascript
const config = {
  builders: {
    server: {
      entry: './src/index.ts',
      stack: ['server'],
      defines: {
        __SERVER__: true
      },
      enabled: true // Set to false to turn off building the project for the server
    },
    test: {
      stack: ['server'],
      roles: ['test'],
      defines: {
        __TEST__: true
      }
    }
  },
}
  
  // other code is omitted
```

### Changing Other SpinJS Configurations

You can also edit many other build properties in `.spinrc.js`. In the table below, you can find the options that you can 
add to `config.options`:

| Options                        | Type    | Description                                                                        |
| ------------------------------ | ------- | ---------------------------------------------------------------------------------- |
| buildDir                       | String  | The output directory for build files. Set the relative path for the directory      |
| dllBuildDir                    | String  | The output directory for Webpack DLL files used to speed up the incremental builds |
| webpackDevPort                 | Number  | The local port used for Webpack Dev Server to host web front-end files             |
| \_\_API_URL__                  | String  | The URL to the GraphQL backend endpoint                                            |
| \_\_WEBSITE_URL__              | String  | The URL for the web app                                                            |
| ssr                            | Boolean | Use server side rendering on the back end                                          |
| webpackDll                     | Boolean | Use Webpack DLLs to speed up incremental builds                                    |
| frontendRefreshOnBackendChange | Boolean | Trigger refreshing the web front-end code when back-end code changes               |
| reactHotLoader                 | Boolean | Use React Hot Loader v3, defaults to `false`                                       |
| persistGraphQL                 | Boolean | Generate and use persistent GraphQL queries                                        |

## Debugging GraphQL and SQL

You can change global application configurations in `config/app.js` to get debugging information for GraphQL and SQL:

| Option        | Type    | Description                                          |
| ------------- | ------- | ---------------------------------------------------- |
| debugSQL      | Boolean | Print SQL commands that are executed on the back end |
| apolloLogging | Boolean | Log all Apollo GraphQL operations                    |

## Managing Application Styles

The starter kit application is built with [Twitter Bootstrap], but the app components are structured in a way to make it simple to use a different style library instead of Bootstrap.

Besides Bootstrap, we've integrated [Ant Design] for the web app and [NativeBase] for the mobile app. 

* To use Ant Design instead of Bootstrap, you need to uncomment a respective style import, and comment out the import for Bootstrap. These imports are located in `packages/client/src/modules/common/components/web/index.jsx`:
 
```javascript
// export * from './ui-bootstrap';
export * from './ui-antd';
```

* To use Ant Design Mobile instead of NativeBase, you need to uncomment the respective export in 
`packages/client/src/modules/common/components/native/index.jsx`. Remember to comment out the `./ui-native-base` export:

```javascript
// export * from './ui-native-base';
export * from './ui-antd-mobile';
```

The application code will be rebuilt, and you'll see the new styles applied to the app.

[spinjs]: https://github.com/sysgears/spinjs
[ant design]: https://ant.design
[ant design mobile]: https://mobile.ant.design
[twitter bootstrap]: http://getbootstrap.com