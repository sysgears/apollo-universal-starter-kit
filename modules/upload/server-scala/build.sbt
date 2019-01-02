libraryDependencies ++= Seq(
  "commons-io" % "commons-io" % "2.6"
)

lazy val upload = project in file(".") dependsOn (modules.map(_ % "test->test; compile->compile"): _*)

lazy val modules = List(
  ProjectRef(base = file("../../core/server-scala"), id = "core")
)

parallelExecution in test := false