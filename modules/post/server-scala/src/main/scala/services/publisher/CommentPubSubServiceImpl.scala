package services.publisher

import common.publisher.{BasicPubSubService, Param, Event}
import javax.inject.{Inject, Singleton}
import model.Comment
import monix.execution.Scheduler

import scala.language.postfixOps

@Singleton
class CommentPubSubServiceImpl @Inject()(implicit scheduler: Scheduler) extends BasicPubSubService[Event[Comment]] {

  override def withFilter(element: Event[Comment], triggerNames: Seq[String], params: Seq[Param]): Boolean = {
    triggerNames.contains(element.name) && withParams(element, params)
  }

  private def withParams(pe: Event[Comment], params: Seq[Param]): Boolean = {
    if (params isEmpty) {
      true
    } else {
      params.exists {
        case postId: PostId => pe.element.postId == postId.id
      }
    }
  }
}

case class PostId(id: Int) extends Param
