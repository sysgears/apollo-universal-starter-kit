package services.publisher

import common.publisher.{BasicPubSubService, Param, PublishElement}
import javax.inject.{Inject, Singleton}
import model.Comment
import monix.execution.Scheduler

import scala.language.postfixOps

@Singleton
class CommentPubSubServiceImpl @Inject()(implicit scheduler: Scheduler) extends BasicPubSubService[PublishElement[Comment]] {

  override def withFilter(element: PublishElement[Comment], triggerNames: Seq[String], params: Seq[Param]): Boolean = {
    triggerNames.contains(element.triggerName) && withParams(element, params)
  }

  private def withParams(pe: PublishElement[Comment], params: Seq[Param]): Boolean = {
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
