package graphql.resolvers

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import com.google.inject.Inject
import common.ActorNamed
import common.errors.NotFound
import common.implicits.RichDBIO._
import model.{AddCommentInput, DeleteCommentInput, EditCommentInput}
import repositories.{CommentRepository, PostRepository}
import slick.dbio.DBIO

import scala.concurrent.ExecutionContext

object CommentResolver extends ActorNamed {
  final val name = "CommentResolver"
}

case class QueryComments(postId: Int)
case class MutationAddComment(addCommentInput: AddCommentInput)
case class MutationEditComment(editCommentInput: EditCommentInput)
case class MutationDeleteComment(deleteCommentInput: DeleteCommentInput)

class CommentResolver @Inject()(postRepository: PostRepository, commentRepository: CommentRepository)(
    implicit executionContext: ExecutionContext
) extends Actor
  with ActorLogging {

  override def receive: Receive = {

    case input: QueryComments => {
      log.debug(s"Query with param: [ $input ]")
      commentRepository.getAllByPostId(input.postId).run.pipeTo(sender)
    }

    case input: MutationAddComment => {
      log.debug(s"Mutation with param: [ $input ]")
      postRepository
        .executeTransactionally(
          for {
            maybePost <- postRepository.findOne(input.addCommentInput.postId)
            post <- if (maybePost.isDefined) DBIO.successful(maybePost.get)
            else
              DBIO.failed(NotFound(s"Couldn't add a comment. Post with id: ${input.addCommentInput.postId} not found."))
            comment <- commentRepository.save(input.addCommentInput)
          } yield comment
        )
        .run
        .pipeTo(sender)
    }

    case input: MutationEditComment => {
      log.debug(s"Mutation with param: [ $input ]")
      commentRepository
        .executeTransactionally(
          for {
            maybeComment <- commentRepository.findOne(input.editCommentInput.id)
            comment <- if (maybeComment.isDefined) DBIO.successful(maybeComment.get)
            else DBIO.failed(NotFound(s"Comment with id: ${input.editCommentInput.id} not found."))
            updatedComment <- commentRepository.update(input.editCommentInput)
          } yield updatedComment
        )
        .run
        .pipeTo(sender)
    }

    case input: MutationDeleteComment => {
      log.debug(s"Mutation with param: [ $input ]")
      commentRepository
        .executeTransactionally(
          for {
            maybeComment <- commentRepository.findOne(input.deleteCommentInput.id)
            comment <- if (maybeComment.isDefined) DBIO.successful(maybeComment.get)
            else DBIO.failed(NotFound(s"Comment with id: ${input.deleteCommentInput.id} not found."))
            deletedComment <- commentRepository.delete(comment)
          } yield deletedComment
        )
        .run
        .pipeTo(sender)
    }
  }
}
