package model

case class AddCommentInput(content: String, postId: Int)

object AddCommentInput {

  implicit def inputToComment(input: AddCommentInput): Comment = {
    Comment(content = input.content, postId = input.postId)
  }
}
