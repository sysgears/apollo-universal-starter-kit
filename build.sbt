name := "scala-starter-kit"

version := "0.1"

scalaVersion := "2.12.6"

val akkaVersion = "2.5.16"
val akkaHttpVersion = "10.1.5"
val sangriaVersion = "1.0.1"

libraryDependencies ++= Seq(
  "com.typesafe.akka" %% "akka-http" % akkaHttpVersion,
  "com.typesafe.akka" %% "akka-http-spray-json" % akkaHttpVersion,
  "com.typesafe.akka" %% "akka-actor" % akkaVersion,
  "com.typesafe.akka" %% "akka-stream" % akkaVersion,
  "com.typesafe.akka" %% "akka-persistence" % akkaVersion,

  "com.typesafe.akka" %% "akka-http-testkit" % "10.1.5",
  "org.scalatest" % "scalatest_2.12" % "3.0.5" % "test",
  
  "com.google.inject" % "guice" % "4.1.0",
  "net.codingwell" %% "scala-guice" % "4.2.1",

  "org.sangria-graphql" %% "sangria" % "1.4.2",
  "org.sangria-graphql" %% "sangria-spray-json" % sangriaVersion,
  "org.sangria-graphql" %% "sangria-akka-streams" % sangriaVersion,

  "org.sangria-graphql" %% "sangria-monix" % "1.0.0",

  "org.iq80.leveldb" % "leveldb" % "0.9",
  "org.fusesource.leveldbjni" % "leveldbjni-all" % "1.8"
)

parallelExecution in test := false