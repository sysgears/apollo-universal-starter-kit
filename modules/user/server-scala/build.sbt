addCompilerPlugin("org.psywerx.hairyfotr" %% "linter" % "0.1.17")

lazy val user = project in file(".") dependsOn (modules.map(_ % "test->test; compile->compile"): _*)
lazy val modules = List(
  ProjectRef(base = file("../../core/server-scala"), id = "core"),
  ProjectRef(base = file("../../mailer/server-scala"), id = "mailer"),
  ProjectRef(base = file("../../authentication/server-scala"), id = "authentication")
)

parallelExecution in test := false
scalafmtOnCompile := true
scalafmtConfig := Some(file("../../.scalafmt.conf"))