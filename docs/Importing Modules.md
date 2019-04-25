# Importing Modules with Apollo Universal Starter Kit

In this guide, we explain how you can import modules with Apollo Universal Starter Kit.

## Table of Contents

* [Importing Files](#importing-custom-modules)
* [Importing Assets](#importing-assets)
* [Installing and Importing Dependencies](#installing-and-importing-new-dependencies)

## Importing Custom Modules

When you work on a custom module and need to import a file from another module, you can use relative or absolute paths.

The key idea is that **the relative paths in Apollo Universal Starter Kit are not resolved from the `modules` 
directory**. In fact, they're resolved relative to the `node_modules/@gqlapp` directory.

The diagram below explains better how it works:

```
apollo-universal-starter-kit
├── node_modules                        # Global Node.js modules
    ├── @gqlapp                         # Compiled files
        ├── custom-module-client-react  # Custom module
            ├── styles.less             # Actual relative path to styles.less
        ├── look-client-react           # Compiled module "look"
            └── ui-antd                 # Default Ant Design styles
                └── styles
                    └── index.less      # Actual relative path to "index.less"
├── modules                             # Apollo Universal Starter Kit modules
    ├── custom-module                   # Your custom React module
        ├── client-react
            ├── styles.less             # The file that needs to import "index.less"
    ├── look                            # Node.js and Express server
        └── client-react                # React client implementation
            └── ui-antd                 # Default Ant Design styles
                └── styles
                    └── index.less      # The file to be imported to "styles.less"
```

As you can see from the diagram, the actual paths to files are changed this way:

* `modules/look/client-react/ui-antd/styles/index.less` => `@gqlapp/look-client-react/ui-antd/styles/index.less`
* `modules/custom-module/client-react/styles.less` => `@gqlapp/custom-module-client-react/styles.less` 

Therefore, if a `styles.less` file inside `custom-module` needs to import `index.less` file from 
`look/client-react/ui-antd/styles`, the correct relative path would be this:

```less
// inside modules/custom-module/client-react/styles.less
// The real relative path to "styles.less" is different:
// node_modules/@gqlapp/custom-module-client-react/styles.less
// The real relative path to "index.less" is this:
// node_modules/@gqlapp/look-client-react/ui-antd/styles/index.less
@import '../look-client-react/ui-antd/styles/index.less';
```

To import the basic styles, we recommend using **absolute imports** rather than relative links. Therefore, in your 
`styles.less` you need to import the basic styles the following way:

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

## Installing and Importing New Dependencies

When installing dependencies for Apollo Universal Starter Kit, use Yarn. Once you have a dependency installed, you can 
use the standard way to import necessary classes or components from a dependency &mdash; the ES6 `import` statements.

[webpack dependency management]: https://webpack.js.org/guides/dependency-management/
