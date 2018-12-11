lazy val post = project in file(".") dependsOn(core % "test->test; compile->compile", pagination % "test->test; compile->compile")

lazy val core = ProjectRef(base = file("../../core/server-scala"), id = "core")

lazy val pagination = ProjectRef(base = file("../../pagination/server-scala"), id = "pagination")