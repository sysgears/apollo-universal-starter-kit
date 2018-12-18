# Creating New Modules for Scala Starter Kit

In this guide, we explain how you can add custom Scala modules when developing your Scala Starter Kit project.

It's worth mentioning the two key Scala Starter Kit modules that you need to know about before reading the sections 
below:

* The **Core** module, located `modules/core/server-scala`; contains code that all other Scala modules need to use
* The **global** module, located in `packages/server-scala`. The entry module of Scala Starter Kit that gathers all 
other modules and runs them as one Scala application

Now you can follow the steps below to configure your Scala module for Scala Starter Kit.

## #1 Create a new sbt project 

1. Create the following directory structure for your Scala module under the `modules` directory (only use the real name
instead of `module-name`):

```
Apollo Universal Starter Kit
├── modules                          # Scala Starter Kit modules
    ├── module-name        
        └── server-scala
```
 
2. Generate an sbt project into `modules/module-name/server-scala`.

You can consult [sbt by example] for information how to generate a simple sbt project.

## #2 Configure the module's `build.sbt`

Specify the identifier for your module in the `modules/your-module/build.sbt` file:

```scala
lazy val module-name = project in file(".")
```

You need to replace `module-name` with the module ID to refer to the module. Here's what `build.sbt` in the existing 
Upload module looks like:

```scala
lazy val upload = project in file(".")
```

## #3 Configuring a module

All the custom Scala modules need to reference the Core module. Add a reference to Core in the `build.sbt` file of your 
module.

Have a look at how the existing Upload module uses code from Core (`modules/upload/server-scala/build.sbt`):

```scala
lazy val upload = (project in file(".") dependsOn(modules.map(_ % "test->test; compile->compile"): _*))
  .enablePlugins(BuildInfoPlugin)
  .settings(
    buildInfoKeys := Seq[BuildInfoKey]("modules" -> modules.map(_.build)),
    buildInfoPackage := s"uploadSubModules",
    buildInfoObject := "ModulesInfo"
  )

lazy val modules = List(
  ProjectRef(base = file("../../core/server-scala"), id = "core")
)
```

The Upload module has a reference to Core and, therefore, can use classes from Core. If you module needs to reuse code
from other modules, add another `ProjectRef()` with the path and id for those modules.

Note that with this approach, the projects are compiled in the specific order: the Core module will be updated and 
compiled _before_ the Upload module.

Also notice the first line `dependsOn(modules.map(_ % "test->test; compile->compile"): _*))`. The line specifies that 
the test and compile configurations for the Upload module depend on the test and compile configurations of Core. More 
specifically, using `test->test` enables you to put the utility code for testing in 
`modules/core/server-scala/src/test/scala` and then _reuse_ that code in `upload/server-scala/src/test/scala` if 
necessary. You should create your own modules the same way.

>**NOTE**: Because it's not possible to read the list of referenced modules in `build.sbt` from Scala code, we use the 
**sbt-buildinfo** plugin to get that modules list. sbt-buildinfo simply generates the `ModulesInfo.scala` file for each 
module at compile time. `ModulesInfo.scala` stores the list of paths to connected modules, which are specified in 
`build.sbt`. Thus, the global Scala module can access these paths to recursively find and load classes from all the 
connected modules. This approach makes it possible to use Dependency Injection in Scala Starter Kit.

All the custom Scala module need to enable sbt-buildinfo as shown in the previous code snippet &ndash; notice the line 
`.enablePlugins(BuildInfoPlugin)`.

Also, remember to add sbt-buildinfo to `modules/module-name/server-scala/project/plugin.sbt` in your module. For 
example, the Upload module stores the reference to sbt-buildinfo in `modules/upload/server-scala/project/plugin.sbt`: 

```sbt
addSbtPlugin("com.eed3si9n" % "sbt-buildinfo" % "0.7.0")
```

## #4 Add other dependencies 

You can add other dependencies to your Scala module the usual way:

```scala
libraryDependencies ++= Seq(
  "commons-io" % "commons-io" % "2.6"
)
```

## #5 Include Scala module in Scala Starter Kit
 
To include your module in the Server Scala Kit application, open `build.sbt` that's located in the global module 
&ndash; `packages/server-scala/build.sbt` &ndash; and add a reference to your module in the `modules` list (add another 
`ProjectRef()` with your module to the `List()`):

```scala
lazy val global = (project in file(".") dependsOn(modules.map(_ % "test->test; compile->compile"): _*) aggregate (modules: _*))
  .enablePlugins(BuildInfoPlugin)
  .settings(
    buildInfoKeys := Seq[BuildInfoKey]("modules" -> modules.map(_.build)),
    buildInfoPackage := "modulesinfo",
    buildInfoObject := "ModulesInfo"
  )

lazy val modules = List(
  ProjectRef(base = file("../../modules/upload/server-scala"), id = "upload"),
  ProjectRef(base = file("../../modules/user/server-scala"), id = "user"),
  ProjectRef(base = file("../../modules/module-name/server-scala", id = "module-name"))
)
```

In the example above, the global module aggregates the Upload, User, and ModuleName modules. Then, if you start sbt from 
the global Scala module and run the `test` task, you'll see that tests are executed in all four modules &ndash; global, 
Upload, User, and your custom module ModuleName.

To make possible the described functionality, the module configuration uses aggregation with `aggregate (modules: _*))`. 
You can read more about aggregation and multiple sub-projects in [sbt documentation]. 

6. Create the `application.conf` file under the `modules/module-name/server-scala/src/test/resources` directory and add 
the path to your module:

```scala
loadPaths = ["../../modules/module-name/server-scala"]
```

The path to your module must be set _relatively to the global module_ in `application.conf`. In other words, the path 
to your module is resolved from the global module:

```
├── modules
│   └── module-name
│       └── server-scala
└── packages
    └── server-scala           # The path gets resolved from this directory
``` 

This last step is only required for dynamic class loading. *We'll remove this step as soon as possible to optimize the 
configuration and ensure that all paths to modules are kept in one place.*

[sbt by example]: https://www.scala-sbt.org/1.x/docs/sbt-by-example.html
[sbt documentation]: https://www.scala-sbt.org/0.13/docs/Multi-Project.html#Multiple+subprojects