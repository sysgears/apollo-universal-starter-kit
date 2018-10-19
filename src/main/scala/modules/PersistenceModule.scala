package modules

import com.google.inject.AbstractModule
import net.codingwell.scalaguice.ScalaModule
import services.persistence.{PersistenceCleanup, PersistenceCleanupImpl}

class PersistenceModule extends AbstractModule with ScalaModule {
  override def configure() {
    bind[PersistenceCleanup].to[PersistenceCleanupImpl]
  }
}