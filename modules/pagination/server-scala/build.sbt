libraryDependencies ++= Seq(
  "commons-io" % "commons-io" % "2.6"
)

addCompilerPlugin("org.psywerx.hairyfotr" %% "linter" % "0.1.17")

lazy val pagination = project in file(".") dependsOn (modules.map(_ % "test->test; compile->compile"): _*)

lazy val modules = List(
  ProjectRef(base = file("../../core/server-scala"), id = "core")
)

parallelExecution in test := false
scalafmtOnCompile := true
scalafmtConfig := Some(file("../../.scalafmt.conf"))