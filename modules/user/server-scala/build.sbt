lazy val user = project in file(".") dependsOn(core % "test->test; compile->compile", mailer % "test->test; compile->compile", contact % "test->test; compile->compile")

lazy val core = ProjectRef(base = file("../../core/server-scala"), id = "core")

lazy val mailer = ProjectRef(base = file("../../mailer/server-scala"), id = "mailer")

lazy val contact = ProjectRef(base = file("../../contact/server-scala"), id = "contact")