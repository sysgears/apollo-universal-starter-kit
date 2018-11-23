# Apollo Universal Starter Kit Features

In this section, you can find information about the features and implemented modules available in Apollo Universal 
Starter Kit.

## Apollo GraphQL

[GraphQL] is a modern technology for web application development that's designed to solve the under-fetching 
(not enough data is sent from server to client) and over-fetching issues (too much data is sent from server to client). 

These two problems are typical of applications with the RESTful design. GraphQL, on the other hand, allows us to reduce 
the load on the application layers.

Apollo Universal Starter Kit relies on [Apollo] (hence the name of the kit), a popular GraphQL implementation, to bring
all the power of GraphQL in your applications. Apollo brings important functionality with 
[Optimistic UI updates](#optimistic-ui-updates), Apollo Link State (the local state management),
[Apollo Redux Store](#server-side-rendering-with-apollo-redux-store), [Apollo Subscriptions], and other libraries.

## Authentication & Authorization

Apollo Universal Starter Kit fully implements two authentication mechanisms: server sessions and [JSON Web Tokens]. The 
starter kit allows you to handle sessions on both the client and the server at the same time, which is a default 
authentication mode that we use.

The starter kit provides several ways for user identification: password-based identification and social-based 
identification with Google OAuth, Facebook, LinkedIn, and GitHub.

Besides authentication, Apollo Universal Starter Kit also implements fine-grained permission-based authorization with 
three user types &ndash; administrators, registered users, and non-registered users.

## Internationalization with i18next

Apollo Universal Starter Kit integrates the [i18next] library to help localize the application using a complete 
internationalization solution for the web and server applications. The starter kit provides the functionality to 
automatically detect and remember the language, as well as remember the language selected by the user.

## Optimistic UI Updates

The starter kit uses Apollo [Optimistic UI] updates, which results in immediate updates of the user interface after the 
user interacted with it. Once the new data arrives from the server, the application state is finalized.

## Payments Module

Apollo Starter Kit provides the payments module built using [Stripe] to help you develop the recurring billing 
functionality. You can check out the [payments module documentation] for more details about the provided functionality 
and how to run the project with the payments module.

## PubSub Mechanism Based on GraphQL Subscriptions

The starter kit integrates a PubSub mechanism for delivering live data from the server to the client using a simple
library [graphql-subscriptions]. The Apollo Universal Starter Kit modules _counter_, _payments_, and _posts & comments_ 
use GraphQL Subscriptions to update the content in the client application when the changes are made on the server.

## Pagination
  
You can try out an example of the [GraphQL cursor pagination] and the [relay-style cursor pagination] in the pagination 
module.

## State Management

The counter module provides three examples of state management for your Apollo Universal Starter Kit-based applications.
The starter kit stores the state on the client using Apollo Link State and Redux. The application state is also stored
on the server using Apollo Subscriptions for real-time updates.

## Server Side Rendering with Apollo Redux Store

The starter kit uses Apollo Redux Store to handle Server Side Rendering (SSR). Once the client application requests a 
web page, the back end fully renders the user interface and hands off the state of Apollo Redux Store to the front end. 
Then, the front end updates itself when the user interacts with it. 

You may consult the [Apollo Starter Kit configurations] to know how to enable and disable SSR.

## Support for SQL and Arbitrary Data Sources

The [Knex] code for accessing SQLite is included as an example of using arbitrary data source with Apollo and 
GraphQL. You can use any NoSQL storage or other data source in a similar way.

[Debug SQL] prints out excluded queries, with respective times in development mode. To set up debugging SQL, consult 
[Apollo Universal Starter Kit configurations].

## Styling Libraries

The starter kit provides great styling possibilities by integrating a few generic style libraries. 

The demo web application uses the Sass version of [Twitter Bootstrap]. To help you style the React components, the 
starter kit was integrated with [Styled Components]. The React Native mobile application uses [NativeBase].
    
Additionally, you can use [Ant Design] instead of Twitter Bootstrap for the web application, and [Ant Design Mobile] 
instead of NativeBase for the mobile app.

## Google Analytics

We integrated Google Analytics into the starter kit with the help of [React Google Analytics].

## Webpack for Back End

The starter kit stands out compared to similar starter projects in that it uses [webpack] not only for building the code 
for the client application, but for the server application as well. Using webpack for the server application adds 
powerful features such as conditional compilation, embedding non-JavaScript and CSS files into the code, hot code 
reloading, and other convenient functionalities.

## Webpack and Expo for Mobile Front End

To ensure that the code can be shared among all the Apollo Starter Kit packages &ndash; client, server, and mobile 
&ndash; we set up webpack to build the bundles for React Native mobile app with the help of [Haul CLI]. Haul CLI and 
webpack are coordinated with [SpinJS] to replace [Metro], a Facebook custom bundler for React Native apps.

The created React Native bundles use [Expo], which allows you avoid using additional tools for compiling the native 
code. Consequently, it's simpler to develop native mobile applications with the starter kit.

## Generation of Webpack DLL Vendor Bundles

We set up the starter kit to ensure that _webpack vendor DLL bundle_ is generated and updated automatically for all the 
non-development dependencies. We ensured that webpack processes vendor libraries only when they were actually changed, 
not on every change. This approach boosts the speed for cold project start in development mode and for hot code 
reloading even if the number of dependencies is very large.

## Hot Code Reload and Live Code Reload

Automatic code reloading for the server is done using webpack. When webpack prepares hot patches on the filesystem, the 
SIGUSR2 signal is sent to the Node.js application, and embedded webpack Hot Module Runtime reacts to this signal and 
applies patches to running modules from the filesystem.
  
The hot code reload for the front end is implemented with [webpack-dev-server] and the [Hot Module Replacement] plugin. 
Hot patches for React components are applied on the front end and back end at the same time, so React won't complain 
about the differences between the client and server code.

## Babel 
  
Apollo Universal Starter Kit uses a popular transpiler [Babel] for transpiling the ES7 and ES6 code to ES5.

## DataLoader 
 
[DataLoader] is a Facebook library that helps to solve a specific issue &ndash; the N+1 query problem when sending 
GraphQL requests to the database &ndash; by batching and caching data requests. 

You can view the example of DataLoader usage in the posts & comments module.

## ESLint and TSLint

[ESLint] and [TSLint] will help you stick with the proper code style. Apollo Universal Starter Kit automatically checks 
any changes in JavaScript files with ESLint and the changes in TypeScript files with TSLint before they're committed to 
Git.

## React & React Native

Apollo Universal Starter Kit is set up for [React] and [React Native] for the client and mobile applications 
respectively. When building React and React Native components, you can use both `.jsx` and `.tsx` extensions as the 
starter kit supports the [JSX] and [TSX] syntax.

## React Helmet

[React Helmet] is a small library for React applications that's used for creating a declarative and dynamic HEAD 
section for HTML pages. Put simply, using React Helmet in the starter kit, we create the `<head></head>` with metadata, 
styles, and title for the React application.

## React Hot Loader 

The starter kit supports [React Hot Loader], although we turned off this library by default. The starter kit uses only 
the Hot Module Reloading webpack plugin for hot reloading of your code. We believe that the HMR plugin for webpack 
covers all practical needs during development.

Using React Hot Loader in conjunction with webpack HMR makes hot reloading less predictable, which leads to various 
errors. Consult the [Configuring Apollo Starter Kit] section if you still want to use React Hot Loader.

## TypeScript
  
Most starter kit code is written in [TypeScript] to ensure type safety, but you can freely mix JavaScript for developing 
your modules when TypeScript starts restricting your possibilities.

Just as JavaScript, TypeScript is also compiled to ES5 code.

[graphql]: https://graphql.org/
[apollo]: http://www.apollostack.com
[apollo subscriptions]: https://www.apollographql.com/docs/apollo-server/features/subscriptions.html
[json web tokens]: https://jwt.io/
[i18next]: https://www.i18next.com
[optimistic ui]: https://www.apollographql.com/docs/react/features/optimistic-ui.html
[stripe]: https://stripe.com
[payments module documentation]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/docs/modules/stripeSubscription.md
[graphql-subscriptions]: https://github.com/apollographql/graphql-subscriptions
[graphql cursor pagination]: https://medium.com/@gethylgeorge/infinite-scrolling-in-react-using-apollo-and-react-virtualized-graphql-cursor-pagination-bf80617a8a1a#.jkmmu9qz8
[relay-style cursor pagination]: http://dev.apollodata.com/react/pagination.html#relay-cursors
[knex]: http://knexjs.org
[debug sql]: https://spin.atomicobject.com/2017/03/27/timing-queries-knexjs-nodejs/
[apollo universal starter kit configurations]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/docs/configuration.md
[twitter bootstrap]: http://getbootstrap.com
[styled components]: https://www.styled-components.com/
[nativebase]: https://nativebase.io
[ant design]: https://ant.design
[ant design mobile]: https://mobile.ant.design
[react google analytics]: https://github.com/react-ga/react-ga
[webpack]: https://webpack.js.org/
[haul cli]: https://github.com/callstack-io/haul
[spinjs]: https://github.com/sysgears/spinjs
[metro]: https://facebook.github.io/metro/
[expo]: https://expo.io
[webpack-dev-server]: https://webpack.js.org/configuration/dev-server/
[hot module replacement]: https://webpack.js.org/plugins/hot-module-replacement-plugin/
[babel]: https://babeljs.io/
[dataloader]: https://github.com/facebook/dataloader
[eslint]: https://eslint.org/
[tslint]: https://palantir.github.io/tslint/
[react]: https://reactjs.org/
[react native]: https://facebook.github.io/react-native/
[jsx]: https://reactjs.org/docs/jsx-in-depth.html
[tsx]: https://www.typescriptlang.org/docs/handbook/jsx.html
[react helmet]: https://www.npmjs.com/package/react-helmet
[react hot loader]: https://github.com/gaearon/react-hot-loader
[typescript]: https://www.typescriptlang.org/
