# Writing code for Your Scala Starter Kit Project

## How to add a new module

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

3. Your module may use a code from other modules. To allow that, you should add references to that modules.

For example, the **upload** module needs a code from the **core** module, so the configuration will look like the following:
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

Now code in the **upload** can use classes from the **core**. This also creates an ordering between the projects when compiling them: the **core** will be updated and compiled before the **upload** will be compiled.

`compile->compile` means that the compile configuration in the **upload** depends on the compile configuration in the **core**.

`test->test` means the same but in terms of test configurations, so it allows you to put utility code for testing in `core/src/test/scala` and then use that code in `upload/src/test/scala`, for example.

Note, that we have used a 'buildinfo' sbt plugin above to generate a ModulesInfo.scala file in compile time. This class stores a list of paths to connected modules.
Thus, the **global** module will have an access to these modules paths, so it can recursively find and load classes from all the connected modules tree.
To make this code working, add the 'buildinfo' plugin to `project/plugin.sbt`: 

```sbt
addSbtPlugin("com.eed3si9n" % "sbt-buildinfo" % "0.7.0")
```

4. If your module needs some additional library dependency, you can add it as usual:
```scala
libraryDependencies ++= Seq(
  "commons-io" % "commons-io" % "2.6"
)
```

5. To make your module a part of the whole Server Scala application, you should go to the **build.sbt** in the **global** module and add a reference to your module: 
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
  ProjectRef(base = file("../../modules/user/server-scala"), id = "user")
)
```

Aggregation means that running a task on the aggregate project will also run it on the aggregated projects.

In the above example, the **global** module aggregates the **upload** and **user** modules.
If you start up SBT in the **global** module and execute the `test` task, you should see that tests are being run in all three modules.

6. In test resources of your module create `application.conf` and add a path to your module (relative to the **global** module):
```scala
loadPaths = ["../../modules/upload/server-scala"]
```

That should be enough to integrate your module with the Server Scala application.
The last step is needed due to dynamic class loading. This process will be optimized soon to get rid of the last step, so paths to modules will be kept in one place only.