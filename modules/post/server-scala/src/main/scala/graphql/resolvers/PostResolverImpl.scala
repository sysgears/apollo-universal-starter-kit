package graphql.resolvers

import com.google.inject.Inject
import common.Logger
import model._
import common.implicits.RichDBIO._
import repositories.{CommentRepository, PostRepository}

import scala.concurrent.{ExecutionContext, Future}

class PostResolverImpl @Inject()(postRepository: PostRepository,
                                 commentRepository: CommentRepository)
                                (implicit executionContext: ExecutionContext) extends PostResolver with Logger {

  //TODO Implement error handler
  override def post(id: Int): Future[Post] =
    for {
      maybePost <- postRepository.findOne(id).run
      post      <- if (maybePost.nonEmpty) Future.successful(maybePost.get) else Future.successful(null)
    } yield post

  //TODO Not Implemented
  override def posts(limit: Int, after: Int): Future[Posts] = ???

  override def addPost(input: AddPostInput): Future[Post] =
    postRepository.save(input).run

  //TODO Unsafe
  override def deletePost(id: Int): Future[Post] = {
    for {
      maybePost <- postRepository.findOne(id).run
      _         <- postRepository.delete(maybePost.get).run
    } yield maybePost.get
  }

  override def editPost(input: EditPostInput): Future[Post] =
    postRepository.update(input).run

  override def addComment(input: AddCommentInput): Future[Comment] =
    commentRepository.save(input).run

  //TODO Unsafe
  override def deleteComment(input: DeleteCommentInput): Future[Comment] =
    for {
      maybeComment <- commentRepository.findOne(input.id).run
      _            <- commentRepository.delete(maybeComment.get).run
    } yield maybeComment.get

  override def editComment(input: EditCommentInput): Future[Comment] =
    commentRepository.update(input).run

  override def getComments(postId: Int): Future[Seq[Comment]] =
    commentRepository.getAllByPostId(postId).run

  //TODO NOT Implemented Subscription method!!!
  override def postUpdated(id: Int): Future[UpdatePostPayload] = ???

  //TODO NOT Implemented Subscription method!!!
  override def postsUpdated(endCursor: Int): Future[UpdatePostPayload] = ???

  //TODO NOT Implemented Subscription method!!!
  override def commentUpdated(postId: Int): Future[UpdateCommentPayload] = ???
}
