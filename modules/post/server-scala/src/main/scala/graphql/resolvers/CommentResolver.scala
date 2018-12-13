package graphql.resolvers

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import com.google.inject.Inject
import common.ActorNamed
import common.implicits.RichDBIO._
import model.{AddCommentInput, DeleteCommentInput, EditCommentInput}
import repositories.{CommentRepository, PostRepository}

import scala.concurrent.ExecutionContext

object CommentResolver extends ActorNamed {
  final val name = "CommentResolver"
}

case class QueryComments(postId: Int)
case class MutationAddComment(addCommentInput: AddCommentInput)
case class MutationEditComment(editCommentInput: EditCommentInput)
case class MutationDeleteComment(deleteCommentInput: DeleteCommentInput)

class CommentResolver @Inject()(postRepository: PostRepository,
                             commentRepository: CommentRepository)
                            (implicit executionContext: ExecutionContext) extends Actor with ActorLogging {

  override def receive: Receive = {

    case input: QueryComments => {
      log.info(s"Query with param: [{}]", input)
      commentRepository.getAllByPostId(input.postId).run
        .pipeTo(sender)
    }

    case input: MutationAddComment => {
      log.info(s"Mutation with param: [{}]", input)
      commentRepository.save(input.addCommentInput).run
        .pipeTo(sender)
    }

    case input: MutationEditComment => {
      log.info(s"Mutation with param: [{}]", input)
      commentRepository.update(input.editCommentInput).run
        .pipeTo(sender)
    }

    case input: MutationDeleteComment => {
      log.info(s"Mutation with param: [{}]", input)
      val comment = for {
          maybeComment      <- commentRepository.findOne(input.deleteCommentInput.id).run
          deletedComment    <- commentRepository.delete(maybeComment.get).run
        } yield deletedComment
      comment.pipeTo(sender)
    }
  }
}