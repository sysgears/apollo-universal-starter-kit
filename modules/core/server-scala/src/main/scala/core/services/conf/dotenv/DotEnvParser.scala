package core.services.conf.dotenv

import io.github.cdimascio.dotenv.internal.{DotenvParser, DotenvReader}
import scala.collection.JavaConverters._

/**
  * Parses '.env' file from the given directory
  **/
object DotEnvParser {
  /**
    * Parses '.env' file from the given directory
    *
    * @param directory a directory, where the target '.env' file resides
    * @param dotEnvFileName the actual name of the '.env' file. By default is ".env"
    * @return a Map of '.env' file content
    * */
  def parse(directory: String, dotEnvFileName: String = ".env"): `.env` = Map[String, String](
    new DotenvParser(new DotenvReader(directory, dotEnvFileName), true, true).parse.asScala
      .map(pair => (pair.component1, pair.component2)): _*
  )
}
