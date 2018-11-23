libraryDependencies ++= Seq(
  "commons-io" % "commons-io" % "2.6"
)

lazy val upload = project in file(".") dependsOn(core % "test->test; compile->compile")

lazy val core = ProjectRef(file("../../../packages/server-scala/core"), "core")