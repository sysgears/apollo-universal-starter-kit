package core.guice.modules

import com.google.inject.Provides
import common.implicits.RichDBIO
import net.codingwell.scalaguice.ScalaModule
import slick.basic.DatabaseConfig
import slick.jdbc.{JdbcBackend, JdbcProfile}

class DBModule extends ScalaModule {

  override def configure(): Unit = {
    bind[RichDBIO.type].toInstance(RichDBIO)
  }

  @Provides
  def database: JdbcBackend#DatabaseDef = databaseConfig.db

  @Provides
  def driver: JdbcProfile = databaseConfig.profile

  private def databaseConfig = Option(System.getenv("env")) match {
    case Some(env) => if (env.equals("test")) testConfig else defaultConfig
    case _ => defaultConfig
  }

  private def defaultConfig = loadConfig("slick.dbs.default")

  private def testConfig = loadConfig("slick.dbs.test")

  private def loadConfig(path: String) = DatabaseConfig.forConfig[JdbcProfile](path)
}