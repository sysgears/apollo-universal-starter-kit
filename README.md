## Apollo Universal Starter Kit with back-end & front-end Hot Code Reload

[![Join the chat at https://gitter.im/sysgears/apollo-fullstack-starter-kit](https://badges.gitter.im/sysgears/apollo-fullstack-starter-kit.svg)](https://gitter.im/sysgears/apollo-fullstack-starter-kit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![All Contributors](https://img.shields.io/badge/all_contributors-9-orange.svg?style=flat-square)](#contributors)
[![Build Status](https://travis-ci.org/sysgears/apollo-universal-starter-kit.svg?branch=master)](https://travis-ci.org/sysgears/apollo-universal-starter-kit)
[![Greenkeeper badge](https://badges.greenkeeper.io/sysgears/apollo-universal-starter-kit.svg)](https://greenkeeper.io/)

> Apollo Universal Starter Kit is a SEO friendly boilerplate for [Universal] web app development built on top of [Apollo],
> [GraphQL], [React], [React Native], [Expo], [Redux], [Express] with SQL storage support and [Twitter Bootstrap] integration.
> Hot Code Reload of back end & front end using [Webpack] and Hot Module Replacement to reflect your changes instantly
> and help you stay productive.

## Hot Code Reload demo
![screencast](https://cloud.githubusercontent.com/assets/1259926/18871714/5d122a8a-84bf-11e6-8d7a-8c941e301fa8.gif)

## Getting Started

1. Clone starter kit locally.

  ```
  git clone https://github.com/sysgears/apollo-universal-starter-kit.git
  cd apollo-universal-starter-kit
  ```

2. Install dependencies.

  ```
  npm i
  ```
  or
  ```
  yarn
  ```

3. Seed sample database data.

  ```
  npm run seed
  ```
  or
  ```
  yarn seed
  ```

4. Run starter kit in development mode.

  ```
  npm run watch
  ```
  or
  ```
  yarn watch
  ```

6. Point your browser to [http://localhost:3000](http://localhost:3000)
7. Change any app code and see the changes applied immediately!
8. Open app in multiple tabs, try to increase counter or add a new post/comment in one tab and then switch to another tab. You will see that
counter value and post/comment are updated there as well, because the application is live updated via subscriptions.

### Getting Started with React Native
This starter kit adds full [React Native] integration, with [Webpack] as a packager and [Expo]. 
No native code compilation tools are needed in order to develop native mobile applications with this kit.
You are able to run both web and mobile versions of your app at the same time connected to the same backend.

For running Android or iOS you need to set in package.json `ios` or `android` field `true`. Currently we do not support
running both at the same time, since Expo does not support this.

#### Running on a device
You need to install [Expo] app on your Android or iOS device and then you can scan the QR shown in the terminal, 
to start the app on your device.

#### Running in a simulator

##### Android
You can use [Genymotion]. After downloading and installing you might need to install VirtualBox unless you already have it.
Create a new emulator and start it. After starting the server Expo app should start on it's own.
To bring up the developer menu press ⌘+M.

##### iOS
You need to install [Xcode]. Then install Command Line Tools by running `xcode-select --install`.
Next, open up Xcode, go to preferences and click the Components tab, install a simulator from the list.
After the installation if you run the server, simulator should start on it's own and open the app in Expo.
To bring up the developer menu press ⌘+D.

#### Writing the code
This starter kit is designed so you can use it for just web, mobile or projects using both together. 
In case you do not want to use mobile, just set both `ios` or `android` settings in package.json to `false`.

We have integrated [React Native Web], so writing `universal` components that can run both on web and mobile platforms
is possible. In this case you can write your components with React Native's building blocks that are supported in
[React Native Web] and run them both on web and mobile.

To cover more differences you can use platform-specific files.

```
my_component.web.jsx
my_component.android.jsx
my_component.ios.jsx
```

In case you only want to use it for `web` and do not intend to later add `mobile` version, you can omit `.web.jsx` extension
and just use `my_component.jsx`. Same applies if you just wish to use it for `mobile`.

Currently `counter` example is implemented to support web and mobile version. If you want to try running `counter_show.jsx`
as `universal` component, just delete or rename `counter_show.web.jsx` and you can see how the same component can be used 
for both web and mobile.

#### Known issues
Currently we do not yet support persisted queries. This can be used in this starter kit currently only for web, but it is
planed in the future.

## Features
- [Webpack] for back end

  This starter kit is different from most of the starter kits out there, because it uses Webpack not only for front end,
but for back-end code as well. This enables powerful Webpack features for back-end code, such as conditional compilation,
embedding non-js files and CSS stylesheets into the code, hot code reload, etc. To use external backend set 
`serverConfig.url` at `tools/webpack.app_config.js`

- [Webpack] and [Expo] for mobile front-end

  For the best code sharing support between back-end, web front-end and mobile front-end the Webpack is used to build 
React Native JavaScript bundles with the help of using [Haul] project parts. Resulting React Native JavaScript bundles
use [Expo], so no native code compilation tools are needed in order to develop native mobile applications with this kit.

- Hot Code Reload for back end and front end

  Hot Code Reload for back end is done using [Webpack]. When Webpack prepares hot patches on the filesystem,
SIGUSR2 signal is sent to Node.js app and embedded Webpack Hot Module Runtime reacts to this signal and
applies patches to running modules from filesystem. Hot code reload for front end is using Webpack Dev Server
and Hot Module Replacement to apply patches to front-end code. Hot patches for React components are applied on the
front end and back end at the same time, so React should not complain about differences in client and server code.

- Webpack DLL vendor bundle generation and updating out of the box

  For all the non-development dependencies of project `package.json` the [Webpack] vendor DLL bundle is generated
  and updated automatically, so that Webpack didn't process vendor libraries on each change to the project, but only
  when they are actually changed. This boosts speed of cold project start in development mode and speed of hot code reload
  even if the number of dependencies is huge.

- Server Side Rendering with Apollo Redux Store sync

  On the initial web page request back end fully renders UI and hands off Apollo Redux Store state to front end. Frontend
then starts off from there and updates itself on user interactions.

  If you don't need Server Side Rendering, set package.json `ssr` field to `false`

- Optimistic UI updates

  This example application uses Apollo optimistic UI updates, that result in immediate UI update on user interaction and then,
after data arrives from the server, UI state is finalized.

- [GraphQL] API

  GraphQL is used as very flexible and much faster API in terms of bandwidth and round-trips, compared to REST.
GraphQL requests are batched together automatically by [Apollo]

- [GraphQL] subscription example

  GraphQL subscription is utilized to make counter updating in real-time.

- SQL and arbitrary data sources support

  [Knex] code to access SQLite is included as an example of using arbitrary data source with [Apollo] and [GraphQL].
NoSQL storage or any other data source can be used the same way.

  [Debug SQL] Prints out execuded queries, with respective times in development mode and can be set in package.json by `debugSQL` field `true`

- Powerful stylesheets with Hot Reloading

  [Twitter Bootstrap] in form of SASS stylesheets is used for styling demo application. Application has stylesheet
in `styles.scss` for global styling which is Hot Reloaded on change. React components styling is done by [Glamor v3].

- [Babel] for ES2017 transpiling

- [ESLint] to enforce proper code style

- [React Hot Loader v3] for the sake of completeness this project also supports `React Hot Loader v3`, but it is turned off.
By default this starter kit uses pure `Webpack HMR` for all hot reloading purposes and we think it covers all
practical needs during development and using `React Hot Loader v3` in addition to `Webpack HMR` makes hot reloading less
predictable and buggy. To turn `React Hot Loader v3` on: set `reactHotLoader` field of `package.json` to `true`. 

- [PersistGraphQL Webpack Plugin] is a tool to gather static GraphQL queries for GraphQL projects and inject them into build.
It will make front end and back end aware of static queries used in the project and will only allow these queries
for better security and less bandwidth. 

- [Dataloader] for loading comments in post example

- [GraphQL Cursor Pagination] Example of  [Relay-style cursor pagination]

- Declarative/dynamic `head` section, using [React Helmet]

- Google Analytics integration using [React GA]

- Full CRUD funcionality with Subscriptions in post example, with [ReduxForm]

## Project Structure

The project structure presented in this boilerplate is **fractal**, where functionality is grouped primarily by feature rather than file type. This structure is only meant to serve as a guide, it is by no means prescriptive. That said, it aims to represent generally accepted guidelines and patterns for building scalable applications.

```
.
├── src                      # Application source code
│   ├── client               # Front-end source code
│   │   ├── app              # Common front-end application code
│   │   └── modules          # Front-end feature-modules, each module has:
│   │   │                    # (components, containers, GraphQL queries, redux reducers)
│   │   └── styles           # Application-wide styles
│   │   └── test-helpers     # Test helper for front-end integration tests
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
│   │   └── test-helpers     # Test helper for back-end integration tests
│   │   └── api_server.js    # GraphQL api server set up
│   │   └── index.js         # Entry point to back-end wtih hot code reload
└── tools                    # All build related files (Webpack)
```

## Additional scripts

While developing, you will probably rely mostly on `npm run watch` or `yarn watch`; however, there are additional scripts at your disposal:

|`npm run or yarn <script>`|Description|
|--------------------------|-----------|
|`watch`|Run your app in develooment mode and watch your changes. Hot code reload will be enabled in development.|
|`start`|Run your app in production mode.|
|`build`|Compiles the application to the build folder.|
|`tests`|Runs unit tests with Mocha.|
|`tests:watch`|Runs unit tests with Mocha and watches for changes automatically to re-run tests.|
|`test`|Runs unit tests with Mocha and check for lint errors|
|`lint`|Check for lint errors and runs for all `.js` and `.jsx` files.|
|`seed`|Seed sample database using SQLite. Use `--prod` flag to run in "production" mode.|
|`migrate`|Migrate the sample database|
|`rollback`|Rollback the sample database to previous state.|

## Deployment to Production

### Deploying to Linux running Node.js
1. Clone starter kit locally.

  ```
  git clone https://github.com/sysgears/apollo-universal-starter-kit.git
  cd apollo-universal-starter-kit
  ```

2. Install dependencies.

  ```
  npm i
  ```
  or
  ```
  yarn
  ```
3. Seed production database data.

  ```
  npm run seed --prod
  ```
  or
  ```
  NODE_ENV=production yarn seed
  ```

5. Compile project.

  ```
  npm run build
  ```
  or
  ```
  yarn build
  ```

6. Run project in production mode.

  ```
  node build/server
  ```
  or
  ```
  npm start
  ```
  or
  ```
  yarn start
  ```

### Deploying to [Heroku]
1. Add your app to Heroku
1. Allow Heroku to install build time dependencies from the devDependencies in package.json:
   `Settings -> Config Variables -> Add`, KEY: `NPM_CONFIG_PRODUCTION`, VALUE: `false`.
1. Deploy your app on Heroku

### Heroku Demo
You can see latest version of this app deployed to Heroku here:
[https://apollo-universal-starter-kit.herokuapp.com](https://apollo-universal-starter-kit.herokuapp.com)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/1259926?v=3" width="100px;"/><br /><sub>Victor Vlasenko</sub>](https://ua.linkedin.com/in/victorvlasenko)<br />[💻](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=vlasenko "Code") [🔧](#tool-vlasenko "Tools") [📖](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=vlasenko "Documentation") [⚠️](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=vlasenko "Tests") [💬](#question-vlasenko "Answering Questions") [👀](#review-vlasenko "Reviewed Pull Requests") | [<img src="https://avatars3.githubusercontent.com/u/26156?v=3" width="100px;"/><br /><sub>mitjade</sub>](http://www.internetne-storitve.si)<br />[💻](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=mitjade "Code") [🔧](#tool-mitjade "Tools") [💬](#question-mitjade "Answering Questions") | [<img src="https://avatars0.githubusercontent.com/u/4072250?v=3" width="100px;"/><br /><sub>Ujjwal</sub>](https://github.com/mairh)<br />[💻](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=mairh "Code") [🔧](#tool-mairh "Tools") [📖](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=mairh "Documentation") [💬](#question-mairh "Answering Questions") | [<img src="https://avatars2.githubusercontent.com/u/1845914?v=3" width="100px;"/><br /><sub>Dmitry Pavlenko</sub>](https://github.com/dmitriypdv)<br />[💻](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=dmitriypdv "Code") [🔧](#tool-dmitriypdv "Tools") | [<img src="https://avatars0.githubusercontent.com/u/1349077?v=3" width="100px;"/><br /><sub>Joe</sub>](http://j0ey.co)<br />[💻](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=josephdburdick "Code") [🔧](#tool-josephdburdick "Tools") [📖](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=josephdburdick "Documentation") [💬](#question-josephdburdick "Answering Questions") | [<img src="https://avatars3.githubusercontent.com/u/3840769?v=3" width="100px;"/><br /><sub>Gilad Shoham</sub>](http://shohamgilad.wordpress.com/)<br />[💻](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=GiladShoham "Code") [🔧](#tool-GiladShoham "Tools") [💬](#question-GiladShoham "Answering Questions") | [<img src="https://avatars1.githubusercontent.com/u/5399002?v=3" width="100px;"/><br /><sub>Alexander Vetrov</sub>](https://github.com/alexandervetrov)<br />[💻](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=alexandervetrov "Code") [⚠️](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=alexandervetrov "Tests") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars0.githubusercontent.com/u/7948838?v=3" width="100px;"/><br /><sub>Nikita Pavlov</sub>](https://github.com/NickPavlov)<br />[💻](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=NickPavlov "Code") | [<img src="https://avatars2.githubusercontent.com/u/13224812?v=3" width="100px;"/><br /><sub>Yishai Chernovitzky</sub>](https://github.com/yishaic)<br />[💻](https://github.com/sysgears/apollo-fullstack-starter-kit/commits?author=yishaic "Code") [🔧](#tool-yishaic "Tools") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License
Copyright © 2016, 2017 [SysGears INC]. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[Universal]: https://medium.com/@mjackson/universal-javascript-4761051b7ae9
[Apollo]: http://www.apollostack.com
[GraphQL]: http://graphql.org
[React]: https://facebook.github.io/react
[React Hot Loader v3]: https://github.com/gaearon/react-hot-loader
[Redux]: http://redux.js.org
[ReduxForm]: http://redux-form.com
[Express]: http://expressjs.com
[Twitter Bootstrap]: http://getbootstrap.com
[Webpack]: http://webpack.github.io
[Babel]: http://babeljs.io
[Glamor v3]: https://github.com/threepointone/glamor/tree/v3
[Knex]: http://knexjs.org
[Debug SQL]: https://spin.atomicobject.com/2017/03/27/timing-queries-knexjs-nodejs/
[Heroku]: https://heroku.com
[ESLint]: http://eslint.org
[SysGears INC]: http://sysgears.com
[PersistGraphQL Webpack Plugin]: https://github.com/sysgears/persistgraphql-webpack-plugin
[Dataloader]: https://github.com/facebook/dataloader
[GraphQL Cursor Pagination]: https://medium.com/@gethylgeorge/infinite-scrolling-in-react-using-apollo-and-react-virtualized-graphql-cursor-pagination-bf80617a8a1a#.jkmmu9qz8
[Relay-style cursor pagination]: http://dev.apollodata.com/react/pagination.html#relay-cursors
[React Helmet]: https://github.com/nfl/react-helmet
[React GA]: https://github.com/react-ga/react-ga
[Haul]: https://github.com/callstack-io/haul
[React Native]: https://github.com/facebook/react-native
[React Native Web]: https://github.com/necolas/react-native-web
[Expo]: https://expo.io
[Genymotion]: https://www.genymotion.com
[Xcode]: https://developer.apple.com/xcode/
[Watchman]: https://facebook.github.io/watchman/docs/install.html