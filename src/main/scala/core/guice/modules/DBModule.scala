package core.guice.modules

import com.google.inject.Provides
import com.typesafe.config.Config
import net.codingwell.scalaguice.ScalaModule
import slick.jdbc.SQLiteProfile.api._

class DBModule extends ScalaModule {

  @Provides
  def database(config: Config): Database = Option(System.getenv("env")) match {
    case Some(env) => if (env equals "test") loadConf("slick.dbs.test") else defaultConf
    case _ => defaultConf
  }

  private def defaultConf = loadConf("slick.dbs.default")

  private def loadConf(path: String) = Database.forConfig(path)
}
