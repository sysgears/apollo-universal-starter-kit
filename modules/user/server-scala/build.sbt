
lazy val user = (project in file(".") dependsOn(modules.map(ClasspathDependency(_, None)).map(elem => elem.project % "test->test; compile->compile"): _*) aggregate (modules: _*))
  .enablePlugins(BuildInfoPlugin)
  .settings(
    buildInfoKeys := Seq[BuildInfoKey]("modules" -> modules.map(projectRef => projectRef.build)),
    buildInfoPackage := "userSubModules",
    buildInfoObject := "ModulesInfo"
  )

lazy val modules = List(
  ProjectRef(base = file("../../core/server-scala"), id = "core"),
  ProjectRef(base = file("../../mailer/server-scala"), id = "mailer")
)

parallelExecution in test := false