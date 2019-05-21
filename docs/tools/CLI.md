# Apollo Universal Starter Kit CLI

We encourage you to modularize your Apollo Universal Starter Kit-based applications. It's best to design each
application module as a decoupled chunk of functionality to make sure that deleting this module won't affect the other 
parts of the application.

To help you create and delete new application modules, the starter kit comes with a custom Command Line Interface (CLI).

## Table of Contents

* [First Use of the CLI](#first-use-of-the-cli)
* [Choosing Technology Stacks with `choosestack`](#choosing-technology-stacks-with-choosestack)
* [Basic Scaffolding with `addmodule`](#basic-scaffolding-with-addmodule)
* [Deleting Features with `deletemodule`](#deleting-features-with-deletemodule)
* [Creating CRUD Modules with `addcrud`](#creating-crud-modules-with-addcrud)
    * [Using Optional Parameters with CLI Commands](#using-optional-parameters-with-cli-commands)
* [Running CLI with Options (Flags)](#running-cli-with-options-flags)

## First Use of the CLI

**NOTE**: Before you can use the CLI, install all the dependencies by running `yarn` in the root!

You can view the help guide on using the CLI by running the command below:

```bash
yarn cli
```

In the command line, you'll see how to use the CLI, the available commands, and the optional parameters, which you can
pass to the commands:

```bash
yarn cli

$ node tools/cli

   cli 1.0.0 - Full info: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Apollo-Starter-Kit-CLI

   USAGE

     cli <command> [options]

   COMMANDS

     addmodule <moduleName> [location]                  Create a new Module.
     deletemodule <moduleName> [location]               Delete a Module
     help <command>                                     Display help for a specific command

   GLOBAL OPTIONS

     -h, --help         Display help                                      
     -V, --version      Display version                                   
     --no-color         Disable colors                                    
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages    

Done in 0.94s.
```

## Choosing Technology Stacks with `choosestack`

Apollo Universal Starter Kit has a few different stacks allowing you to choose the best technologies for your concrete
project. When you clone the starter kit with Git, you can remove the unnecessary stacks.
 
You can use the CLI to choose the stacks you want to keep; all others will be removed completely. 

**NOTE**: If you've just cloned the starter kit, remember to first install the dependencies by running the command 
`yarn`. Otherwise, you'll see an error when using the CLI to remove the unnecessary packages.

**NOTE**: If you wipe out a stack, you can't restore it! 

Run the following command from the root of the project:

```bash
yarn cli choosestack
```

You'll see a list of options. Navigate between the stacks using the arrow keys and select the stack(s) **that you want 
to keep** by pressing Space:

```bash
Choose your technology stack or stacks. Press <Space> to select a stack, <A> to toggle all, or <I> to invert the selection.
- react & react native
- angular
- vue
- node
- scala
```

Once you selected all the stacks you want to keep, press Enter. The console will show a confirmation.

For example, you'll see the following confirmation in the command line provided that you selected `angular` and `node` 
from the list:

```bash
? Choose your technology stack or stacks angular, node
Done in 342.02s.
```

Your project will have the folders `packages/client-angular` and `packages/server`. Also, only the Angular 
(`client-angular`) and Node.js (`server-ts`) modules under `modules/{module}` will be kept. All other packages and 
modules will be fully removed and nonrecoverable.

## Basic Scaffolding with `addmodule`

You can generate a feature module using the following command:

```bash
yarn cli addmodule Order
```

The `addmodule` command will create all the files for a new application module `Order` for both the client and the
server applications. Note that `addmodule` (unlike [`addcrud`](#creating-crud-modules-with-addcrud)) only creates
_empty files without the actual implementation_ of the CREATE, READ, UPDATE, and DELETE (CRUD) functionality.

You can consider a module generated with `addmodule` as an empty template without any functionality.

You'll see the following output after the generation of the module is completed:

```bash
# The output
yarn run v1.9.4
$ node tools/cli addmodule Order
Copying client files…
✔ The client files have been copied!
✔ Module for client successfully created!
Copying server files…
✔ The server files have been copied!
✔ Module for server successfully created!
Done in 11.15s.
```

The CLI will generate the following files for the server under the directory `packages/server/src/modules/Order/`:

```
packages/server/src/modules/Order/
├── __tests__
    └── Order.spec.ts              # a simple test
├── index.ts                       # a basic file with imported schema, resolvers, and global Feature
├── resolvers.ts                   # GraphQL resolvers
├── schema.graphql                 # a GraphQL schema
└── sql.ts                         # a Knex connector
```

The CLI will generate the following files for the client under the directory `packages/client/src/modules/Order/`:

```
packages/client/src/modules/Order/
├── __tests__
    └── Order.spec.ts                    # a simple test
├── components                           # basic components for the React Native app and for web app
    ├── OrderView.native.tsx             # a basic React Native View component
    └── OrderView.tsx                    # a basic web application View component
├── containers                           # stores containers for the Order
    └── Order.tsx                        # a basic container for OrderView component
├── graphql                              # stores GraphQL queris
    └── OrderQuery.graphql               # a basic GraphQL query for Order
├── locales                              # default localizations
    ├── en                               # English localization
        └── translations.json            # JSON with English translations
    └── ru                               # Russian localization
        └── translations.json            # JSON with Russian translations
    └── index.js                         # a utility JavaScript file    
├── index.native.tsx                     # a default React Native app file
└── index.tsx                            # a default web application file
```

The generated module is also imported into the `packages/server/src/modules/index.ts` file.

## Deleting Features with `deletemodule`

If you need to delete an existing module, run:

```bash
yarn cli deletemodule <moduleName>
```

You'll see the following confirmation in the command line:

```bash
yarn run v1.9.4
$ node tools/cli deletemodule Order
Deleting client files…
✔ Module for client successfully deleted!
Deleting server files…
✔ Module for server successfully deleted!
Done in 3.89s.
```

You can use this command to delete any standard module that Apollo Universal Starter Kit comes with.

## Creating CRUD Modules with `addcrud`

**NOTE**: The `addcrud` command is only available in the [cli-crud] branch. The master branch doesn't have this command!

The `addcrud` command is similar to [`addmodule`](#basic-scaffolding-with-addmodule) in that it also generates the
application modules. But the key difference between the two commands is that `addcrud` generates the server modules that 
you can use immediately by sending GraphQL queries, whereas `addmodule` creates _empty module templates_, and 
you still have to manually write all the queries, mutations, and schemas.

`addcrud` does the following:

* It generates the application module with the following key files:
  * `schema.graphql`, provides a description for GraphQL types, fields, and operations to perform on the created module
  * `schema.ts`, implements the [Domain Schema] pattern for enterprise applications
  * `resolvers.ts`, contains GraphQL queries to perform CRUD operations
  * `sql.ts`, provides the functions to access the database
* It creates the migrations (adds new tables) and seeds (adds the sample data) for the new entity you create

You can generate a new application module with `addcrud` using the following command:

```bash
yarn cli addcrud Order
```

The command line will show the following output:

```bash
$ node tools/cli addcrud Order
Copying server files…
✔ The server files have been copied!
Copying database files...
✔ The database files have been copied!
✔ Module for server successfully created!
Done in 1.86s.
```

`addcrud` creates new server modules with the following structure under `packages/server/src/modules/ModuleName`:

```
packages/server/src/modules/Order
├── __tests__
    └── Order.spec.ts           # a simple test
├── index.ts                    # creates a new server module with the schema, entity, and resolvers
├── resolvers.ts                # GraphQL resolvers
├── schema.graphql              # a GraphQL schema
├── schema.js                   # a Domain Schema entity
└── sql.ts                      # a Knex connector
```

The `addcrud` command also adds a migration and a seed in the `packages/server/src/database/migrations/` and 
`packages/server/src/database/seeds` directories respectively:

* `packages/server/src/database/migrations/1542808346607_ModuleName.js`
* `packages/server/src/database/seeds/1542808346607_ModuleName.js`

To test the modules generated with `addcrud`:

1. Run the Apollo Universal Starter Kit project with `yarn watch`
2. Follow to the [GraphiQL page]
3. Run your queries and mutations for the generated entity

### Using Optional Parameters with CLI Commands

You can pass an optional parameter to the `addmodule` and `deletemodule` commands (not to `addcrud`). If you want to
generate only a client-side or only a server-side module, pass the parameter `client` or `server` respectively when
running the command.

For example, the following command will generate the module `Carrot` only for the client-side React application:

```bash
yarn cli addmodule Carrot client
```

Similarly, you can generate only a server-side module with `yarn cli addmodule Carrot server`.

Using such options with `deletemodule` will delete the module on the client or server depending on what you passed as a
parameter.

## Running CLI with Options (Flags)

To see the CLI help, run one of the following commands:

```bash
yarn cli
yarn cli -h
yarn cli --help
```

To view the current CLI version, run `yarn cli` with capitalized `-V` or `--version` parameter:

```bash
yarn cli -V
yarn cli --version
```

The output generated by the CLI is colored by default. You can turn off the colors by running the CLI with `--no-color`:

```bash
yarn cli --no-color
```

To hide warnings and error messages when you're using the CLI, run the CLI with the `--quiet` option:

```bash
yarn cli --quiet
```

To view the debug messages when using the CLI, run `cli` with the lowercase `-v` or `--verbose` option:

```bash
yarn cli -v
yarn cli --verbose
```

[graphiql page]: http://localhost:3000/graphiql
[domain schema]: https://github.com/sysgears/domain-schema
