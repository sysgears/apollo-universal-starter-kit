package core.loaders

import core.services.conf.dotenv._
import scala.language.postfixOps

object DotEnvLoader extends DotEnvParser with SysEnvExtenderImplicits {
  def load(moduleDotEnvPaths: List[String]): Unit = sys.env extend {
    val rootDotEnv: `.env` = parse(directory = "./")
    val moduleDotEnvs: List[`.env`] = moduleDotEnvPaths.map(path => parse(directory = path))
    val moduleDotEnvsConcatenated: `.env` = moduleDotEnvs.foldLeft(`.env` empty)(_ ++ _)

    rootDotEnv ++ moduleDotEnvsConcatenated
  }
}
