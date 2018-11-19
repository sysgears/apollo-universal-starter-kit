package modules.upload.guice.modules

import com.google.inject.Scopes
import modules.upload.services.{HashAppender, HashAppenderImpl}
import net.codingwell.scalaguice.ScalaModule

class HashModule extends ScalaModule {

  override def configure(): Unit = {
    bind[HashAppender].to[HashAppenderImpl].in(Scopes.SINGLETON)
  }
}