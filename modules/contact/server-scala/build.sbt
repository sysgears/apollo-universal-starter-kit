
lazy val contact = (project in file(".") dependsOn(modules.map(ClasspathDependency(_, None)): _*) aggregate (modules: _*))
  .enablePlugins(BuildInfoPlugin)
  .settings(
    buildInfoKeys := Seq[BuildInfoKey]("modules" -> modules.map(projectRef => projectRef.build)),
    buildInfoPackage := s"contactSubModules",
    buildInfoObject := "ModulesInfo"
  )

lazy val modules = List(
  ProjectRef(base = file("../../core/server-scala"), id = "core"),
  ProjectRef(base = file("../../mailer/server-scala"), id = "mailer")
)

parallelExecution in test := false