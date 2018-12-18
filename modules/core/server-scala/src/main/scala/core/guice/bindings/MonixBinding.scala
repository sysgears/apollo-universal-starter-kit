package core.guice.bindings

import monix.execution.Scheduler
import net.codingwell.scalaguice.ScalaModule

class MonixBinding extends ScalaModule {

  override def configure() {
    bind[Scheduler].toInstance(Scheduler.Implicits.global)
  }
}