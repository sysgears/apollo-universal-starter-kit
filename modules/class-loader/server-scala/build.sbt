libraryDependencies ++= Seq(
  "org.clapper" %% "classutil" % "1.3.0"
)

lazy val classLoader = project in file(".") dependsOn (core % "test->test; compile->compile")

lazy val core = ProjectRef(base = file("../../core/server-scala"), id = "core")