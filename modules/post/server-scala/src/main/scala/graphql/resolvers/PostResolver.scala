package graphql.resolvers

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import com.google.inject.Inject
import common.ActorNamed
import common.errors.NotFound
import common.implicits.RichDBIO._
import model._
import repositories.{CommentRepository, PostRepository}

import scala.concurrent.{ExecutionContext, Future}

object PostResolver extends ActorNamed {
  final val name = "PostResolver"
}

case class QueryPost(id: Int)
case class QueryPosts(limit: Int, after: Int)
case class MutationAddPost(addPostInput: AddPostInput)
case class MutationDeletePost(id: Int)
case class MutationEditPost(editPostInput: EditPostInput)
case class SubscriptionPostUpdated(id: Int)
case class SubscriptionPostsUpdated(endCursor: Int)

class PostResolver @Inject()(postRepository: PostRepository,
                             commentRepository: CommentRepository)
                            (implicit executionContext: ExecutionContext) extends Actor with ActorLogging {

  override def receive: Receive = {

    case input: QueryPost => {
      log.info(s"Query with param: [{}]", input)

      val post = for {
        maybePost <- postRepository.findOne(input.id).run
        post      <- if (maybePost.isDefined) Future.successful(maybePost.get)
                     else Future.failed(NotFound(s"Post with id: ${input.id} not found."))
      } yield post
        post.pipeTo(sender)
    }

    case input: QueryPosts => {
      log.info(s"Query with param: [{}]", input)
      implicit def toEdges(entities: List[Post]): Seq[PostEdges] =
        Map((1 to entities.size).zip(entities): _*).map(value => {
          val (index, post) = value
          PostEdges(node = post, cursor = input.after + index)
        }).toSeq

      def endCursorValue(pageSize: Int): Int = if (pageSize > 0 ) pageSize - 1 else 0

      val posts = for {
        paginatedResult <- postRepository.getPaginatedObjectsList(PaginationParams(offset = input.after, limit = input.limit)).run
      } yield Posts(
        totalCount = paginatedResult.totalCount,
        edges = paginatedResult.entities,
        pageInfo = PostPageInfo(
          endCursor = endCursorValue(paginatedResult.entities.size),
          hasNextPage = paginatedResult.hasNextPage)
      )
      posts.pipeTo(sender)
    }

    case input: MutationAddPost => {
      log.info(s"Mutation with param: [{}]", input)
      postRepository.save(input.addPostInput).run
        .pipeTo(sender)
    }

    case input: MutationDeletePost => {
      log.info(s"Mutation with param: [{}]", input)
      val post = for {
            maybePost     <- postRepository.findOne(input.id).run
            post          <- if (maybePost.isDefined) Future.successful(maybePost.get)
                             else Future.failed(NotFound(s"Post with id: ${input.id} not found."))
            deletedPost   <- postRepository.delete(post).run
          } yield deletedPost
      post.pipeTo(sender)
    }

    case input: MutationEditPost => {
      log.info(s"Mutation with param: [{}]", input)
      val post = for {
        maybePost     <- postRepository.findOne(input.editPostInput.id).run
        post          <- if (maybePost.isDefined) Future.successful(maybePost.get)
                         else Future.failed(NotFound(s"Post with id: ${input.editPostInput.id} not found."))
        updatedPost   <- postRepository.update(input.editPostInput).run
      } yield updatedPost
      post.pipeTo(sender)
    }
  }
}