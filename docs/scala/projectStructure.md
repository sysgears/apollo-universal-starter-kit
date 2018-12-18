# Structure of the Scala Starter Kit

## Scala Starter Kit Project Structure

```
Scala Starter Kit
├── docs                                  
│   └── scala                             # Scala Starter Kit documentation
│       ├── gettingStarted.md             # How to start with Scala Starter Kit
│       ├── projectStructure.md           # The document you're reading now
│       └── creatingModules.md            # Tips on how to create custom Scala modules
├── modules                               # Scala Starter Kit modules
│   ├── contact
│   │   └── server-scala   
│   ├── core
│   │   └── server-scala
│   ├── counter
│   │   └── server-scala
│   ├── mailer
│   │   └── server-scala
│   ├── pagination
│   │   └── server-scala
│   ├── upload
│   │   └── server-scala
│   └── user
│       └── server-scala
└── packages                              # Scala Starter Kit source code
    └── server-scala                      # The global Scala module
        ├── project                       # Scala Starter Kit configuration files for sbt
        ├── src                           # Scala code
        │   └── main
        │       ├── resources
        │       │   └── application.conf  # Application properties
        │       │
        │       └── scala
        │           └── Main.scala        # Scala Starter Kit entry point
        ├── target                        # Compiled files
        ├── .gitignore                    # Files and folders ignored by Git
        └── build.sbt                     # Scala Starter Kit build definition
```

## Scala Starter Kit Modules

The current multi-module architecture of the Scala Starter Kit stores each server module written in Scala as a separate 
sbt project. All the implemented Scala Starter Kit modules are located under the `modules` directory in the root of the 
Apollo Universal Starter Kit project. 

Most sub-directories under `modules` contain a directory `server-scala` with the Scala implementation of a module. For 
example, the Core module contains all the code under `modules/core/server-scala`; similarly, Scala modules 
Contact, Counter, Pagination, and others are located in the respective `server-scala` directories.

Currently, Scala Starter Kit provides the following modules:

* **Contact**. Handles the messages sent via the Contact Us form
* **Core**. Contains the common code to be used by all other Scala modules
* **Counter**. Contains the example for storing state on the server
* **Mailer**. Handles the mailing functionality
* **Pagination**. Implements pagination on the server
* **Upload**. Handles files uploaded to the server from the client
* **User**. Handles user authentication and authorization

If you need to create a new Scala module, consult the following guide:

* [Creating Modules]

## Core module

Scala Starter Kit contains the Core module under the `modules/core/server-scala` folder with the .

## Global module

The global module is located in the `packages/server-scala` directory and it runs all the Scala modules stored in 
`modules/module-name/server-scala` as a single Scala application. You need to run the Scala Starter Kit project from the 
global module.

[creating modules]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/docs/scala/creatingModules.md