
name := "scala-starter-kit"

version := "0.1"

scalaVersion := "2.12.6"

val akkaHttpVersion = "10.1.5"
val akkaActorsVersion = "2.5.16"
val akkaStreamsVersion = "2.5.16"

libraryDependencies ++= Seq(
  "com.typesafe.akka" %% "akka-http" % akkaHttpVersion,
  "com.typesafe.akka" %% "akka-actor" % akkaActorsVersion,
  "com.typesafe.akka" %% "akka-stream" % akkaStreamsVersion
)