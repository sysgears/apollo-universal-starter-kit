# Importing Modules with Apollo Universal Starter Kit

In this guide, we explain how you can import modules with Apollo Universal Starter Kit.

## Table of Contents

* [Importing Files](#importing-custom-modules)
* [Importing Assets](#importing-assets)
* [Installing and Importing Dependencies](#installing-and-importing-dependencies)

## Importing Custom Modules

Apollo Universal Starter Kit is a Yarn Workspaces project. You can read about workspaces in the [Yarn documentation]. 
For now, we focus on how to import modules in our starter kit.

We recommend using **absolute imports** rather than relative paths. For example, in `styles.less` (located in your 
custom module) you need to import the basic styles from another module the following way:

```less
@import '~@gqlapp/look-client-react/ui-antd/styles/index.less';
```

## Importing Assets

Apollo Universal Starter Kit is a webpack-based project, so it follows the general approach to importing assets &mdash; 
[webpack dependency management]. You can look up the module `modules/favicon` to see how assets are imported. 

As you can see in the code sample below, the project imports all the assets from the `modules/favicon/common/assets`
folder:

```js
// modules/favicon/common/index.js
// Favicon.ico should not be hashed, since some browsers expect it to be exactly on /favicon.ico URL
require('!file-loader?name=[name].[ext]!./assets/favicon.ico'); // eslint-disable-line

// Require all files from assets dir recursively adding them into assets.json
let req = require.context('!file-loader?name=[hash].[ext]!./assets', true, /.*/);
req.keys().map(req);
```

## Installing and Importing Dependencies

When installing dependencies for Apollo Universal Starter Kit, **use Yarn**. Once you have a dependency installed, you 
can use it by importing necessary classes or components with ES6 `import`.

[yarn documentation]: https://yarnpkg.com/lang/en/docs/workspaces/
[webpack dependency management]: https://webpack.js.org/guides/dependency-management/
