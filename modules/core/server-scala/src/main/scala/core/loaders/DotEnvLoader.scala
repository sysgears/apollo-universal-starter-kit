package core.loaders

import core.services.conf.dotenv._
import scala.language.postfixOps

object DotEnvLoader extends DotEnvParser with SysEnvExtenderImplicits {
  def load: Unit = sys.env extend parse( /*Parses current dir by default*/ )
}
