# Apollo Universal Starter Kit Structure

In this guide, we walk you through the key aspects of Apollo Universal Starter Kit structure.

## Table of Contents

* [Apollo Universal Starter Kit Packages](#apollo-universal-starter-kit-packages)
* [Apollo Universal Starter Kit Modules](#apollo-universal-starter-kit-modules)

## Apollo Universal Starter Kit Packages

The `packages` folder contains all the currently existing packages in Apollo Universal Starter Kit:

```
packages
├── client                # The React application core
├── client-angular        # The Angular application core
├── client-vue            # The Vue application core
├── common                # Common implementation for the client and server modules
├── mobile                # The React Native main module
├── server                # The Express server module
└── server-scala          # The Scala server module
```

The listed packages don't implement any functionality. Instead, they only import all the modules from the global folder 
`apollo-universal-starter-kit/modules`. 

For example, when you create your own module for the React client application, you need to import it into 
`packages/client/src/modules.ts`. Also, you need to pass the imported module to the `ClientModule` class as an argument:

```typescript jsx
// packages/client/src/modules.ts
import core from '@gqlapp/core-client-react';
// Other modules
import myModule from '@gqlapp/my-module';

const modules = new ClientModule(
  core,
  myModule
);

export default modules;
```

Similarly, the Express, Vue, and Angular applications all have the `src/modules.ts` files where you need to import the
specific modules from `modules`. See the following files:

* `packages/client-angular/src/modules.ts`
* `packages/client-vue/src/modules.ts`
* `packages/server/src/modules.ts`

Concerning the Scala application, you can find the imported modules in `packages/server-scala/src/main/scala/Main.scala`.

## Apollo Universal Starter Kit Modules

The `modules` directory contains all the global starter kit modules such as Core, Authentication, Contact, i18n, 
Reports, Payments, PageNotFound, and others. Most of them contain various implementations for specific technologies. 

The module structure generally looks like this (some folder may not exist if there's no implementation for a specific 
technology):

```
modules
├── some-module                # The module SomeModule root folder
    ├── client-angular         # Angular implementation
    ├── client-react           # React implementation
    ├── client-vue             # Vue implementation
    ├── common                 # Common implementation for the client and server modules
    ├── server-scala           # Scala server module
    └── server-ts              # Node.js and TypeScript server module
```

Each module has a specific implementation you want to develop. For example, if you're creating a new custom module for
Express, you need to create a server implementation under the `modules/{your-module}/server-ts` or 
`modules/{your-module}/server-js` folder depending on the programming language you're going to use. 

Similarly, when creating a new client module for the React application, you need to create a new folder 
`modules/{your-module}/client-react` to store the module implementation.
