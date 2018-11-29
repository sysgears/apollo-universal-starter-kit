package graphql.resolvers

import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Inject
import common.Logger
import model._
import common.RichDBIO._
import slick.dbio.DBIO

import scala.concurrent.{ExecutionContext, Future}

class PostResolverImpl @Inject()(postRepository: Repository[Post, Int], commentRepository: Repository[Comment, Int])
                                (implicit executionContext: ExecutionContext) extends PostResolver with Logger {
  override def post(id: Int): Future[Post] = ???

  override def posts(limit: Int, after: Int): Future[Posts] = ???

  override def addPost(input: AddPostInput): Future[Post] = ???

  override def deletePost(id: Int): Future[Post] = ???

  override def editPost(input: EditPostInput): Future[Post] = ???

  override def addComment(input: AddCommentInput): Future[Comment] = ???

  override def deleteComment(input: DeleteCommentInput): Future[Comment] = ???

  override def editComment(input: EditCommentInput): Future[Comment] = ???
}
