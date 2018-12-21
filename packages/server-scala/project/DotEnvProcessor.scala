import sbt.{Def, File, IO, file, _}
import sbt.Keys.{baseDirectory, classDirectory, streams}
import sbt.internal.util.ManagedLogger
import scala.util._

import scala.util.Try

object DotEnvProcessor {
  val concatenateTask: Def.Initialize[Task[Seq[File]]] = Def.task {
    val logger: ManagedLogger = streams.value.log

    logger.info("About to load .env configs for modules...")

    val targetDotEnv = (classDirectory in Compile).value / "dotenv" / ".env"
    val globalDir = baseDirectory.value
    val auskBaseDir = globalDir.getParentFile.getParentFile

    val modulesDirs = file(s"${auskBaseDir getCanonicalPath}/modules/").getAbsoluteFile.listFiles().filter(_.isDirectory)
    val dotEnvs = modulesDirs.filter(_.list().contains(".env")).map(_ / ".env")
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
}