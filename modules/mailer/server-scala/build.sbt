
lazy val mailer = (project in file(".") dependsOn(modules.map(moduleRef => moduleRef % "test->test; compile->compile"): _*))
  .enablePlugins(BuildInfoPlugin)
  .settings(
    buildInfoKeys := Seq[BuildInfoKey]("modules" -> modules.map(moduleRef => moduleRef.build)),
    buildInfoPackage := s"mailerSubModules",
    buildInfoObject := "ModulesInfo"
  )

lazy val modules = List(
  ProjectRef(base = file("../../core/server-scala"), id = "core")
)