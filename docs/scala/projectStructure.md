# Structure of the Scala Application

The Scala application is part of the Apollo Universal Starter Kit project, and so it follows the general approach to 
structuring the application. In the sections below, you can learn more about the Scala application structure.

## Scala application directories structure

The current multi-module architecture of the Scala back-end application stores each server module written in Scala as a 
separate sbt project under `modules/{module-name}/server-scala` directories.

Most sub-directories under `modules` contain a directory `server-scala` with the Scala implementation. For example, 
Apollo Universal Starter Kit contains the Core module, and the Scala implementation of Core is stored under 
`modules/core/server-scala`.

```
Scala application files and folders
├── docs                                  
│   └── scala                             # Scala application documentation
│       ├── gettingStarted.md             # How to run Scala application 
│       ├── projectStructure.md           # The document you're reading now
│       └── creatingModules.md            # Tips on how to create custom Scala modules
├── modules                               # Scala modules
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
└── packages                              # Scala source code
    └── server-scala                      # The global Scala module
        ├── project                       # Configuration files for sbt
        ├── src                           # Scala code
        │   └── main
        │       ├── resources
        │       │   └── application.conf  # Application properties
        │       │
        │       └── scala
        │           └── Main.scala        # Scala applicaiton entry point
        ├── target                        # Compiled files
        ├── .gitignore                    # Files and folders ignored by Git
        └── build.sbt                     # Scala application build definition
```

## Scala Modules

Currently, the Scala application comes with the following modules:

* **Contact**. Handles the messages sent via the Contact Us form
* **Core**. Contains the common code to be used by other Scala modules
* **Counter**. Contains the example for storing state on the server
* **Mailer**. Handles the mailing functionality
* **Pagination**. Implements pagination on the server
* **Upload**. Handles files uploaded to the Scala server from the client
* **User**. Handles user authentication and authorization

If you need to create a new Scala module, consult the following guide:

* [Creating Modules]

## Global Scala module

The global Scala module is located in the `packages/server-scala` directory and it runs all the Scala modules stored in 
`modules/{module-name}/server-scala` directories as a single Scala application. You need to run the Scala application 
from the global module. Consult the [Getting Started] guide for more information on running Scala with Apollo Universal 
Starter Kit.

[creating modules]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/docs/scala/creatingModules.md
[getting started]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/docs/scala/gettingStarted.md