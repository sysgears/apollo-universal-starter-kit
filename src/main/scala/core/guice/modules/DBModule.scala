package core.guice.modules

import com.google.inject.Provides
import com.typesafe.config.Config
import net.codingwell.scalaguice.ScalaModule
import slick.jdbc.SQLiteProfile.api._

class DBModule extends ScalaModule {

  @Provides
  def database(config: Config): Database = Option(System.getenv("env")) match {
    case Some(_) => Database.forConfig("slick.dbs.test")
    case _ => Database.forConfig("slick.dbs.default")
  }
}
