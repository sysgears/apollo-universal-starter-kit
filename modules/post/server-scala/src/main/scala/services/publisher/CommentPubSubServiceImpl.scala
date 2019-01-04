package services.publisher

import common.publisher.{BasicPubSubService, Param, Event}
import javax.inject.{Inject, Singleton}
import model.Comment
import monix.execution.Scheduler

import scala.language.postfixOps

@Singleton
class CommentPubSubServiceImpl @Inject()(implicit scheduler: Scheduler) extends BasicPubSubService[Event[Comment]] {

  override def filter(event: Event[Comment], params: Seq[Param]): Boolean = {
    if (params isEmpty) {
      true
    } else {
      params.exists {
        case postId: PostId => event.element.postId == postId.id
      }
    }
  }
}

case class PostId(id: Int) extends Param
