<p align="center"><a href="#"><img width="150" src="https://rawgit.com/sysgears/apollo-universal-starter-kit/master/logo.svg"></a></p>

# Apollo Universal Starter Kit

[![Backers on Open Collective](https://opencollective.com/apollo-universal-starter-kit/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/apollo-universal-starter-kit/sponsors/badge.svg)](#sponsors)
[![Join the chat at https://gitter.im/sysgears/apollo-fullstack-starter-kit](https://badges.gitter.im/sysgears/apollo-fullstack-starter-kit.svg)](https://gitter.im/sysgears/apollo-fullstack-starter-kit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.com/sysgears/apollo-universal-starter-kit.svg?branch=master)](https://travis-ci.com/sysgears/apollo-universal-starter-kit)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

**Use [our chat] to get help or discuss general topics about Apollo Universal Starter Kit.**

## Official Website

Visit [apollokit.org] to learn about Apollo Universal Starter Kit. You can also test a [demo application] deployed on
Heroku.

## Description

![](Technologies.png)

Apollo Universal Starter Kit is an SEO-friendly, fully configured, modular starter project for developing [Universal
JavaScript] applications. You can use this kit to create your applications in JavaScript or TypeScript for all major
platforms &ndash; mobile, web, and server.

Apollo Universal Starter Kit is built with [Apollo], [GraphQL], [React], [Angular], [React Native], [Expo], [Knex.js],
and [Express] with support for relational databases such as PostgreSQL, MySQL, and SQLite.

[TypeScript] is our language of choice and we use it across the entire project. However, you can freely mix vanilla
JavaScript (the ES6 and ES7 syntax) and TypeScript when creating your modules.

The starter kit also integrates [Twitter Bootstrap], [Ant Design], and [NativeBase]
to provide great possibilities for styling for your web and mobile applications.

## Table of Contents

* [Overview](#overview)
    * [Why Use Apollo Universal Starter Kit](#why-use-apollo-universal-starter-kit)
    * [Concept](#concept)
    * [Architecture and Implemented Modules](#architecture-and-implemented-modules)
* [Demo](#demo)
* [Branches](#branches)
* [First Run of Apollo Universal Starter Kit](#first-run-of-apollo-universal-starter-kit)
* [Project Structure](#project-structure)
* [Apollo Universal Starter Kit Documentation](#apollo-universal-starter-kit-documentation)
* [Support](#support)
    * [Community Support](#community-support)
    * [Commercial Support](#commercial-support)
* [Contributors](#contributors)
* [Backers](#backers)
* [Sponsors](#sponsors)
* [License Info](#license)

## Overview

### Why Use Apollo Universal Starter Kit

#### I am a Developer

* Great productivity thanks to live reload and (partial) hot code reload
* Fractal modular architecture that's easy to support and extend
* The possibility to create modules in TypeScript _and_ JavaScript at the same time
* No need to develop [typical features](#architecture-and-implemented-modules) for your applications

#### I am a Project Manager

* Your application will work faster thanks to GraphQL
* Your team will be able to reuse the code for all the platforms
* Your team can create client, server, and mobile JavaScript applications
* Your application will be easier to support and evolve thanks to the fractal modular architecture
* Your application will be based on a widely-used JavaScript ecosystem (it's easy to find JS developers)
* Your team can develop new features straightaway instead of creating the basic features
* Your application will be integrated with Stripe, one of the top payment processors

### Concept

Developing client-server-mobile projects in JavaScript never was a trivial task. Not only do you have to spend time
installing the application dependencies and configuring them, but you're also constrained to implement many basic
functionalities over and over again. And you never have time to develop a starter codebase that you can reuse across
all of your projects.

To relieve you from the burden of configuring the project, developing the application structure, and implementing
typical features, we created Apollo Universal Starter Kit.

Apollo Universal Starter Kit provides you with a client-server-mobile application that you can employ as a foundation
for developing new web or mobile projects using popular tools from the JavaScript ecosystem. But our starter kit does so
much more than just creating a mix of popular JS technologies &mdash; it's powered by a few **custom** libraries and
solutions to simplify managing project configurations, creating new modules, building GraphQL queries, and perform many
other tasks.

The starter kit also consists of many modules that you can augment and adapt to develop your specific application. Also,
you can use those prebuilt modules as a reference when implementing basic features for your applications even if you
create them using other technologies.

### Architecture and Implemented Modules

Among all the approaches to building the application architecture, we opt for the _disposable fractal-based modular
architecture_. Thanks to it, it's possible to remove any built-in module from Apollo Universal Starter Kit without
breaking the application. We recommend that you develop your custom modules with the same idea in mind when using our
starter kit.

Apollo Universal Starter Kit comes with the following modules:

* **Authentication**. Authentication via social networks (Facebook, GitHub, LinkedIn, and Google using OAuth) and
password-based authentication; refreshing a forgotten password
* **Authorization**. Permission-based authorization with various user roles
* **Contact Us Form**. Functionality to send messages to the server
* **Internationalization**. A complete internationalization solution for the client and server
* **Mobile Chat**. A live chat based on the [React Native Gifted Chat] and powered by GraphQL subscriptions
* **Pagination**. Navigation between pages and presentation of entities
* **Payments**. Functionality for recurring payments based on Stripe
* **Posts and Comments**. Functionality to add, delete, and update posts and comments
* **State Management**. The application state stored in the database and on the client using different approaches
* **404 Not Found Page**. A minimalistic module for handling 404 requests

If you don't want to use the pre-built modules in your project, you can remove them using a [dedicated CLI]. For module
names, see the names of directories under `modules`.

To learn more about the features and modules available in Apollo Universal Starter Kit, follow to the dedicated section
[Features and Modules].

## Demo

Here's a demo of Apollo Universal Starter Kit in action:

![screencast](https://user-images.githubusercontent.com/1259926/27387579-c6799ada-56a1-11e7-93fc-d08e9970640d.gif)

You can try out the latest version of Apollo Universal Starter Kit [deployed on Heroku]. If you want to see the mobile
React Native application in action, check out [this demo on Expo.io].

## Branches

| Branch       | Description                                                         |
| ------------ | ------------------------------------------------------------------- |
| [stable]     | The latest stable version of the kit (recommended)                  |
| [master]     | The kit version with the latest features. May not work consistently |
| [single]     | A single-package Apollo v2 version of the kit                       |
| [apollo1]    | The Apollo v1 version of the kit                                    |
| [cli-crud]   | This kit version features a CLI to generate CRUD implementations    |

## First Run of Apollo Universal Starter Kit

Verify if you use Node.js 6.x or higher (Node.js ^10 is recommended) before running the starter kit.

1. Clone the stable branch of Apollo Universal Starter Kit.

```
git clone -b stable https://github.com/sysgears/apollo-universal-starter-kit.git
cd apollo-universal-starter-kit
```

**NOTE**: The master branch is not recommended for development. Use it at your own risk.

**NOTE**: If you're going to use Windows to develop with Apollo Universal Starter Kit, you need to additionally enable
symlinks _before_ you run the project.

For Windows 10:

* Press `Win` + `I` to open **Settings**
* Click **Update & Security**
* Click the **For Developers** tab
* In the **Use developer features** window, switch to **Developer Mode**

**NOTE**: You can remove the unnecessary stacks from Apollo Universal Starter Kit by using the CLI. Consult a
[respective CLI section]. Alternatively, you can use the capabilities of your operating system. For example, by running
the command below, you can remove all Scala server files:

```bash
find -name server-scala | xargs rm -rf
```

If you don't need the ready-made modules, you can also remove them using the [custom CLI].

2. Install the dependencies. Make sure that you use Yarn 1.0.0 or higher.

```
yarn
```

You can use NPM instead of Yarn to handle the starter kit dependencies and to run scripts. Throughout the Apollo
Universal Starter Kit documentation, we'll always use Yarn.

3. Seed sample data to the database. The command below will create new tables with sample data in SQLite:

```
yarn seed
```

SQLite is a typical default relational database installed in most Linux distributions including Mac OS X; otherwise,
consult [SQLite installation guide].

4. Run the starter kit in development mode:

```
yarn watch
```

The server application will be running on [http://localhost:3000], while the client application will be running on
[http://localhost:8080]. The terminal will tell your the exact ports.

For more information about running this starter kit for mobile development or Docker, consult the [Getting Started]
guide.

## Project Structure

The project structure presents generally accepted guidelines and patterns for building scalable web and mobile
applications.

The structure is _fractal_ meaning the available functionality is grouped primarily by feature rather than by file type.
But the current structure isn't prescriptive, and you can change it however you like.

```
apollo-universal-starter-kit
├── config                      # Various application configurations
├── docs                        # Documentation
├── node_modules                # Global Node.js modules
├── modules                     # All the prebuilt project modules
├── packages                    # Available packages
│   ├── client                  # React client
│   ├── client-angular          # Angular client
│   ├── client-vue              # Vue client
│   ├── common                  # Common code
│   ├── mobile                  # React Native mobile client
│   ├── server                  # Node.js and Express server
│   └── server-scala            # Scala server
└── tools                       # All build and CLI-related files
```

Inside `modules`, you'll find all the prebuilt modules that Apollo Universal Starter Kit comes with. Each module under
`modules` contains sub-directories with module implementations for different technologies. For example, if you look up
the module `modules/core`, you'll see the following sub-modules:

```
apollo-universal-starter-kit
├── modules                       # Available packages
│   ├── core                      # The core module
│       ├── client-angular        # Core functionality for Angular app
│       ├── client-react          # Core functionality for React app
│       ├── client-react-native   # Core functionality for React Native app
│       ├── client-vue            # Core functionality for Vue app
│       ├── common                # React Native mobile client
│       ├── server-scala          # Core functionality for Scala server
│       └── server-ts             # Core functionality for Express server
└── tools                         # All build and CLI-related files
```


## Apollo Universal Starter Kit Documentation

Follow to the documentation concerning different aspects of how to run, configure, and develop with Apollo Universal
Starter Kit.

* [Getting Started]
    * [Installing and Running Apollo Universal Starter Kit]
    * [Running the Mobile App with Expo]
    * [Running the Starter Kit in a Mobile Simulator]
* [Running Apollo Universal Starter Kit with Docker]
* [Deploying Apollo Universal Starter Kit to Production]
* [Configuring Apollo Universal Starter Kit]
* [Features and Modules]
* [Writing Code]
* [Debugging Code]
* [Available Scripts]
* [Frequently Asked Questions]
* [Project Structure]
* [Importing Modules]

Tools

* [Apollo Universal Starter Kit CLI]

Modules

* [Stripe Payments]
* [Mobile Chat]

## Support

### Community Support

* [Gitter channel] &ndash; ask questions, find answers, and participate in general discussions
* [GitHub issues] &ndash; submit issues and send feature requests
* [Wiki] &ndash; read documentation for the usage scenarios of the starter kit; edit the documentation
* [FAQ] &ndash; consult the Frequently Asked Questions section

### Commercial Support

The [SysGears] team provides comprehensive support for commercial partners. Our team can guide you when you're using
Apollo Universal Starter Kit to build your application.

You can contact us via [Skype] or email [info@sysgears.com](mailto:info@sysgears.com).

## Contributors

Thanks a lot to all the wonderful people who contributed to Apollo Universal Starter Kit!

<a href="https://github.com/sysgears/apollo-universal-starter-kit/graphs/contributors">
    <img src="https://opencollective.com/apollo-universal-starter-kit/contributors.svg?width=890" />
</a>

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

Copyright &copy; 2016-2019 [SysGears (Cyprus) Limited]. This source code is licensed under the [MIT] license.

[our chat]: https://gitter.im/sysgears/apollo-fullstack-starter-kit
[mit]: LICENSE
[universal javascript]: https://medium.com/@mjackson/universal-javascript-4761051b7ae9
[apollo]: http://www.apollostack.com
[graphql]: http://graphql.org
[jwt]: https://jwt.io
[react]: https://reactjs.org/
[angular]: https://angular.io/
[react native]: https://facebook.github.io/react-native/
[expo]: https://expo.io/
[knex.js]: http://knexjs.org
[express]: http://expressjs.com
[typescript]: https://www.typescriptlang.org/
[twitter bootstrap]: http://getbootstrap.com
[ant design]: https://ant.design
[nativebase]: https://nativebase.io
[apollokit.org]: https://apollokit.org
[demo application]: https://apollo-universal-starter-kit.herokuapp.com
[react native gifted chat]: https://github.com/FaridSafi/react-native-gifted-chat
[deployed on heroku]: https://apollo-universal-starter-kit.herokuapp.com
[this demo on Expo.io]: https://expo.io/@sysgears/apollo-universal-starter-kit
[stable]: https://github.com/sysgears/apollo-universal-starter-kit/tree/stable
[master]: https://github.com/sysgears/apollo-universal-starter-kit/tree/master
[single]: https://github.com/sysgears/apollo-universal-starter-kit/tree/single
[apollo1]: https://github.com/sysgears/apollo-universal-starter-kit/tree/apollo1
[cli-crud]: https://github.com/sysgears/apollo-universal-starter-kit/tree/cli-crud
[custom cli]: https://github.com/sysgears/apollo-universal-starter-kit/tree/cli-crud
[sqlite installation guide]: http://www.sqlitetutorial.net/download-install-sqlite/
[http://localhost:3000]: http://localhost:3000
[http://localhost:8080]: http://localhost:8080
[getting started]: /docs/Getting%20Started.md
[installing and running apollo universal starter kit]: /docs/Getting%20Started.md#installing-and-running-apollo-universal-starter-kit
[running the mobile app with expo]: /docs/Getting%20Started.md#running-the-mobile-app-with-expo
[running the starter kit in a mobile simulator]: /docs/Getting%20Started.md#running-the-starter-kit-in-a-mobile-simulator
[running apollo universal starter kit with docker]: /docs/Docker.md
[deploying apollo universal starter kit to production]: /docs/Deployment.md
[configuring apollo universal starter kit]: /docs/Configuration.md
[dedicated cli]: /docs/tools/CLI.md#deleting-features-with-deletemodule
[respective cli section]: /docs/tools/CLI.md#selecting-the-technology-stack-with-choosestack
[features and modules]: /docs/Features%20and%20Modules.md
[writing code]: /docs/Writing%20Code.md
[debugging code]: /docs/Debugging.md
[apollo universal starter kit cli]: /docs/tools/CLI.md
[available scripts]: /docs/Yarn%20Scripts.md
[stripe payments]: /docs/modules/Stripe%20Subscription.md
[mobile chat]: /docs/modules/Mobile%20Chat.md
[project structure]: /docs/Project%20Structure.md
[importing modules]: /docs/Importing%20Modules.md
[frequently asked questions]: /docs/FAQ.md
[sysgears (cyprus) limited]: http://sysgears.com
[gitter channel]: https://gitter.im/sysgears/apollo-fullstack-starter-kit
[github issues]: https://github.com/sysgears/apollo-universal-starter-kit/issues
[wiki]: https://github.com/sysgears/apollo-universal-starter-kit/wiki
[faq]: /docs/FAQ.md
[sysgears]: https://sysgears.com
[skype]: http://hatscripts.com/addskype?sysgears
