# Structure of the Scala Starter Kit

The current multi-module architecture of the Scala Starter Kit stores each server module written in Scala as a separate 
SBT project, which may depend on other modules. 

All the starter kit modules are located under the `modules` directory: `contact`, `core`, `pagination`, and so on. Each 
such directory has a sub-directory `server-scala` with the Scala implementation of a module (next to the TypeScript 
server or client implementation of the module).

### Core module

Scala Starter Kit contains the **core** module with the common code to be used by other Scala modules.

### Global module

The **global** module is located in the `packages/server-scala` directory and it runs all the modules stored in `modules`
as a single Scala application.