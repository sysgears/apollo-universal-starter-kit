import org.ensime.EnsimeKeys._

addCompilerPlugin("org.psywerx.hairyfotr" %% "linter" % "0.1.17")

lazy val core = project in file(".") dependsOn (modules.map(_ % "test->test; compile->compile"): _*)

lazy val modules = List(
  ProjectRef(base = file("../../module/server-scala"), id = "module")
)

ensimeIgnoreMissingDirectories := true
ensimeScalaVersion in ThisBuild := scalaVersion.value

parallelExecution in test := false
scalafmtOnCompile := true
scalafmtConfig := Some(file("../../.scalafmt.conf"))