lazy val counter = project in file(".") dependsOn(core % "test->test; compile->compile")

lazy val core = ProjectRef(base = file("../../core/server-scala"), id = "core")

parallelExecution in test := false