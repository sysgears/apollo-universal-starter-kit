# Apollo Universal Starter Kit CLI

We encourage you to modularize your Apollo Universal Starter Kit-based applications. It's best to design each 
application feature as a decoupled module to make sure that deleting a feature won't affect the application. 

To help you create and delete new modules, the starter kit comes with a custom Command Line Interface (CLI).

You can view the help guide on using the CLI with by running:

```bash
yarn cli
```

In the command line, you'll see how to use the CLI, the available commands, and the optional parameters (flags), which 
you can pass to the commands:

```bash
yarn cli

$ node tools/cli

   cli 1.0.0 - Full info: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Apollo-Starter-Kit-CLI

   USAGE

     cli <command> [options]

   COMMANDS

     addmodule <moduleName> [location]         Create a new Module.               
     deletemodule <moduleName> [location]      Delete a Module                    
     help <command>                            Display help for a specific command

   GLOBAL OPTIONS

     -h, --help         Display help                                      
     -V, --version      Display version                                   
     --no-color         Disable colors                                    
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages    

Done in 9.89s.
```

## Scaffolding Application Features with the Custom CLI

### Basic Scaffolding of an Application Feature

You can scaffold a feature module using the following command:

```bash
yarn cli addmodule SuperFeature
```

The `addmodule` command will create all the files for a new feature module `MyFirstModule` for both the client and the 
server applications and will generate the following output:

```bash
# The output
yarn run v1.9.4
$ node tools/cli addmodule SuperFeature
Copying client files…
✔ The client files have been copied!
✔ Module for client successfully created!
Copying server files…
✔ The server files have been copied!
✔ Module for server successfully created!
Done in 11.15s.
```

The CLI will generate the following files for the server feature under `packages/server/src/modules/SuperFeature/`:

```
SuperFeature
├── __tests__
    └── SuperFeature.spec.ts     # a simple test
├── index.ts                     # a basic file with imported schema, resolvers, and global Feature
├── resolvers.ts                 # a GraphQL resolver
├── schema.graphql               # a GraphQL schema
└── sql.ts                       # a Knex connector
```

The CLI will generate the following files for the client package under `packages/client/src/modules/SuperFeature/`:

```
SuperFeature in packages/client/src/modules/SuperFeature/
├── __tests__
    └── SuperFeature.spec.ts            # a simple test
├── components                          # basic components for the React Native app and for web app
    ├── SuperFeatureView.native.tsx     # a basic React Native View component
    └── SuperFeatureView.tsx            # a basic web application View component
├── containers                          # stores containers for the SuperFeature
    └── SuperFeature.tsx                # a basic container for SuperFetureView component
├── graphql                             # stores GraphQL queris
    └── SuperFeatureQuery.graphql       # a basic GraphQL query for SuperFeature
├── locales                             # default localizations
    ├── en                              # English localization
        └── translations.json           # JSON with English translations
    └── ru                              # Russian localization
        └── translations.json           # JSON with Russian translations
    └── index.js                        # a utility JavaScript file    
├── index.native.tsx                    # a default React Native app file
└── index.tsx                           # a default web application file
```

#### Passing an Optional Parameter to `addmodule`

You can pass an optional parameter to the `addmodule` command. If you want to generate only a client-side or only a 
server-side module, pass the parameter `client` or `server` respectively when running the command.   

For example, the following command will generate only a client-side module `UserProfile`:

```bash
yarn cli addmodule UserProfile client
```

Similarly, you can generate only a server-side module with `yarn cli addmodule UserProfile server`.

### Deleting an Existing Module

If you need to delete an existing module, run:

```bash
yarn cli deletemodule <moduleName> <parameter>
```

You'll see the following confirmation in the command line:

```bash
yarn run v1.9.4
$ node tools/cli deletemodule SuperFeature
Deleting client files…
✔ Module for client successfully deleted!
Deleting server files…
✔ Module for server successfully deleted!
Done in 3.89s.
```

Similarly to running the `addmodule` command, you can run `deletemodule` with the `client` or `server` parameter to 
delete only the client-side or the server-side module respectively.

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