package services.publisher

import common.publisher.{BasicPubSubService, Param, Event}
import javax.inject.{Inject, Singleton}
import model.Post
import monix.execution.Scheduler

import scala.language.postfixOps

@Singleton
class PostPubSubServiceImpl @Inject()(implicit scheduler: Scheduler) extends BasicPubSubService[Event[Post]] {

  override def filter(event: Event[Post], params: Seq[Param]): Boolean = {
    if (params isEmpty) {
      true
    } else {
      params.exists {
        case entityId: EntityId => event.element.id.isDefined && event.element.id.get == entityId.id
        case endCursor: EndCursor => event.element.id.isDefined && endCursor.cursor <= event.element.id.get
      }
    }
  }
}

case class EntityId(id: Int) extends Param
case class EndCursor(cursor: Int) extends Param
