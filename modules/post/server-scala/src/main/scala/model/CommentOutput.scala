package model

case class CommentOutput(id: Int,
                         content: String)

object CommentOutput {

  implicit def commentToOutput(comment: Comment): CommentOutput = {
    CommentOutput(id = comment.id.get,
                  content = comment.content
    )
  }
}