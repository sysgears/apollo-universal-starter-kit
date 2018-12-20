package services.publisher

import core.services.publisher.{BasicPubSubService, Param, PublishElement}
import javax.inject.{Inject, Singleton}
import model.Post
import monix.execution.Scheduler

@Singleton
class PostPubSubServiceImpl @Inject()(implicit scheduler: Scheduler) extends BasicPubSubService[PublishElement[Post]] {

  override def withFilter(element: PublishElement[Post], triggerNames: Seq[String], params: Seq[Param]): Boolean = {
    triggerNames.contains(element.triggerName) && withParams(element, params)
  }

  private def withParams(element: PublishElement[Post], params: Seq[Param]): Boolean = {
    if (params isEmpty) {
      true
    } else {
      params.exists {
        case entityId: EntityId => element.element.id.get == entityId.id
        case endCursor: EndCursor => endCursor.cursor <= element.element.id.get
      }
    }
  }
}

case class EntityId(id: Int) extends Param
case class EndCursor(cursor: Int) extends Param