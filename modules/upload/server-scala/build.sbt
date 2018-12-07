
libraryDependencies ++= Seq(
  "commons-io" % "commons-io" % "2.6"
)

lazy val upload = (project in file(".") dependsOn(modules.map(ClasspathDependency(_, None)).map(elem => elem.project % "test->test; compile->compile"): _*) aggregate (modules: _*))
  .enablePlugins(BuildInfoPlugin)
  .settings(
    buildInfoKeys := Seq[BuildInfoKey]("modules" -> modules.map(projectRef => projectRef.build)),
    buildInfoPackage := s"uploadSubModules",
    buildInfoObject := "ModulesInfo"
  )

lazy val modules = List(
  ProjectRef(base = file("../../core/server-scala"), id = "core")
)

parallelExecution in test := false