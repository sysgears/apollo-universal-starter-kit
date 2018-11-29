package graphql.resolvers

import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Inject
import common.Logger
import model._
import common.RichDBIO._
import slick.dbio.DBIO

import scala.concurrent.{ExecutionContext, Future}

class PostResolverImpl @Inject()(postRepository: Repository[Post, Int],
                                 commentRepository: Repository[Comment, Int])
                                (implicit executionContext: ExecutionContext) extends PostResolver with Logger {
  implicit def dbAction[T](action: DBIO[T]): Future[T] = action.run

  //TODO Implement error handler
  override def post(id: Int): Future[Post] =
    for {
      maybePost <- postRepository.findOne(id).run
      post      <- if (maybePost.nonEmpty) Future.successful(maybePost.get) else Future.successful(null)
    } yield post

  //TODO Not Implemented
  override def posts(limit: Int, after: Int): Future[Posts] = ???

  override def addPost(input: AddPostInput): Future[Post] =
    postRepository.save(input)

  override def deletePost(id: Int): Future[Post] = {
    for {
      maybePost <- postRepository.findOne(id).run
      post      <- maybePost
      _         <- postRepository.delete(post)
    } yield post
  }

  override def editPost(input: EditPostInput): Future[Post] =
    postRepository.update(input)

  override def addComment(input: AddCommentInput): Future[Comment] =
    commentRepository.save(input)

  override def deleteComment(input: DeleteCommentInput): Future[Comment] =
    for {
      maybeComment <- commentRepository.findOne(input.id)
      comment      <- maybeComment
      _            <- commentRepository.delete(comment)
    } yield comment

  override def editComment(input: EditCommentInput): Future[Comment] =
    commentRepository.update(input)

  //  //TODO NOT Implemented Subscription method!!!
  //  override def postUpdated(id: Int): Future[UpdatePostPayload] =
  //    Future.failed(NotImplementedException)
  //
  //  //TODO NOT Implemented Subscription method!!!
  //  override def postsUpdated(endCursor: Int): Future[UpdatePostPayload] =
  //    Future.failed(NotImplementedException)
  //
  //  //TODO NOT Implemented Subscription method!!!
  //  override def commentUpdated(postId: Int): Future[UpdateCommentPayload] =
  //    Future.failed(NotImplementedException)
}
