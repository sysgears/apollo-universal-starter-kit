# [WIP] External Modules

### Proposal

Modules should primarily be external.

This is inline with the idea that AUSK (this repo) aims to 

1. Pull packages and modules together, being mainly a build environment framework. (Spin.js is a large part of this)
2. Reduce its knowledge of the application

The enablement of external modules can be done with the connector-js library and the type-enforcing Feature Subclass.
(See the [Connector Experiments](https://github.com/sysgears/apollo-universal-starter-kit/pull/645) PR )

### Development of external modules

There are two main methods for developing external modules.

1. Create and work from a `packages/<my-module>` directory. This will need a `package.json`
2. NPM link the module

The second option is more tedious and has some caveats, but will allow you to publish your module to NPM.

#### Second method

1. Create a folder for you module and run `yarn link`
2. In the root of this repository, run `yarn link <my-module>`

You should now be able to develop your module side-by-side with AUSK.

__Caveats__:

Issues with Babel and ES6 classes:

`yarn build` your module and reference the transpiled version. 
This will likely match the way you want your `package.json` for publishing to NPM.
