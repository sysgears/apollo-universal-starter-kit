name := "global"

version := "0.1"

scalaVersion := "2.12.7"

lazy val global = (project in file(".") dependsOn (modules.map(ClasspathDependency(_, None)): _*) aggregate (modules: _*))
  .enablePlugins(BuildInfoPlugin)
  .settings(
    buildInfoKeys := Seq[BuildInfoKey]("modules" -> modules.map(projectRef => projectRef.build)),
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