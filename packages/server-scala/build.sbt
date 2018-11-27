name := "global"

version := "0.1"

scalaVersion := "2.12.7"

lazy val global = project in file(".") dependsOn(upload, user, counter) aggregate(user, upload, counter)

lazy val upload = ProjectRef(base = file("../../modules/upload/server-scala"), id = "upload")

lazy val user = ProjectRef(base = file("../../modules/user/server-scala"), id = "user")

lazy val counter = ProjectRef(base = file("../../modules/counter/server-scala"), id = "counter")