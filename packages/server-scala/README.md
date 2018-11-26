##Scala implementation of the Kit

###Project structure

The current multi-module architecture of the Scala implementation of the Kit implies each module as a separate SBT project that can depend on another module.  

All the custom modules along with the **core** module resides on the top-level in the `modules` folder. Scala implementation of a module resides on a `server-scala` subfolder, e.g. `modules/user/server-scala`.

The **core** module is intended to store the base essential code that is used by other custom modules.

The **main** module resides on `packages/server-scala` folder and is intended to run all the modules as a single application.  

###How to add a new module

To properly set up a new module, the following steps should be done:

1. Create SBT project under the top-level `modules` folder in: `modules/module-name/server-scala`

2. In the **build.sbt** file of your module specify the identifier of your project:
```
lazy val module-name = project in file(".")
```
For example, in 'upload' module it looks like the following:
```
lazy val upload = project in file(".")
```

3. If your module needs a code from the **core** module, you should add a reference to the **core** and add a `dependsOn` method call:
```
lazy val upload = project in file(".") dependsOn(core % "test->test; compile->compile")

lazy val core = ProjectRef(base = file("../../core/server-scala"), id = "core")
```

Now code in the **upload** can use classes from the **core**. This also creates an ordering between the projects when compiling them: **core** must be updated and compiled before **upload** can be compiled.
 `compile->compile` means that the compile configuration in **upload** depends on the compile configuration in the **core**.
`test->test` means the same but in terms of test configurations. This allows you to put utility code for testing in `core/src/test/scala` and then use that code in `upload/src/test/scala`, for example.

4. If your module needs some additional dependency, you can add it as usual:
```
libraryDependencies ++= Seq(
  "commons-io" % "commons-io" % "2.6"
)
```

5. To make your module part of the whole Scala Kit application, you should go to the **build.sbt** in the **main** module, create a reference to your module and add it to the `dependsOn` and `aggregate` functions: 
```
lazy val main = project in file(".") dependsOn(upload, user) aggregate(upload, user)

lazy val upload = ProjectRef(base = file("../../modules/upload/server-scala"), id = "upload")

lazy val user = ProjectRef(base = file("../../modules/user/server-scala"), id = "user")
```

Aggregation means that running a task on the aggregate project will also run it on the aggregated projects. In the above example, if you start up your **main** sbt project and execute the `compile` task, you should see that all three projects are compiled.

6. Add a path to your module (relative to the **main** module) in `application.conf` in **main**:
```
loadPaths = [
  "../../modules/upload/server-scala",
  "../../modules/user/server-scala"
]
```

7. In test resources in your module create `application.conf` and add the same path to your module as you did in the previous step: 
```
loadPaths = ["../../modules/upload/server-scala"]
```

That should be enough to integrate your module with the Scala Kit. Steps 6,7 are needed due to dynamic class loading. This process will be optimized soon to get rid of the last two steps, so paths to modules will be kept in one place only.