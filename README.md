<p align="center"><a href="#"><img width="150" src="https://rawgit.com/sysgears/apollo-universal-starter-kit/master/logo.svg"></a></p>

# Apollo Universal Starter Kit

[![Backers on Open Collective](https://opencollective.com/apollo-universal-starter-kit/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/apollo-universal-starter-kit/sponsors/badge.svg)](#sponsors)
[![Join the chat at https://gitter.im/sysgears/apollo-fullstack-starter-kit](https://badges.gitter.im/sysgears/apollo-fullstack-starter-kit.svg)](https://gitter.im/sysgears/apollo-fullstack-starter-kit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/sysgears/apollo-universal-starter-kit.svg?branch=master)](https://travis-ci.org/sysgears/apollo-universal-starter-kit)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

**Use [our chat] to get help or to discuss general topics about Apollo Universal Starter Kit.**

## Description

Apollo Universal Starter Kit is an SEO-friendly, fully-configured, modular starter project for developing [Universal
JavaScript] applications. You can use our kit to create your applications in JavaScript or TypeScript for all major
platforms &ndash; mobile, web, and server.

Apollo Universal Starter Kit is built on top of [Apollo], [GraphQL], [JWT], [React 16], [Redux], [React Native], [Expo],
[Knex], and [Express] with support for relational databases such as PostgreSQL and MySQL. [TypeScript] is used across
the entire project, but you can freely mix vanilla JavaScript (ES6 and ES7) and TypeScript.

The starter kit also integrates [Twitter Bootstrap], [Ant Design], [Ant Design Mobile], [Styled Components], and
[NativeBase] to provide great possibilities for styling for your web and mobile applications.

## Table of Contents

* [Overview](#overview)
    * [Why Use Apollo Universal Starter Kit](#why-use-apollo-universal-starter-kit)
    * [Concept](#concept)
    * [Architecture and Implemented Modules](#architecture-and-implemented-modules)
* [Demo](#demo)
* [Branches](#branches)
* [First Run of Apollo Universal Starter Kit](#first-run-of-apollo-universal-starter-kit)
* [Project Structure](#project-structure)
* [Wiki Sections on Apollo Universal Starter Kit](#wiki-sections-on-apollo-universal-starter-kit)
* [Support](#support)
    * [Community Support](#community-support)
    * [Commercial Support](#commercial-support)
* [Contributors](#contributors)
* [Backers](#backers)
* [Sponsors](#sponsors)
* [License Info](#license)

## Overview

### Why Use Apollo Universal Starter Kit

#### I Am a Developer

* Better productivity thanks to live reloading
* A fractal modular application architecture that's easy to support and extend
* The possibility to write application modules in TypeScript _and_ JavaScript (both ES6 and ES7 styles)
* No need to develop [typical functionalities](#architecture-and-implemented-modules) for your apps
* Zero Webpack configuration thanks to [SpinJS]

#### I Am a Client

* Your team can start creating an app for any platform &ndash; web, server, and mobile
* Your team will be able to reuse the code they write for all the platforms
* Your app will work faster thanks to the use of GraphQL instead of REST
* Your app will be easier to support and evolve thanks to the fractal modular architecture
* Your app will be based on a widely-used JavaScript ecosystem (read: it's easy to find JS developers)
* Your team can focus on the application features straightaway instead of creating the basic functionality
* Your app will be integrated with Stripe, one of the top payment processors

### Concept

Developing JavaScript-based client-server-mobile projects never was a trivial task. Not only do you have to spend time
installing the application dependencies and configuring them, but you're also constrained to implement many basic
functionalities over and over again. And you never have time for building a starter codebase that you can reuse across
all of your projects.

To relieve you from the burden of configuring the project, building the application structure, and implementing typical
features, we've created Apollo Universal Starter Kit.

Apollo Universal Starter Kit provides you with a client-server-mobile application that you can employ as a foundation
for developing new web or mobile projects using popular tools from the JavaScript ecosystem. But the starter kit doesn't
just creates a mix of top JS technologies. In fact, the kit is powered by several custom libraries and solutions to
simplify managing project configurations, creating new modules, building GraphQL queries, and carry out many other
tasks.

One such solution that helps to build and configure your Apollo Universal Starter Kit project without any complications
is [SpinJS], a custom build tool that configures Webpack for all the platforms &ndash; web, server, and mobile. With
SpinJS, we reduced the amount of errors that are caused by the third-party libraries used for building the project.

The starter kit also consists of many modules that you can augment and adapt to your specific application, or use as a
reference when implementing basic features for your applications even if you build them with other technologies.

If you want to learn more about the features available in Apollo Universal Starter Kit, follow to the [dedicated Wiki
section]

Learn more about the main modules in [Architecture and Implemented Modules](#architecture-and-implemented-modules).

### Architecture and Implemented Modules

Among all the approaches to building the application architecture, we opt for the disposable fractal-based modular
architecture. You can remove any built-in modules without breaking the application. We recommend that you develop your
custom modules with the same idea in mind when using Apollo Universal Starter Kit.

Here's the list of the implemented modules:

* **Authentication**. This module provides authentication via social networks (Facebook, GitHub, LinkedIn, and Google
using OAuth 2.0) and with username and password. It also implements functionality for refreshing a forgotten password.
* **Authorization**. The permission-based authorization with various user roles &ndash; the admin and registered user.
* **Pagination**. The app provides navigation between pages and presentation of entities.
* **Contact Us Form**. Provided functionality to send messages to the server side.
* **Posts and Comments**. The module includes functionality to add, delete, and update posts and comments.
* **State Management**. The application state stored in the database and on the client.
* **Payments**. The billing module provides functionality for recurring payments based on Stripe.
* **Mobile Chat**. A live chat based on the famous React Native Gifted Chat UI and powered by GraphQL subscriptions.
* **404 Not Found Page**. A minimalistic module for handling 404 requests.

## Demo

Here's a demo of Apollo Universal Starter Kit in work:

![screencast](https://user-images.githubusercontent.com/1259926/27387579-c6799ada-56a1-11e7-93fc-d08e9970640d.gif)

You can also view the latest version of [Apollo Universal Starter Kit deployed to Heroku]. If you want to see the mobile
application in action, check out [this demo on Expo.io].

## Branches

| Branch       | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| [stable]     | The latest stable version of the kit (recommended)                      |
| [master]     | The kit version with the latest features that may not work consistently |
| [single]     | A single-package Apollo v2 version of the kit                           |
| [apollo1]    | The Apollo v1 version of the kit                                        |
| [cli-crud]   | This version features a CLI to generate CRUD implementations            |

## First Run of Apollo Universal Starter Kit

Verify if you use Node.js 6.x or higher (Node.js 8.x is recommended) before running the starter kit in your development
environment.

1. Clone the stable branch of Apollo Universal Starter Kit.

```
git clone -b stable https://github.com/sysgears/apollo-universal-starter-kit.git
cd apollo-universal-starter-kit
```

2. Install the dependencies. Make sure that you use Yarn 1.0.0 or higher; or you can use NPM instead of Yarn to handle
the starter kit dependencies and to run scripts.

```
yarn
```

3. Seed sample data to the database. The command below will create new tables with sample data in SQLite:

```
yarn seed
```

4. Run the starter kit in development mode:

```
yarn watch
```

For more information about running this starter kit for mobile development or Docker, consult the [Getting Started] Wiki
section.

## Project Structure

The project structure presents generally accepted guidelines and patterns for building scalable web and mobile
applications.

The structure is _fractal_ meaning the functionality is grouped primarily by feature rather than by file type. But the
current structure isn't prescriptive, and you can change it however you need.

```
apollo-universal-starter-kit
├── config/                     # Global application configurations
├── docs/                       # Documentation
├── node_modules/               # Global Node.js modules
├── packages/                   # Application source code
│   ├── client/                 # Front-end package
│   │   └── src/
│   │       ├── app/            # Common front-end application code
│   │       ├── modules/        # Front-end feature-modules, each module has:
│   │       │                   # components, containers, GraphQL queries, and Redux reducers
│   │       ├── testHelpers/    # Test helper for front-end integration tests
│   │       └── index.tsx       # Entry point to web front end with hot code reload
│   ├── common/                 # Yarn package with common code, a Redux store, and logging
│   ├── mobile/                 # Mobile front-end package
│   │   └── src/
│   │       ├── .spinrc.js      # Mobile application properties
│   │       └── index.ts        # Entry point to mobile front end with live code reload
│   └── server/                 # Server package
│       ├── src/
│       │   ├── api/            # GraphQL API implementation
│       │   ├── database/       # Database migrations and seeds
│       │   │   └── migrations/ # Database migration scripts with Knex
│       │   │   └── seeds/      # Database seed scripts with Knex
│       │   ├── middleware/     # GraphQL Playground, GraphQL Express and SSR rendering
│       │   ├── modules/        # Back-end feature-modules, each module has:
│       │   │                   # schema definition, resolvers, and SQL queries
│       │   ├── sql/            # Knex connector
│       │   ├── testHelpers/    # Test helper for back-end integration tests
│       │   ├── server.js       # GraphQL API server setup
│       │   └── index.ts        # Entry point to back end with hot code reload
│       └── .spinrc.js          # Server application properties
└── tools/                      # All build and CLI-related files
```

## Wiki Sections on Apollo Universal Starter Kit

Follow to the documents that explain different aspects of running, using, and configuring Apollo Universal Starter Kit.

* [Getting Started]
    * [Installing and Running Apollo Universal Starter Kit]
    * [Running a Mobile App with Expo]
    * [Running the Starter Kit in a Mobile Simulator]
    * [Running Apollo Universal Starter Kit with Docker]
    * [Deploying Apollo Starter Kit App to Production]
* [Configuring Apollo Universal Starter Kit]
* [Writing the Code]
* [Apollo Universal Starter Kit CLI: Scaffolding Feature Modules]
* [Available Scripts]

## Support

### Community Support

* [Gitter channel] &ndash; ask questions, find answers, and participate in general discussions
* [GitHub issues] &ndash; submit issues and send feature requests
* [Wiki] &ndash; read documentation for the usage scenarios of the starter kit; edit the documentation
* [FAQ] &ndash; consult the Frequently Asked Questions section in Wiki

### Commercial Support

The [SysGears] team provides comprehensive support for commercial partners. Our team can guide you when you're using
Apollo Universal Starter Kit to build your application.

You can contact us via [Skype] or email [info@sysgears.com](mailto:info@sysgears.com).

## Contributors

Thanks a lot to all the wonderful people who contributed to Apollo Universal Starter Kit!

<a href="https://github.com/sysgears/apollo-universal-starter-kit/graphs/contributors"><img src="https://opencollective.com/apollo-universal-starter-kit/contributors.svg?width=890" /></a>

## Backers

Thanks a lot to all our backers!

<a href="https://opencollective.com/apollo-universal-starter-kit#backers" target="_blank"><img src="https://opencollective.com/apollo-universal-starter-kit/backers.svg?width=890"></a>

## Sponsors

You can support this project by becoming a sponsor! Your logo will show up here with a link to your website.

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

Copyright &copy; 2016, 2017 [SysGears INC]. This source code is licensed under the [MIT] license.

[our chat]: https://gitter.im/sysgears/apollo-fullstack-starter-kit
[mit]: LICENSE
[universal javascript]: https://medium.com/@mjackson/universal-javascript-4761051b7ae9
[apollo]: http://www.apollostack.com
[graphql]: http://graphql.org
[jwt]: https://jwt.io
[react 16]: https://reactjs.org/
[redux]: http://redux.js.org
[react native]: https://facebook.github.io/react-native/
[expo]: https://expo.io/
[knex]: http://knexjs.org
[express]: http://expressjs.com
[typescript]: https://www.typescriptlang.org/
[twitter bootstrap]: http://getbootstrap.com
[ant design]: https://ant.design
[ant design mobile]: https://mobile.ant.design
[styled components]: https://www.styled-components.com/
[nativebase]: https://nativebase.io
[spinjs]: https://github.com/sysgears/spinjs
[dedicated wiki section]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Features-and-Modules
[apollo universal starter kit deployed to heroku]: https://apollo-universal-starter-kit.herokuapp.com
[this demo on Expo.io]: https://expo.io/@sysgears/apollo-universal-starter-kit
[stable]: https://github.com/sysgears/apollo-universal-starter-kit/tree/stable
[master]: https://github.com/sysgears/apollo-universal-starter-kit/tree/master
[single]: https://github.com/sysgears/apollo-universal-starter-kit/tree/single
[apollo1]: https://github.com/sysgears/apollo-universal-starter-kit/tree/apollo1
[cli-crud]: https://github.com/sysgears/apollo-universal-starter-kit/tree/cli-crud
[getting started]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Getting-Started
[installing and running apollo universal starter kit]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Getting-Started#installing-and-running-apollo-universal-starter-kit
[running a mobile app with expo]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Getting-Started#running-a-mobile-app-with-expo
[running the starter kit in a mobile simulator]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Getting-Started#running-the-starter-kit-in-a-mobile-simulator
[running apollo universal starter kit with docker]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Getting-Started#running-apollo-universal-starter-kit-with-docker
[deploying apollo starter kit app to production]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Getting-Started#deploying-apollo-starter-kit-application-to-production
[configuring apollo universal starter kit]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Configuring-Starter-Kit
[writing the code]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Writing-the-Code
[apollo universal starter kit cli: scaffolding feature modules]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Apollo-Starter-Kit-CLI
[available scripts]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Available-Scripts
[sysgears inc]: http://sysgears.com
[gitter channel]: https://gitter.im/sysgears/apollo-fullstack-starter-kit
[github issues]: https://github.com/sysgears/apollo-universal-starter-kit/issues
[wiki]: https://github.com/sysgears/apollo-universal-starter-kit/wiki
[faq]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Frequently-Asked-Questions
[sysgears]: https://sysgears.com
[skype]: http://hatscripts.com/addskype?sysgears