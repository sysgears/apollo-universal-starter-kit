package model

case class PostOutput(id: Int,
                      title: String,
                      content: String,
                      comments: Seq[Comment] = Seq.empty)

object PostOutput {

  implicit def postToOutput(post: Post): PostOutput = {
    PostOutput(id = post.id.get,
               title = post.title,
               content = post.content
    )
  }
}