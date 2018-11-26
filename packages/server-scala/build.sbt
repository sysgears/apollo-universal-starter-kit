name := "main"

version := "0.1"

scalaVersion := "2.12.7"

lazy val main = project in file(".") dependsOn(upload, user) aggregate(upload, user)

lazy val upload = ProjectRef(base = file("../../modules/upload/server-scala"), id = "upload")

lazy val user = ProjectRef(base = file("../../modules/user/server-scala"), id = "user")