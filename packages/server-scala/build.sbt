name := "global"

version := "0.1"

scalaVersion := "2.12.7"

/*
  * TODO: It is currently placed in "global" but, in the end, it should be moved to a separate SBT plugin and not reside here.
  */
resourceGenerators in Compile += Def.task {
  import scala.language.postfixOps

  val logger = streams.value.log

  logger.info("About to load .env configs for modules...")

  val targetDotEnv = (classDirectory in Compile).value / "dotenv" / ".env"
  val globalDir = baseDirectory.value
  val auskBaseDir = globalDir.getParentFile.getParentFile

  val coreModuleDirPath = file(s"${auskBaseDir getCanonicalPath}/modules/core")

  val dotEnvs = global.dependencies
    //Get root dirs for each module, which was enabled in this project
    .map(dep => file(dep.project.asInstanceOf[ProjectRef].build.toString).getParentFile)
    //Explicitly add a core module root dir, since we can't access refs to transitive subprojects (like 'core').
    //The core module is added in the beginning of the sequence, so any duplicates will be overridden by the following values
    .+:(coreModuleDirPath)
    //Filter only module roots which contain '.env'
    .filter(_.list().contains(".env"))
    //Append '.env' to the end of each module root path
    .map(_ / ".env")

  dotEnvs match {
    case seq if seq.isEmpty =>
      logger.warn("No .env configuration was found for any module")
      Seq.empty[sbt.File]
    case seq =>
      val contents = dotEnvs.map {
        `.env` =>
          logger.info(s"Loading .env from ${`.env` getCanonicalPath}...")
          IO read `.env`
      }.mkString("\n")
      IO.write(targetDotEnv, contents)
      Seq(targetDotEnv)
  }
}.taskValue

lazy val global = project in file(".") dependsOn(upload, user, counter, mailer, contact, pagination) aggregate(user, upload, counter, mailer, contact, pagination)

lazy val upload = ProjectRef(base = file("../../modules/upload/server-scala"), id = "upload")

lazy val user = ProjectRef(base = file("../../modules/user/server-scala"), id = "user")

lazy val counter = ProjectRef(base = file("../../modules/counter/server-scala"), id = "counter")

lazy val contact = ProjectRef(base = file("../../modules/contact/server-scala"), id = "contact")

lazy val mailer = ProjectRef(base = file("../../modules/mailer/server-scala"), id = "mailer")

lazy val pagination = ProjectRef(base = file("../../modules/pagination/server-scala"), id = "pagination")