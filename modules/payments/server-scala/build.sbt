lazy val payments = project in file(".") dependsOn (
  core % "test->test; compile->compile",
  user % "test->test; compile->compile"
)

lazy val core = ProjectRef(base = file("../../core/server-scala"), id = "core")
lazy val user = ProjectRef(base = file("../../user/server-scala"), id = "user")

libraryDependencies ++= Seq(
  "com.stripe" % "stripe-java" % "7.8.0"
)