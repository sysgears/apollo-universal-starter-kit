<p align="center"><a href="#"><img width="150" src="https://rawgit.com/sysgears/apollo-universal-starter-kit/master/logo.svg"></a></p>

## Apollo v2 GraphQL app Starter Kit for Mobile, Web and Server with Webpack used everywhere

### _Use [our chat](https://gitter.im/sysgears/apollo-fullstack-starter-kit), please, to get help really quick or to discuss general topic_ ###

[![Backers on Open Collective](https://opencollective.com/apollo-universal-starter-kit/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/apollo-universal-starter-kit/sponsors/badge.svg)](#sponsors)
[![Join the chat at https://gitter.im/sysgears/apollo-fullstack-starter-kit](https://badges.gitter.im/sysgears/apollo-fullstack-starter-kit.svg)](https://gitter.im/sysgears/apollo-fullstack-starter-kit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/sysgears/apollo-universal-starter-kit.svg?branch=master)](https://travis-ci.org/sysgears/apollo-universal-starter-kit)
[![Greenkeeper badge](https://badges.greenkeeper.io/sysgears/apollo-universal-starter-kit.svg)](https://greenkeeper.io/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

> Apollo Universal Starter Kit is a SEO friendly boilerplate for [Universal] Mobile and Web app development built on top
> of [Apollo], [GraphQL], [React 16], [React Native], [Expo], [Redux], [Express] with SQL storage support, for styling
> [Twitter Bootstrap], [NativeBase] and [Ant Design] integration. Hot Code Reload of back end & front end using
> [Webpack] and Hot Module Replacement to reflect your changes instantly and help you stay productive.

## Hot Code Reload demo

![screencast](https://user-images.githubusercontent.com/1259926/27387579-c6799ada-56a1-11e7-93fc-d08e9970640d.gif)

## Mobile app demo

Checkout our [Mobile App Demo](https://expo.io/@sysgears/apollo-universal-starter-kit)

If you are using Apollo v1 please use
[starter kit from `apollo1` branch](https://github.com/sysgears/apollo-universal-starter-kit/tree/apollo1)

## Getting Started

1. Clone starter kit locally.

```
git clone https://github.com/sysgears/apollo-universal-starter-kit.git
cd apollo-universal-starter-kit
```

2. Install dependencies.

```
yarn
```

3. Seed sample database data.

```
yarn seed
```

4. Run starter kit in development mode.

```
yarn watch
```

6. You browser will open the web application automatically with web app in a new tab.
7. Change any app code and see the changes applied immediately!
8. Open app in multiple tabs, try to increase counter or add a new post/comment in one tab and then switch to another
   tab. You will see that counter value and post/comment are updated there as well, because the application is live
   updated via subscriptions.

### Getting Started with React Native

This starter kit adds full [React Native] integration, with [Webpack] as a packager and [Expo]. No native code
compilation tools are needed in order to develop native mobile applications with this kit. You are able to run both web
and mobile versions of your app at the same time connected to the same backend.

For running Android or iOS you need to set in `.spinrc.js` `builders.ios.enabled` and/or `builders.android.enabled` field `true`.

#### Running on a device

You need to install [Expo] app on your Android or iOS device and then you can scan the QR shown in the terminal, to
start the app on your device.

#### Running in a simulator

##### Android

Download and install [Android Studio] and configure virtual phone via `Tools -> Android -> AVD Manager`. Choose Lollipop
x86_64 API for your Phone, it is the lowest x86_64 API (because it is x86_64 emulator will work really fast). Make sure
that you add `~/Android/Sdk/platform-tools` folder that has `adb` added into `PATH` environment variable, so that Expo
inside this kit used `adb` instance from `Android SDK`.

Then launch your virtual phone and launch starter kit after that via `yarn watch`. After starting, Expo app should start
on it's own.

You can also use [Genymotion]. After downloading and installing you might need to install VirtualBox unless you already
have it. Create a new emulator and start it. After starting the server Expo app should start on it's own. To bring up
the developer menu press ⌘+M.

##### iOS

You need to install [Xcode]. Then install Command Line Tools by running `xcode-select --install`. Next, open up Xcode,
go to preferences and click the Components tab, install a simulator from the list. After the installation if you run the
server, simulator should start on it's own and open the app in Expo. To bring up the developer menu press ⌘+D.

Note: If iOS simulator fail to start expo client or the app: Try to reset the simulator in `Hardware -> Erase all
content and settings` and restart the application.

## Support

### Community support

* [Gitter channel] - questions, answers, general discussions
* [GitHub issues] - submit issues, send feature requests
* [Wiki] - community driven effort to document all the usage scenarios of the starter kit, editable by anyone
* [FAQ] - frequently asked questions wiki page

### Commercial support

[SysGears](https://sysgears.com) team provides advanced support for commercial partners. A commercial partner will have
a premium access to our team whether this is to help you with your code based on this starter kit or related
technologies used in the kit. Contact us using [Skype](http://hatscripts.com/addskype?sysgears) or via email:
[info@sysgears.com](mailto:info@sysgears.com)

#### Writing the code

This starter kit is designed so you can use it for just web, mobile or projects using both together. In case you do not
want to use mobile, just set both `builders.ios.enabled` or `builders.android.enabled` settings in `.spinrc.js` to `false`.

We have integrated [React Native Web], so writing `universal` components that can run both on web and mobile platforms
is possible. In this case you can write your components with React Native's building blocks that are supported in [React
Native Web] and run them both on web and mobile.

To cover more differences you can use platform-specific files.

```
MyComponent.web.jsx
MyComponent.android.jsx
MyComponent.ios.jsx
```

In case you only want to use it for `web` and do not intend to later add `mobile` version, you can omit `.web.jsx`
extension and just use `MyComponent.jsx`. Same applies if you just wish to use it for `mobile`.

Currently `counter` example is implemented to support web and mobile version. If you want to try running
`CounterView.jsx` as `universal` component, just delete or rename `CounterView.web.jsx` and you can see how the same
component can be used for both web and mobile.

#### Known issues

Currently we do not yet support persisted queries. This can be used in this starter kit currently only for web, but it
is planed in the future.

### Using with Docker

Get latest Docker and Docker Compose: https://www.docker.com/ https://docs.docker.com/compose/

#### Starting Docker container for Development

To run starter kit in development mode with hot code reload execute:

```
docker-compose up
```

, then open URL `http://localhost:3000` in web browser or open URL `exp://localhost:19001` in Expo Client Explore
section (tap magnifier, enter URL, then tap it below). In case if you want to open the app on the phone use LAN IP of
your development machine instead of `localhost` in Expo Client (QR code scanning will not work, because QR code will
have address of Docker container).

#### Starting Docker container for Production

To run starter kit in production mode execute:

```
docker-compose -f docker-compose.prod.yml up
```

, then open URL `http://localhost:3000` in web browser.

### Configuring starter kit

This starter kit supplies boilerplate code for multiple platforms:

* Node.js backend
* Web frontend
* Android frontend
* iOS frontend

If you don't need some of these platforms you can turn off building their code in `.spinrc.js` as well as edit other build properties described below:

| Option                         | Description                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------- |
| buildDir                | output directory for build files                                            |
| dllBuildDir                    | output directory for Webpack DLL files used to speed up incremental builds    |
| webpackDevPort                 | the local port used for Webpack Dev Server process to host web frontend files |
| \_\_BACKEND_URL__                     | URL to GraphQL backend endpoint                                               |
| ssr                            | Use server side rendering in backend                                          |
| webpackDll                     | Utilize Webpack DLLs to speed up incremental builds                           |
| frontendRefreshOnBackendChange | Trigger web frontend refresh when backend code changes                        |
| reactHotLoader                 | Utilize React Hot Loader v3                                                   |
| persistGraphQL                 | Generate and use persistent GraphQL queries                                   |

There are also application config options available in `config/app.js` to aid with debugging GraphQL and SQL:

| Option        | Description                            |
| ------------- | -------------------------------------- |
| debugSQL      | Print executed by backend SQL commands |
| apolloLogging | Log all Apollo GraphQL operations      |

### Feature Modules Scaffolding with CLI

This starter kit encourages modular design of application features. Each feature should be designed as a decoupled
module, deleting feature should ideally not break the remaining application. Basic feature module scaffolding is
provided with the following command:

```
yarn cli addmodule <moduleName>
```

This will create all the necessary files to start developing on a new feature module. It creates `client` and `server`
module. If you would like to only add one or the other, add a second parameter like:

```
yarn cli addmodule <moduleName> [client|server]
```

If you wish to remove an existing module, do so with:

```
yarn cli deletemodule <moduleName>
```

Again you can specify `client` or `server` as a second parameter, if you only wish to delete one or the other.

This way you can easily delete existing examples, like `counter`, `post` or `user`. Do keep in mind that you need at
least one module linked on the server side. So deleting both, before creating any new ones first, will result in
`TypeError: Cannot read property 'schema' of undefined` on the server side.

Run the following command to see the CLI help:

```
yarn cli
```

## Features and examples included

* Full LOGIN funcionality in user example with [JWT] tokens stored in `localStorage` and `cookies`

* [Stripe] Payment Processor integration as a starting point for apps that use user subscriptions.
Check [subscription module documentation](src/client/modules/subscription/README.md) for details.

* [GraphQL] API

  GraphQL is used as very flexible and much faster API in terms of bandwidth and round-trips, compared to REST. GraphQL
  requests are batched together automatically by [Apollo]

* [GraphQL] subscriptions example

  Full CRUD functionality with Counter updating and Subscriptions in Posts and Comments example, with [ReduxForm]

* [GraphQL Cursor Pagination] Example of [Relay-style cursor pagination]

* [Dataloader] for loading comments in post example

* Declarative/dynamic `head` section, using [React Helmet]

* Google Analytics integration using [React GA]

* [Webpack] for back end

  This starter kit is different from most of the starter kits out there, because it uses Webpack not only for front end,
  but for back-end code as well. This enables powerful Webpack features for back-end code, such as conditional
  compilation, embedding non-js files and CSS stylesheets into the code, hot code reload, etc.

* [Webpack] and [Expo] for mobile front-end

  For the best code sharing support between back-end, web front-end and mobile front-end the Webpack is used to build
  React Native JavaScript bundles with the help of using [Haul] project parts. Resulting React Native JavaScript bundles
  use [Expo], so no native code compilation tools are needed in order to develop native mobile applications with this
  kit.

* Hot Code Reload for back end and front end

  Hot Code Reload for back end is done using [Webpack]. When Webpack prepares hot patches on the filesystem, SIGUSR2
  signal is sent to Node.js app and embedded Webpack Hot Module Runtime reacts to this signal and applies patches to
  running modules from filesystem. Hot code reload for front end is using Webpack Dev Server and Hot Module Replacement
  to apply patches to front-end code. Hot patches for React components are applied on the front end and back end at the
  same time, so React should not complain about differences in client and server code.

* Webpack DLL vendor bundle generation and updating out of the box

  For all the non-development dependencies of project `package.json` the [Webpack] vendor DLL bundle is generated and
  updated automatically, so that Webpack didn't process vendor libraries on each change to the project, but only when
  they are actually changed. This boosts speed of cold project start in development mode and speed of hot code reload
  even if the number of dependencies is huge.

* Server Side Rendering with Apollo Redux Store sync

  On the initial web page request back end fully renders UI and hands off Apollo Redux Store state to front end.
  Frontend then starts off from there and updates itself on user interactions.

  If you don't need Server Side Rendering, set `.spinrc.js` `ssr` field to `false`

* Optimistic UI updates

  This example application uses Apollo optimistic UI updates, that result in immediate UI update on user interaction and
  then, after data arrives from the server, UI state is finalized.

* SQL and arbitrary data sources support

  [Knex] code to access SQLite is included as an example of using arbitrary data source with [Apollo] and [GraphQL].
  NoSQL storage or any other data source can be used the same way.

  [Debug SQL] Prints out execuded queries, with respective times in development mode and can be set in `config/app.js` by
  `debugSQL` field `true`

* Powerful stylesheets with Hot Reloading

  [Twitter Bootstrap] in form of SASS stylesheets is used for styling demo application. Application has stylesheet in
  `styles.scss` for global styling which is Hot Reloaded on change. React components styling is done by [Styled
  Components].

  If you would like to use a different styling than [Twitter Bootstrap], UI components are structured in a way to make
  it easy to use something else. We already prepared [Ant Design] integation. To switch the UI all you need to do is
  rename the import in `src/client/modules/common/components/web/index.jsx`.

  [NativeBase] for mobile styling, with an option to use [Ant Design Mobile]. To switch, just change the export in
  `src/client/modules/common/components/native/index.jsx`.

* [Babel] for ES2017 transpiling

* [ESLint] to enforce proper code style

* [React Hot Loader v3] for the sake of completeness this project also supports `React Hot Loader v3`, but it is turned
  off. By default this starter kit uses pure `Webpack HMR` for all hot reloading purposes and we think it covers all
  practical needs during development and using `React Hot Loader v3` in addition to `Webpack HMR` makes hot reloading
  less predictable and buggy. To turn `React Hot Loader v3` on: set `reactHotLoader` field of `.spinrc.js` to `true`.

* [PersistGraphQL Webpack Plugin] is a tool to gather static GraphQL queries for GraphQL projects and inject them into
  build. It will make front end and back end aware of static queries used in the project and will only allow these
  queries for better security and less bandwidth.

* [TypeScript] support. Though the kit itself uses ES6 and [Flow] you can add source files written in TypeScript. In
  order to do that add `'ts'` into the `.spinrc.js -> options -> stack`, install TypeScript devDependencies: `yarn add
  -D awesome-typescript-loader typescript` and put `tsconfig.json` into the root folder.

## Project Structure

The project structure presented in this boilerplate is **fractal**, where functionality is grouped primarily by feature
rather than file type. This structure is only meant to serve as a guide, it is by no means prescriptive. That said, it
aims to represent generally accepted guidelines and patterns for building scalable applications.

```
.
├── src                      # Application source code
│   ├── client               # Front-end source code
│   │   ├── app              # Common front-end application code
│   │   └── modules          # Front-end feature-modules, each module has:
│   │   │                    # (components, containers, GraphQL queries, redux reducers)
│   │   └── styles           # Application-wide styles
│   │   └── testHelpers      # Test helper for front-end integration tests
│   │   └── index.jsx        # Entry point to web front-end wtih hot code reload
│   ├── common               # Common code, redux store and logging
│   ├── mobile               # Mobile front-end source code
│   │   ├── index.js         # Entry point to mobile front-end wtih live code reload
│   └── server               # Back-end server source code
│   │   ├── api              # GraphQL API implementation
│   │   └── database         # Database migrations and seeds
│   │   │   └── migrations   # Database migration scripts using Knex
│   │   │   └── seeds        # Database seed scripts using Knex
│   │   └── middleware       # Graphiql, GraphQL express and SSR rendering
│   │   └── modules          # Back-end server feature-modules, each module has:
│   │   │                    # (schema definition, resolvers, sql queries)
│   │   └── sql              # Knex connector
│   │   └── testHelpers      # Test helper for back-end integration tests
│   │   └── server.js        # GraphQL api server set up
│   │   └── index.js         # Entry point to back-end wtih hot code reload
└── tools                    # All build and cli related files
```

## Additional scripts

While developing, you will probably rely mostly on `yarn watch`; however, there are additional scripts at your disposal:

| `npm run or yarn <script>` | Description                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| `watch`                    | Run your app in development mode and watch your changes. Hot code reload will be enabled in development. |
| `start`                    | Run your app in production mode.                                                                         |
| `build`                    | Compiles the application to the build folder.                                                            |
| `tests`                    | Runs unit tests with Mocha.                                                                              |
| `tests:watch`              | Runs unit tests with Mocha and watches for changes automatically to re-run tests.                        |
| `test`                     | Runs unit tests with Mocha and check for lint errors                                                     |
| `lint`                     | Check for lint errors and runs for all `.js` and `.jsx` files.                                           |
| `seed`                     | Seed sample database using SQLite. Use `--prod` flag to run in "production" mode.                        |
| `migrate`                  | Migrate the sample database                                                                              |
| `rollback`                 | Rollback the sample database to previous state.                                                          |
| `cli`                      | CLI tool, currently used for modules scaffolding only.                                                   |

## Deployment to Production

### Deploying to Linux running Node.js

1. Clone starter kit locally.

```
git clone https://github.com/sysgears/apollo-universal-starter-kit.git
cd apollo-universal-starter-kit
```

2. Install dependencies.

```
yarn
```

3. Seed production database data.

```
NODE_ENV=production yarn seed
```

5. Compile project.

```
yarn build
```

6. Run project in production mode.

```
yarn start
```

### Publishing mobile apps

1. Compile project for production via `yarn build`
2. Run `yarn exp publish` to publish, the URL like:
   [`https://exp.host/@vlasenko/apollo-universal-starter-kit`](https://exp.host/@vlasenko/apollo-universal-starter-kit)
   where your users can access mobile app from Expo Client will be printed in terminal.

### Building standalone mobile apps for Play Store and App Store

1. Compile project for production via `yarn build`
2. Run `yarn exp ba` to launch building signed `.apk` or `yarn exp bi` for signed `.iap`.
3. Run `yarn exp bs` to get status and links for signed standalone mobile applications when build finishes. For more
   details refer to [Expo Build standalone apps documentation], but use `yarn exp ..` instead of `exp ...` command.

### Deploying to [Heroku]

1. Add your app to Heroku
2. Allow Heroku to install build time dependencies from the devDependencies in `package.json`: `Settings -> Config Variables -> Add`, KEY: `YARN_PRODUCTION`, VALUE: `false`.
3. Add `EXP_USERNAME` and `EXP_PASSWORD` config variables there as well. They will be used to publish mobile Expo Client applications
4. Deploy your app on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Heroku Demo

You can see latest version of this app deployed to Heroku here:
[https://apollo-universal-starter-kit.herokuapp.com](https://apollo-universal-starter-kit.herokuapp.com)

## Contributors

Thanks goes to all the wonderful people who already contributed to Apollo Universal Starter Kit!

<a href="https://github.com/sysgears/apollo-universal-starter-kit/graphs/contributors"><img src="https://opencollective.com/apollo-universal-starter-kit/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/apollo-universal-starter-kit#backer)]

<a href="https://opencollective.com/apollo-universal-starter-kit#backers" target="_blank"><img src="https://opencollective.com/apollo-universal-starter-kit/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website.
[[Become a sponsor](https://opencollective.com/apollo-universal-starter-kit#sponsor)]

<a href="https://opencollective.com/apollo-universal-starter-kit/sponsor/0/website" target="_blank"><img src="https://opencollective.com/apollo-universal-starter-kit/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/apollo-universal-starter-kit/sponsor/1/website" target="_blank"><img src="https://opencollective.com/apollo-universal-starter-kit/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/apollo-universal-starter-kit/sponsor/2/website" target="_blank"><img src="https://opencollective.com/apollo-universal-starter-kit/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/apollo-universal-starter-kit/sponsor/3/website" target="_blank"><img src="https://opencollective.com/apollo-universal-starter-kit/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/apollo-universal-starter-kit/sponsor/4/website" target="_blank"><img src="https://opencollective.com/apollo-universal-starter-kit/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/apollo-universal-starter-kit/sponsor/5/website" target="_blank"><img src="https://opencollective.com/apollo-universal-starter-kit/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/apollo-universal-starter-kit/sponsor/6/website" target="_blank"><img src="https://opencollective.com/apollo-universal-starter-kit/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/apollo-universal-starter-kit/sponsor/7/website" target="_blank"><img src="https://opencollective.com/apollo-universal-starter-kit/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/apollo-universal-starter-kit/sponsor/8/website" target="_blank"><img src="https://opencollective.com/apollo-universal-starter-kit/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/apollo-universal-starter-kit/sponsor/9/website" target="_blank"><img src="https://opencollective.com/apollo-universal-starter-kit/sponsor/9/avatar.svg"></a>

## License

Copyright © 2016, 2017 [SysGears INC]. This source code is licensed under the [MIT] license.

[mit]: LICENSE
[universal]: https://medium.com/@mjackson/universal-javascript-4761051b7ae9
[apollo]: http://www.apollostack.com
[graphql]: http://graphql.org
[react 16]: https://facebook.github.io/react
[react hot loader v3]: https://github.com/gaearon/react-hot-loader
[redux]: http://redux.js.org
[reduxform]: http://redux-form.com
[express]: http://expressjs.com
[twitter bootstrap]: http://getbootstrap.com
[nativebase]: https://nativebase.io
[ant design]: https://ant.design
[ant design mobile]: https://mobile.ant.design
[webpack]: http://webpack.github.io
[babel]: http://babeljs.io
[styled components]: https://www.styled-components.com
[knex]: http://knexjs.org
[debug sql]: https://spin.atomicobject.com/2017/03/27/timing-queries-knexjs-nodejs/
[expo build standalone apps documentation]: https://docs.expo.io/versions/v18.0.0/guides/building-standalone-apps.html
[heroku]: https://heroku.com
[eslint]: http://eslint.org
[sysgears inc]: http://sysgears.com
[persistgraphql webpack plugin]: https://github.com/sysgears/persistgraphql-webpack-plugin
[dataloader]: https://github.com/facebook/dataloader
[graphql cursor pagination]: https://medium.com/@gethylgeorge/infinite-scrolling-in-react-using-apollo-and-react-virtualized-graphql-cursor-pagination-bf80617a8a1a#.jkmmu9qz8
[relay-style cursor pagination]: http://dev.apollodata.com/react/pagination.html#relay-cursors
[react helmet]: https://github.com/nfl/react-helmet
[react ga]: https://github.com/react-ga/react-ga
[haul]: https://github.com/callstack-io/haul
[react native]: https://github.com/facebook/react-native
[react native web]: https://github.com/necolas/react-native-web
[expo]: https://expo.io
[genymotion]: https://www.genymotion.com
[xcode]: https://developer.apple.com/xcode/
[android studio]: https://developer.android.com/studio/index.html
[jwt]: https://jwt.io
[gitter channel]: https://gitter.im/sysgears/apollo-fullstack-starter-kit
[github issues]: https://github.com/sysgears/apollo-universal-starter-kit/issues
[flow]: https://flow.org
[typescript]: https://www.typescriptlang.org
[Stripe]: https://stripe.com
[Wiki]: https://github.com/sysgears/apollo-universal-starter-kit/wiki
[FAQ]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Frequently-Asked-Questions
