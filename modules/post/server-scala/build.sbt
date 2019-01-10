
addCompilerPlugin("org.psywerx.hairyfotr" %% "linter" % "0.1.17")

lazy val post = project in file(".") dependsOn (modules.map(_ % "test->test; compile->compile"): _*)

lazy val modules = List(
  ProjectRef(base = file("../../core/server-scala"), id = "core"),
  ProjectRef(base = file("../../pagination/server-scala"), id = "pagination")
)

parallelExecution in test := false
scalafmtOnCompile := true
scalafmtConfig := Some(file("../../.scalafmt.conf"))