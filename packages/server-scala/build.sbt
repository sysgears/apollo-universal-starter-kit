name := "global"

version := "0.1"

scalaVersion := "2.12.7"

lazy val global = (project in file(".") dependsOn(modules.map(moduleRef => moduleRef % "test->test; compile->compile"): _*) aggregate (modules: _*))
  .enablePlugins(BuildInfoPlugin)
  .settings(
    buildInfoKeys := Seq[BuildInfoKey]("modules" -> modules.map(moduleRef => moduleRef.build)),
    buildInfoPackage := "modulesinfo",
    buildInfoObject := "ModulesInfo"
  )

lazy val modules = List(
  ProjectRef(base = file("../../modules/upload/server-scala"), id = "upload"),
  ProjectRef(base = file("../../modules/user/server-scala"), id = "user"),
  ProjectRef(base = file("../../modules/counter/server-scala"), id = "counter"),
  ProjectRef(base = file("../../modules/contact/server-scala"), id = "contact"),
  ProjectRef(base = file("../../modules/pagination/server-scala"), id = "pagination")
)