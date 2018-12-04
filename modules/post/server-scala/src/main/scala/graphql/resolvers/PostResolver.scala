package graphql.resolvers

import model._

import scala.concurrent.Future

trait PostResolver {

  def post(id: Int): Future[Post]

  def posts(limit: Int, after: Int): Future[Posts]

  def addPost(input: AddPostInput): Future[Post]

  def deletePost(id: Int): Future[Post]

  def editPost(input: EditPostInput): Future[Post]

  def addComment(input: AddCommentInput): Future[Comment]

  def deleteComment(input: DeleteCommentInput): Future[Comment]

  def editComment(input: EditCommentInput): Future[Comment]

  def getComments(postId: Int): Future[Seq[Comment]]

  def postUpdated(id: Int): Future[UpdatePostPayload] /*TODO Not Implemented*/

  def postsUpdated(endCursor: Int): Future[UpdatePostPayload] /*TODO Not Implemented*/

  def commentUpdated(postId: Int): Future[UpdateCommentPayload] /*TODO Not Implemented*/

}
