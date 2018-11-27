# GraphQL Server Scala

### Project structure

The current multi-module architecture of the GraphQL Server Scala implies each module as a separate SBT project that can depend on other modules.  

All the modules along with the **core** module reside on the top-level in the `modules` folder. Scala implementation of a module resides on a `server-scala` subfolder, e.g. `modules/user/server-scala`.

The **core** module contains the base essential code that can be used by other modules.

The **main** module resides on `packages/server-scala` folder and is intended to run all the modules as a single application.

### How to add a new module

To properly set up a new module, the following steps should be done:

1. Create an SBT project under the top-level `modules` folder in: `modules/module-name/server-scala`

2. In the **build.sbt** file of your module specify the identifier of your project(module):
```scala
lazy val module-name = project in file(".")
```
The name of the val is used as the module’s ID, which is used to refer to the module.

For example, in the **upload** module it looks like the following:
```scala
lazy val upload = project in file(".")
```

3. Your module can use a code from other modules. To do that, you should add a references to that modules and add a `dependsOn` method call.

For example, the **upload** module needs a code from the **core** module, so the configuration will look like the following:
```scala
lazy val upload = project in file(".") dependsOn(core % "test->test; compile->compile")

lazy val core = ProjectRef(base = file("../../core/server-scala"), id = "core")
```

Now code in the **upload** can use classes from the **core**. This also creates an ordering between the projects when compiling them: the **core** will be updated and compiled before the **upload** will be compiled.

`compile->compile` means that the compile configuration in the **upload** depends on the compile configuration in the **core**.

`test->test` means the same but in terms of test configurations, so it allows you to put utility code for testing in `core/src/test/scala` and then use that code in `upload/src/test/scala`, for example.

4. If your module needs some additional library dependency, you can add it as usual:
```scala
libraryDependencies ++= Seq(
  "commons-io" % "commons-io" % "2.6"
)
```

5. To make your module a part of the whole GraphQL Server Scala application, you should go to the **build.sbt** in the **main** module, create a reference to your module and add it to the `dependsOn` and `aggregate` functions: 
```scala
lazy val main = project in file(".") dependsOn(upload, user) aggregate(upload, user)

lazy val upload = ProjectRef(base = file("../../modules/upload/server-scala"), id = "upload")

lazy val user = ProjectRef(base = file("../../modules/user/server-scala"), id = "user")
```

Aggregation means that running a task on the aggregate project will also run it on the aggregated projects.

In the above example, the **main** module aggregates the **upload** and **user** modules.
If you start up sbt in the **main** module and execute the `test` task, you should see that tests are being run in all three modules.

6. Add a path to your module (relative to the **main** module) in `application.conf` in the **main**:
```scala
loadPaths = [
  "../../modules/upload/server-scala",
  "../../modules/user/server-scala"
]
```

7. In test resources of your module create `application.conf` and add the same path to your module as you did in the previous step: 
```scala
loadPaths = ["../../modules/upload/server-scala"]
```

That should be enough to integrate your module with the GraphQL Server Scala application. Steps 6,7 are needed due to dynamic class loading. This process will be optimized soon to get rid of the last two steps, so paths to modules will be kept in one place only.