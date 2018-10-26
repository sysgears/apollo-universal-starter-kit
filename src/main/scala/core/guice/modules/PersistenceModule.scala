package core.guice.modules

import core.services.persistence.{PersistenceCleanup, PersistenceCleanupImpl}
import net.codingwell.scalaguice.ScalaModule

class PersistenceModule extends ScalaModule {
  override def configure() {
    bind[PersistenceCleanup].to[PersistenceCleanupImpl]
  }
}