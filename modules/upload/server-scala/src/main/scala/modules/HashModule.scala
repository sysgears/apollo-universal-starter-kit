package modules

import com.google.inject.Scopes
import net.codingwell.scalaguice.ScalaModule
import services.{HashAppender, HashAppenderImpl}

class HashModule extends ScalaModule {

  override def configure(): Unit = {
    bind[HashAppender].to[HashAppenderImpl].in(Scopes.SINGLETON)
  }
}