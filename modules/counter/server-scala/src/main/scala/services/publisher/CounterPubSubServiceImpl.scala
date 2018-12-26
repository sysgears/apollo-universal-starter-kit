package services.publisher

import common.publisher.{BasicPubSubService, Param, PublishElement}
import javax.inject.{Inject, Singleton}
import models.Counter
import monix.execution.Scheduler

@Singleton
class CounterPubSubServiceImpl @Inject()(implicit scheduler: Scheduler) extends BasicPubSubService[PublishElement[Counter]] {

  override def withFilter(element: PublishElement[Counter], triggerNames: Seq[String], params: Seq[Param]): Boolean = {
    triggerNames.contains(element.triggerName)
  }
}