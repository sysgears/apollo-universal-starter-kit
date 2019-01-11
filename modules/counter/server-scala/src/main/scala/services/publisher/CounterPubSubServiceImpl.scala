package services.publisher

import common.publisher.{BasicPubSubService, Event}
import javax.inject.{Inject, Singleton}
import models.Counter
import monix.execution.Scheduler

@Singleton
class CounterPubSubServiceImpl @Inject()(implicit scheduler: Scheduler) extends BasicPubSubService[Event[Counter]]
