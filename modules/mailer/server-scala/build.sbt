
lazy val mailer = (project in file(".") dependsOn(modules.map(_ % "test->test; compile->compile"): _*))
  .enablePlugins(BuildInfoPlugin)
  .settings(
    buildInfoKeys := Seq[BuildInfoKey]("modules" -> modules.map(_.build)),
    buildInfoPackage := s"mailerSubModules",
    buildInfoObject := "ModulesInfo"
  )

lazy val modules = List(
  ProjectRef(base = file("../../core/server-scala"), id = "core")
)