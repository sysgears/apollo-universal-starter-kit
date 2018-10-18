package modules

import com.google.inject.AbstractModule
import monix.execution.Scheduler
import net.codingwell.scalaguice.ScalaModule

class MonixModule extends AbstractModule with ScalaModule {

  override def configure() {
    bind[Scheduler].toInstance(Scheduler.Implicits.global)
  }
}