## Apollo Universal Starter Kit Feature Modules

In this review, you can find information about all the features and implemented modules available in Apollo Universal Starter Kit. You can follow to dedicated documents (if available) that give more details about the implemented functionality.

* **Authentication & Authorization with GraphQL, Passport.js and JWT**
  
  The application uses Passport.js and [JSON Web Token] along with GraphQL to provide authentication and authorization mechanisms. JWT can be stored in either localStorage or cookies in the browser.

* **[Stripe]**

  We integrated **Stripe** into the starter application to help develop subscription plans for your app. You can also check out the [subscription module] documentation for more details.

* **[GraphQL]**

  Your Apollo Starter Kit app will rely on GraphQL, a flexible and swift API as compared to traditionally used REST approach. The starter kit uses [Apollo], a popular GraphQL implementation, to automatically batch together the GraphQL requests.

* **[GraphQL] Subscriptions**

  The starter kit comes with full CRUD functionality. You can test the provided Counter, Subscriptions, and Posts & 
  Comments example. This functionality uses [ReduxForm].

* **Pagination**
  
  You can try out an example of the [GraphQL cursor pagination] and the [relay-style cursor pagination].

* **[Dataloader]** 
 
  The Dataloader is used for loading comments in posts.

* **[React Helmet]**

  React Helmet is used to create a declarative and dynamic HEAD section for the application.

* **Google Analytics**

  The starter kit application is integrated with Google Analytics with the help of [React GA].

* **[Webpack] for Back End**

  The starter kit stands out as compared to similar starter projects in that it uses Webpack not only for building the front-end code, but for the back-end code as well. Using Webpack for the server adds powerful features such as conditional compilation, embedding non-JS files and CSS stylesheets into the code, hot code reloading, and many other features.

* **[Webpack] and [Expo] for Mobile Front End**

  To ensure that the code can be shared among all the packages (server, web, and mobile), we set up Webpack to build React Native JavaScript bundles with the help of [Haul]. The created React Native bundles use Expo, which allows you not to use additional tools for compiling the native code. Consequently, it's simpler to develop native mobile applications with this starter kit.

* **Hot Code Reload and Live Code Reload**

  Automatic code reloading for the **server** is done using [Webpack]. When Webpack prepares hot patches on the filesystem, the SIGUSR2 signal is sent to the Node.js application, and embedded Webpack Hot Module Runtime reacts to this signal and applies patches to running modules from the filesystem. 
  
  Hot code reload for the front end is implemented with Webpack Dev Server and Hot Module Replacement plugin. Hot patches for React components are applied on the front end and back end at the same time, so React won't complain about the differences in client and server code.

* **Generation of Webpack DLL Vendor Bundles**

  We set up the starter kit to ensure that Webpack vendor DLL bundle is generated and updated automatically for all the non-development dependencies. We ensure that Webpack processes vendor libraries only when they were actually changed, not on every change. This approach boosts the speed for cold project start in development mode and for hot code reloading even if the number of dependencies is very large.

* **Server Side Rendering (SSR) with Apollo Redux Store**

  On the initial web page request, the back end fully renders the user interface and hands off the state of Apollo Redux Store to the front end. The front end then starts off from there and updates itself when the user interacts with it. Consult the [Apollo Starter Kit configurations](https://github.com/sysgears/apollo-universal-starter-kit/wiki/Configuring-Apollo-Starter-Kit#changing-other-spinjs-configurations) to know how to switch on and off this feature.

* **Optimistic UI Updates**

  The example starter kit application uses Apollo optimistic UI updates, which results in immediate updates of the user interface after the user interacted with it. After the new data arrives from the server, the UI state is finalized.

* **Support for SQL and Arbitrary Data Sources**

  The [Knex] code for accessing SQLite is included as an example of using arbitrary data source with [Apollo] and [GraphQL]. You can use any NoSQL storage or other data source in a similar way.

  [Debug SQL] prints out execuded queries, with respective times in development mode. To set up debugging SQL, consult [Apollo Starter Kit configurations](https://github.com/sysgears/apollo-universal-starter-kit/wiki/Configuring-Apollo-Starter-Kit#debugging-graphql-and-sql).

* **Great Styling Options**

  The starter kit provides great styling possibilities. The demo web application uses the Sass version of [Twitter Bootstrap]. To help you style the React components, the starter kit was integrated with [Styled Components]. The mobile  application uses [NativeBase] for styling. Thanks to hot reloading, any changes to styles are immediately applied to the app.
    
  You can change the default style libraries. For example, you can use integrated [Ant Design] instead of Twitter Bootstrap for the web application. Instead of NativeBase for the mobile app, the starter kit can use [Ant Design Mobile].
  
  To learn how to change style libraries, consult the [Managing Application Styles] Wiki section. 

* **[Babel]** 
  
  For transpiling ES7 and ES6 code to ES5, we use a popular transpiler Babel.

* **[ESLint]**
 
  ESLint will help you stick with the proper code style.

* **[React Hot Loader v3]** 
  
  The starter kit supports React Hot Loader, although we turned off this library by default. The starter kit uses only the Hot Module Reloading plugin for hot reloading. We're sure that the HMR plugin for Webpack covers all practical needs during development.

  Using React Hot Loader in conjunction with Webpack HMR makes hot reloading less predictable leads to various errors. Consult the [Configuring Apollo Starter Kit] Wiki section to turn on React Hot Loader.

* **[PersistGraphQL Webpack Plugin]** 

  PersistGraphQL Webpack plugin is a custom tool that we built for the starter kit. This plugin enables us to gather static GraphQL queries for GraphQL projects and inject them into the build. The plugin makes front end and back end aware of static queries used in the project and only allows these queries for better security and less bandwidth.

* **[TypeScript]**
  
  This starter kit supports both ES6-style JavaScript and TypeScript. TypeScript is compiled to ES5.

* **[i18next]**

  We added the famous internationalization library i18next.

[mit]: LICENSE
[apollo]: http://www.apollostack.com
[graphql]: http://graphql.org
[react 16]: https://facebook.github.io/react
[react hot loader v3]: https://github.com/gaearon/react-hot-loader
[expo]: https://expo.io
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
[persistgraphql webpack plugin]: https://github.com/sysgears/persistgraphql-webpack-plugin
[dataloader]: https://github.com/facebook/dataloader
[graphql cursor pagination]: https://medium.com/@gethylgeorge/infinite-scrolling-in-react-using-apollo-and-react-virtualized-graphql-cursor-pagination-bf80617a8a1a#.jkmmu9qz8
[relay-style cursor pagination]: http://dev.apollodata.com/react/pagination.html#relay-cursors
[react helmet]: https://github.com/nfl/react-helmet
[react ga]: https://github.com/react-ga/react-ga
[haul]: https://github.com/callstack-io/haul
[react native]: https://github.com/facebook/react-native
[json web token]: https://jwt.io
[typescript]: https://www.typescriptlang.org
[i18next]: https://www.i18next.com
[Stripe]: https://stripe.com
[subscription module]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/packages/client/src/modules/subscription/README.md
[managing application styles]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Configuring-Apollo-Starter-Kit#managing-application-styles
[configuring apollo starter kit]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Configuring-Apollo-Starter-Kit#changing-other-spinjs-configurations