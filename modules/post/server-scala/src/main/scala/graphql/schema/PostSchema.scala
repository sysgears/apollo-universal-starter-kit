package graphql.schema

import common.InputUnmarshallerGenerator
import core.graphql.{GraphQLSchema, UserContext}
import graphql.resolvers.PostResolver
import javax.inject.Inject
import model._
import sangria.macros.derive._
import sangria.marshalling.FromInput
import sangria.schema.{Argument, Field, InputObjectType, IntType, ObjectType}

import scala.concurrent.Future

class PostSchema @Inject()(postResolver: PostResolver) extends GraphQLSchema
  with InputUnmarshallerGenerator {

  object Types {

    implicit val postOutput: ObjectType[Unit, PostOutput] = deriveObjectType(ObjectTypeName("Post"))
    implicit val commentOutput: ObjectType[Unit, Comment] = deriveObjectType(ObjectTypeName("Comment"))

    implicit val updatePostPayloadOutput: ObjectType[Unit, UpdatePostPayload] = deriveObjectType(ObjectTypeName("UpdatePostPayload"))
    implicit val updateCommentPayloadOutput: ObjectType[Unit, UpdateCommentPayload] = deriveObjectType(ObjectTypeName("UpdateCommentPayload"))

    implicit val addPostInput: InputObjectType[AddPostInput] = deriveInputObjectType(InputObjectTypeName("AddPostInput"))
    implicit val editPostInput: InputObjectType[EditPostInput] = deriveInputObjectType(InputObjectTypeName("EditPostInput"))
    implicit val addCommentInput: InputObjectType[AddCommentInput] = deriveInputObjectType(InputObjectTypeName("AddCommentInput"))
    implicit val editCommentInput: InputObjectType[EditCommentInput] = deriveInputObjectType(InputObjectTypeName("EditCommentInput"))
    implicit val deleteCommentInput: InputObjectType[DeleteCommentInput] = deriveInputObjectType(InputObjectTypeName("DeleteCommentInput"))
  }

  implicit val addPostInputUnmarshaller: FromInput[EditPostInput] = inputUnmarshaller {
    input =>
      EditPostInput(
        id = input("id").asInstanceOf[Int],
        title = input("title").asInstanceOf[String],
        content = input("content").asInstanceOf[String]
      )
  }

  implicit val editPostInputUnmarshaller: FromInput[AddPostInput] = inputUnmarshaller {
    input =>
      AddPostInput(
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

  override def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "post",
      fieldType = Types.postOutput,
      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
      resolve = { ctx => postResolver.post(ctx.args.arg("id")) }
    ),
    Field(
      name = "posts",
      fieldType = Types.postOutput,
      arguments = Argument(name = "limit", argumentType = IntType) ::
                  Argument(name = "after", argumentType = IntType) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    )
  )

  override def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "addPost",
      fieldType = Types.postOutput,
      arguments = Argument(name = "input", argumentType = Types.addPostInput) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "deletePost",
      fieldType = Types.postOutput,
      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "editPost",
      fieldType = Types.postOutput,
      arguments = Argument(name = "input", argumentType = Types.editPostInput) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "addComment",
      fieldType = Types.commentOutput,
      arguments = Argument(name = "input", argumentType = Types.addCommentInput) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "editComment",
      fieldType = Types.commentOutput,
      arguments = Argument(name = "input", argumentType = Types.editCommentInput) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "deleteComment",
      fieldType = Types.commentOutput,
      arguments = Argument(name = "input", argumentType = Types.deleteCommentInput) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    )
  )

  override def subscriptions: List[Field[UserContext, Unit]] = List(
    Field(
      name = "postUpdated",
      fieldType = Types.updatePostPayloadOutput,
      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "postsUpdated",
      fieldType = Types.updatePostPayloadOutput,
      arguments = Argument(name = "endCursor", argumentType = IntType) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "commentUpdated",
      fieldType = Types.updateCommentPayloadOutput,
      arguments = Argument(name = "postId", argumentType = IntType) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    )
  )
}
