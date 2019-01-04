package services.publisher

import common.publisher.{BasicPubSubService, Param, Event}
import javax.inject.{Inject, Singleton}
import models.Counter
import monix.execution.Scheduler

@Singleton
class CounterPubSubServiceImpl @Inject()(implicit scheduler: Scheduler) extends BasicPubSubService[Event[Counter]] {

  override def withFilter(element: Event[Counter], triggerNames: Seq[String], params: Seq[Param]): Boolean = {
    triggerNames.contains(element.name)
  }
}