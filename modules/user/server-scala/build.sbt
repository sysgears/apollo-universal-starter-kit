lazy val user = project in file(".") dependsOn(core % "test->test; compile->compile")

lazy val core = ProjectRef(file("../../../packages/server-scala/core"), "core")