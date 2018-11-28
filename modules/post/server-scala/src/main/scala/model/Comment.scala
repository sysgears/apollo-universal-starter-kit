package model

case class Comment(id: Option[Int] = None,
                   content: String,
                   postId: Int)
