package core.services.conf.dotenv

import common.Logger
import io.github.cdimascio.dotenv.internal.{DotenvParser, DotenvReader}

import scala.collection.JavaConverters._
import scala.util.{Failure, Success, Try}

/**
  * Parses '.env' file from the given directory
  **/
trait DotEnvParser extends Logger {

  /**
    * Parses '.env' file from the given directory
    *
    * @param directory      a directory, where the target '.env' file resides
    * @param dotEnvFileName the actual name of the '.env' file. By default is ".env"
    * @return a Map of '.env' file content
    **/
  def parse(directory: String = "", dotEnvFileName: String = ".env"): `.env` = Try {
    new DotenvParser(new DotenvReader(directory, dotEnvFileName), true, true).parse.asScala
  } match {
    case Success(values) =>
      log.info(s"Successfully parsed $dotEnvFileName file.")
      `.env`(values.map(pair => (pair.component1, pair.component2)): _*)
    case Failure(error) =>
      log.error(s"Failed to parse .env file. Reason: $error")
      `.env`.empty
  }
}