package modules

import com.google.inject.AbstractModule
import models.counter.Counter
import monix.execution.Scheduler
import net.codingwell.scalaguice.ScalaModule
import services.publisher.PublisherService
import services.publisher.monix.MonixPublisherServiceImpl

class MonixModule extends AbstractModule with ScalaModule {

  override def configure {
    bind[Scheduler].toInstance(Scheduler.Implicits.global)

    bind[PublisherService[Counter]].to[MonixPublisherServiceImpl[Counter]]
  }
}