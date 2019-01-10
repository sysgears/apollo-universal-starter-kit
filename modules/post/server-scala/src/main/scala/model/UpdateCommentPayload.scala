package model

case class UpdateCommentPayload(mutation: String, id: Int, postId: Int, node: Comment)
