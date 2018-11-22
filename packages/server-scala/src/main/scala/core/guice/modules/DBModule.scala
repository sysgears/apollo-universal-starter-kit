package core.guice.modules

import com.google.inject.Provides
import com.typesafe.config.Config
import common.DatabaseExecutor
import net.codingwell.scalaguice.ScalaModule
import slick.jdbc.JdbcBackend._
import slick.jdbc.JdbcProfile

class DBModule extends ScalaModule {

  override def configure(): Unit = {
    bind[DatabaseExecutor.type].toInstance(DatabaseExecutor)
  }

  @Provides
  def database(config: Config): Database = Option(System.getenv("env")) match {
    case Some(env) => if (env equals "test") loadConf("slick.dbs.test") else defaultConf
    case _ => defaultConf
  }

  @Provides
  def driver: JdbcProfile = slick.jdbc.SQLiteProfile

  private def defaultConf = loadConf("slick.dbs.default")

  private def loadConf(path: String) = Database.forConfig(path)
}