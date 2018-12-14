
lazy val user = (project in file(".") dependsOn(modules.map(moduleRef => moduleRef % "test->test; compile->compile"): _*))
  .enablePlugins(BuildInfoPlugin)
  .settings(
    buildInfoKeys := Seq[BuildInfoKey]("modules" -> modules.map(moduleRef => moduleRef.build)),
    buildInfoPackage := "userSubModules",
    buildInfoObject := "ModulesInfo"
  )

lazy val modules = List(
  ProjectRef(base = file("../../core/server-scala"), id = "core"),
  ProjectRef(base = file("../../mailer/server-scala"), id = "mailer")
)

parallelExecution in test := false