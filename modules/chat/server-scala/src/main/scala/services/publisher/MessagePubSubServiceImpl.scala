package services.publisher

import com.google.inject.{Inject, Singleton}
import common.publisher.{BasicPubSubService, Event, Param}
import monix.execution.Scheduler
import models.Message
import scala.language.postfixOps

@Singleton
class MessagePubSubServiceImpl @Inject()(implicit scheduler: Scheduler) extends BasicPubSubService[Event[Message]] {

  override def filter(event: Event[Message], params: Seq[Param]): Boolean = {
    if (params isEmpty) {
      true
    } else {
      params.exists {
        case entityId: EntityId => event.element.id == entityId.id
        case endCursor: EndCursor => endCursor.cursor <= event.element.id
      }
    }
  }
}

case class EntityId(id: Int) extends Param
case class EndCursor(cursor: Int) extends Param
