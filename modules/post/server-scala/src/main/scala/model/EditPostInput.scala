package model

case class EditPostInput(id: Int, title: String, content: String)

object EditPostInput {

  implicit def inputToPost(input: EditPostInput): Post = {
    Post(id = Some(input.id), title = input.title, content = input.content)
  }
}
