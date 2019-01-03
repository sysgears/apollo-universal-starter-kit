package services.publisher

import common.publisher.{BasicPubSubService, Param, PublishElement}
import javax.inject.{Inject, Singleton}
import model.Post
import monix.execution.Scheduler

import scala.language.postfixOps

@Singleton
class PostPubSubServiceImpl @Inject()(implicit scheduler: Scheduler) extends BasicPubSubService[PublishElement[Post]] {

  override def withFilter(element: PublishElement[Post], triggerNames: Seq[String], params: Seq[Param]): Boolean = {
    triggerNames.contains(element.triggerName) && withParams(element, params)
  }

  private def withParams(pe: PublishElement[Post], params: Seq[Param]): Boolean = {
    if (params isEmpty) {
      true
    } else {
      params.exists {
        case entityId: EntityId => pe.element.id.isDefined && pe.element.id.get == entityId.id
        case endCursor: EndCursor => pe.element.id.isDefined && endCursor.cursor <= pe.element.id.get
      }
    }
  }
}

case class EntityId(id: Int) extends Param
case class EndCursor(cursor: Int) extends Param