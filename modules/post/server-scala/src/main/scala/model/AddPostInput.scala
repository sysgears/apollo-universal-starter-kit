package model

case class AddPostInput(title: String, content: String)

object AddPostInput {

  implicit def inputToPost(input: AddPostInput): Post = {
    Post(title = input.title, content = input.content)
  }
}
