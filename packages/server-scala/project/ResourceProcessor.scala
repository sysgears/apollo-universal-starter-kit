import sbt.{Def, File, IO, file, _}
import sbt.Keys.{baseDirectory, classDirectory, streams}
import sbt.internal.util.ManagedLogger
import scala.util._

import scala.util.Try

object ResourceProcessor {
  
  val concatDotEnvsTask: Def.Initialize[Task[Seq[File]]] = Def.task {
    val logger: ManagedLogger = streams.value.log

    logger.info("About to load .env configs for modules...")

    val targetDotEnv = (classDirectory in Compile).value / "dotenv" / ".env"
    val auskBaseDir = baseDirectory.value.getParentFile.getParentFile

    val modulesDirs = file(s"${auskBaseDir getCanonicalPath}/modules/").getAbsoluteFile.listFiles().filter(_.isDirectory)
    val dotEnvs = (modulesDirs :+ auskBaseDir).filter(_.list().contains(".env")).map(_ / ".env")
    dotEnvs match {
      case seq if seq.isEmpty =>
        logger.warn("No .env configuration was found for any module")
        Seq.empty[sbt.File]
      case seq =>
        Try {
          val contents = seq.map {
            `.env` =>
              logger.info(s"Loading .env from ${`.env` getCanonicalPath}...")
              IO read `.env`
          }.mkString("\n")
          IO.write(targetDotEnv, contents)
        } match {
          case Success(_) =>
            logger.info("Successfully concatenated .env files")
            Seq(targetDotEnv)
          case Failure(error) =>
            logger.error(s"Failed to concatenate .env files. Reason: $error")
            Seq.empty
        }
    }
  }

  val concatServerConfigsTask: Def.Initialize[Task[Seq[File]]] = Def.task {
    val logger: ManagedLogger = streams.value.log

    logger.info("About to load server.config.json configs for modules...")

    val targetServerConfig = (classDirectory in Compile).value / "serverconfig" / "server.config.json"
    val auskBaseDir = baseDirectory.value.getParentFile.getParentFile

    val modulesDirs = file(s"${auskBaseDir getCanonicalPath}/modules/").getAbsoluteFile.listFiles().filter(_.isDirectory)
    val serverConfigs = (modulesDirs :+ auskBaseDir).filter(_.list().contains("server.config.json")).map(_ / "server.config.json")
    serverConfigs match {
      case seq if seq.isEmpty =>
        logger.warn("No server.config.json configuration was found for any module")
        Seq.empty[sbt.File]
      case seq =>
        Try {
          val contents: String = seq.map {
            jsonFile =>
              logger.info(s"Loading server.config.json from ${jsonFile getCanonicalPath}...")
              val text: String = IO read jsonFile
              text.substring(text.indexOf("{") + 1, text.lastIndexOf("}") - 1)
          }.mkString(",\n")
          IO.write(targetServerConfig, s"{$contents\n}")
        } match {
          case Success(_) =>
            logger.info("Successfully concatenated server.config.json files")
            Seq(targetServerConfig)
          case Failure(error) =>
            logger.error(s"Failed to concatenate server.config.json files. Reason: $error")
            Seq.empty
        }
    }
  }
}