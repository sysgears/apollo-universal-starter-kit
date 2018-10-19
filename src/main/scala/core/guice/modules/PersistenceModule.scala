package core.guice.modules

import com.google.inject.AbstractModule
import core.services.persistence.{PersistenceCleanup, PersistenceCleanupImpl}
import net.codingwell.scalaguice.ScalaModule

class PersistenceModule extends AbstractModule with ScalaModule {
  override def configure() {
    bind[PersistenceCleanup].to[PersistenceCleanupImpl]
  }
}