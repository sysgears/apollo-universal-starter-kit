package core.guice.bindings

import com.google.inject.{Provides, Singleton}
import common.implicits.RichDBIO
import net.codingwell.scalaguice.ScalaModule
import slick.basic.DatabaseConfig
import slick.jdbc.{JdbcBackend, JdbcProfile}

class DbBinding extends ScalaModule {

  override def configure(): Unit = {
    requestInjection(RichDBIO)
  }

  @Provides
  @Singleton
  def database: JdbcBackend#DatabaseDef = databaseConfig.db

  @Provides
  @Singleton
  def driver: JdbcProfile = databaseConfig.profile

  private def databaseConfig = loadConfig("slick.dbs.default")

  private def loadConfig(path: String) = DatabaseConfig.forConfig[JdbcProfile](path)
}