name := "global"

version := "0.1"

scalaVersion := "2.12.7"

lazy val global = (project in file(".") dependsOn (modules.map(_ % "test->test; compile->compile"): _*) aggregate (modules: _*))
  .enablePlugins(DockerPlugin, JavaAppPackaging, AshScriptPlugin)

lazy val modules = List(
  ProjectRef(base = file("../../modules/upload/server-scala"), id = "upload"),
  ProjectRef(base = file("../../modules/user/server-scala"), id = "user"),
  ProjectRef(base = file("../../modules/counter/server-scala"), id = "counter"),
  ProjectRef(base = file("../../modules/contact/server-scala"), id = "contact"),
  ProjectRef(base = file("../../modules/pagination/server-scala"), id = "pagination"),
  ProjectRef(base = file("../../modules/authentication/server-scala"), id = "authentication")
)

resourceGenerators in Compile ++= Seq(
  ResourceProcessor.concatDotEnvsTask.taskValue,
  ResourceProcessor.concatServerConfigsTask.taskValue
)

packageName in Docker := "scala_server"
dockerBaseImage := "openjdk:jre-alpine"
dockerExposedPorts := Seq(8080)
defaultLinuxInstallLocation in Docker := "/usr/local"
dockerExposedVolumes := Seq("/usr/local", "/usr/local/target")

mainClass in Compile := Some("Main")