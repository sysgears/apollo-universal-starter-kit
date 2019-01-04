package graphql.schema.marshalling

import common.InputUnmarshallerGenerator
import model._
import sangria.marshalling.FromInput

object Unmarshallers extends InputUnmarshallerGenerator {

  implicit val addPostInputUnmarshaller: FromInput[AddPostInput] = inputUnmarshaller {
    input =>
      AddPostInput(
        title = input("title").asInstanceOf[String],
        content = input("content").asInstanceOf[String]
      )
  }

  implicit val editPostInputUnmarshaller: FromInput[EditPostInput] = inputUnmarshaller {
    input =>
      EditPostInput(
        id = input("id").asInstanceOf[Int],
        title = input("title").asInstanceOf[String],
        content = input("content").asInstanceOf[String]
      )
  }

  implicit val addCommentInputUnmarshaller: FromInput[AddCommentInput] = inputUnmarshaller {
    input =>
      AddCommentInput(
        postId = input("postId").asInstanceOf[Int],
        content = input("content").asInstanceOf[String]
      )
  }

  implicit val editCommentInputUnmarshaller: FromInput[EditCommentInput] = inputUnmarshaller {
    input =>
      EditCommentInput(
        id = input("id").asInstanceOf[Int],
        postId = input("postId").asInstanceOf[Int],
        content = input("content").asInstanceOf[String]
      )
  }

  implicit val deleteCommentInputUnmarshaller: FromInput[DeleteCommentInput] = inputUnmarshaller {
    input =>
      DeleteCommentInput(
        id = input("id").asInstanceOf[Int],
        postId = input("postId").asInstanceOf[Int]
      )
  }
}
