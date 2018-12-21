
lazy val authentication = project in file(".") dependsOn(modules.map(_ % "test->test; compile->compile"): _*)

lazy val modules = List(
  ProjectRef(base = file("../../core/server-scala"), id = "core"),
  ProjectRef(base = file("../../user/server-scala"), id = "user")
)

parallelExecution in test := false