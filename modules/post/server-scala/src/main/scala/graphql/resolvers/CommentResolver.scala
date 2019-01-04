package graphql.resolvers

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import com.google.inject.Inject
import common.ActorNamed
import common.errors.NotFound
import common.implicits.RichDBIO._
import model.{AddCommentInput, DeleteCommentInput, EditCommentInput}
import repositories.{CommentRepository, PostRepository}

import scala.concurrent.{ExecutionContext, Future}

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
      log.debug(s"Query with param: [ $input ]")
      commentRepository.getAllByPostId(input.postId).run
        .pipeTo(sender)
    }

    case input: MutationAddComment => {
      log.debug(s"Mutation with param: [ $input ]")
      val comment = for {
        maybePost           <- postRepository.findOne(input.addCommentInput.postId).run
        _                   <- if (maybePost.isDefined) Future.successful(maybePost.get)
                               else Future.failed(NotFound(s"Couldn't add a comment. Post with id: ${input.addCommentInput.postId} not found."))
        comment             <- commentRepository.save(input.addCommentInput).run
      } yield comment
      comment.pipeTo(sender)
    }

    case input: MutationEditComment => {
      log.debug(s"Mutation with param: [ $input ]")
      val comment = for {
        maybeComment        <- commentRepository.findOne(input.editCommentInput.id).run
        comment             <- if (maybeComment.isDefined) Future.successful(maybeComment.get)
                               else Future.failed(NotFound(s"Comment with id: ${input.editCommentInput.id} not found."))
        updatedComment      <- commentRepository.update(input.editCommentInput).run
      } yield updatedComment
      comment.pipeTo(sender)
    }

    case input: MutationDeleteComment => {
      log.debug(s"Mutation with param: [ $input ]")
      val comment = for {
          maybeComment      <- commentRepository.findOne(input.deleteCommentInput.id).run
          comment           <- if (maybeComment.isDefined) Future.successful(maybeComment.get)
                               else Future.failed(NotFound(s"Comment with id: ${input.deleteCommentInput.id} not found."))
          deletedComment    <- commentRepository.delete(comment).run
        } yield deletedComment
      comment.pipeTo(sender)
    }
  }
}