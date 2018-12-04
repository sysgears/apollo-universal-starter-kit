name := "global"

version := "0.1"

scalaVersion := "2.12.7"

lazy val global = project in file(".") dependsOn(upload, user, counter, mailer, contact, pagination) aggregate(user, upload, counter, mailer, contact, pagination)

lazy val upload = ProjectRef(base = file("../../modules/upload/server-scala"), id = "upload")

lazy val user = ProjectRef(base = file("../../modules/user/server-scala"), id = "user")

lazy val counter = ProjectRef(base = file("../../modules/counter/server-scala"), id = "counter")

lazy val contact = ProjectRef(base = file("../../modules/contact/server-scala"), id = "contact")

lazy val mailer = ProjectRef(base = file("../../modules/mailer/server-scala"), id = "mailer")

lazy val pagination = ProjectRef(base = file("../../modules/pagination/server-scala"), id = "pagination")