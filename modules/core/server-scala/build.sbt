import org.ensime.EnsimeKeys._

lazy val core = project in file(".")

name := "core"

version := "0.1"

scalaVersion := "2.12.6"

val akkaVersion = "2.5.16"
val akkaHttpVersion = "10.1.5"
val sangriaVersion = "1.0.1"

ensimeIgnoreMissingDirectories := true
ensimeScalaVersion in ThisBuild := scalaVersion.value

libraryDependencies ++= Seq(
  "com.typesafe.akka" %% "akka-http" % akkaHttpVersion,
  "com.typesafe.akka" %% "akka-http-spray-json" % akkaHttpVersion,
  "com.typesafe.akka" %% "akka-actor" % akkaVersion,
  "com.typesafe.akka" %% "akka-stream" % akkaVersion,

  "com.softwaremill.akka-http-session" %% "core" % "0.5.6",
  "com.softwaremill.akka-http-session" %% "jwt"  % "0.5.6",

  "ch.megard" %% "akka-http-cors" % "0.3.1",

  "com.typesafe.akka" %% "akka-http-testkit" % "10.1.5",
  "org.scalatest" % "scalatest_2.12" % "3.0.5" % "test",

  "com.google.inject" % "guice" % "4.1.0",
  "net.codingwell" %% "scala-guice" % "4.2.1",

  "org.sangria-graphql" %% "sangria" % "1.4.2",
  "org.sangria-graphql" %% "sangria-spray-json" % sangriaVersion,
  "org.sangria-graphql" %% "sangria-akka-streams" % sangriaVersion,
  "org.sangria-graphql" %% "sangria-monix" % "1.0.0",

  "com.typesafe.akka" %% "akka-slf4j" % akkaVersion,
  "ch.qos.logback" % "logback-classic" % "1.2.3",

  "org.xerial" % "sqlite-jdbc" % "3.7.2",
  "com.typesafe.slick" %% "slick" % "3.2.3",
  "com.typesafe.slick" %% "slick-hikaricp" % "3.2.3",

  "com.github.jurajburian" %% "mailer" % "1.2.3",
  "org.clapper" %% "classutil" % "1.3.0",

  "com.pauldijou" %% "jwt-core" % "0.19.0",

  "commons-io" % "commons-io" % "2.6",

  "org.mindrot" % "jbcrypt" % "0.3m",

  "com.byteslounge" %% "slick-repo" % "1.5.2",
  "com.h2database" % "h2" % "1.3.148" % Test

)

parallelExecution in test := false