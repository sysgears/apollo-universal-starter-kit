package core.guice.modules

import monix.execution.Scheduler
import net.codingwell.scalaguice.ScalaModule

class MonixModule extends ScalaModule {

  override def configure() {
    bind[Scheduler].toInstance(Scheduler.Implicits.global)
  }
}