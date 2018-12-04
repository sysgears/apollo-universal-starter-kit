package graphql.schema

import common.InputUnmarshallerGenerator
import core.graphql.{GraphQLSchema, UserContext}
import graphql.resolvers.PostResolver
import javax.inject.Inject
import model._
import sangria.macros.derive._
import sangria.schema.{Argument, Field, InputObjectType, IntType, ListType, ObjectType}

import scala.concurrent.Future

class PostSchema @Inject()(postResolver: PostResolver) extends GraphQLSchema
  with InputUnmarshallerGenerator {

  import types.unmarshallers._

  object Types {

    implicit val comment: ObjectType[Unit, Comment] = deriveObjectType(ObjectTypeName("Comment"), ExcludeFields("postId"))
    implicit val post: ObjectType[Unit, Post] = deriveObjectType(ObjectTypeName("Post"), AddFields(
      Field(name = "comments",
            fieldType = ListType(Types.comment),
            resolve = { ctx => postResolver.getComments(ctx.value.id.get) /*TODO: Unsafe*/  }
      )
    ))

    implicit val addPostInput: InputObjectType[AddPostInput] = deriveInputObjectType(InputObjectTypeName("AddPostInput"))
    implicit val editPostInput: InputObjectType[EditPostInput] = deriveInputObjectType(InputObjectTypeName("EditPostInput"))
    implicit val addCommentInput: InputObjectType[AddCommentInput] = deriveInputObjectType(InputObjectTypeName("AddCommentInput"))
    implicit val editCommentInput: InputObjectType[EditCommentInput] = deriveInputObjectType(InputObjectTypeName("EditCommentInput"))
    implicit val deleteCommentInput: InputObjectType[DeleteCommentInput] = deriveInputObjectType(InputObjectTypeName("DeleteCommentInput"))

    implicit val updatePostPayloadOutput: ObjectType[Unit, UpdatePostPayload] = deriveObjectType(ObjectTypeName("UpdatePostPayload"))
    implicit val updateCommentPayloadOutput: ObjectType[Unit, UpdateCommentPayload] = deriveObjectType(ObjectTypeName("UpdateCommentPayload"))
  }

  override def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "post",
      fieldType = Types.post,
      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
      resolve = { ctx => postResolver.post(ctx.args.arg("id")) }
    ),
    Field(
      name = "posts",
      fieldType = Types.post,
      arguments = Argument(name = "limit", argumentType = IntType) ::
                  Argument(name = "after", argumentType = IntType) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    )
  )

  override def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "addPost",
      fieldType = Types.post,
      arguments = Argument(name = "input", argumentType = Types.addPostInput) :: Nil,
      resolve = { ctx => postResolver.addPost(input = ctx.args.arg[AddPostInput]("input")) }
    ),
    Field(
      name = "deletePost",
      fieldType = Types.post,
      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "editPost",
      fieldType = Types.post,
      arguments = Argument(name = "input", argumentType = Types.editPostInput) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "addComment",
      fieldType = Types.comment,
      arguments = Argument(name = "input", argumentType = Types.addCommentInput) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "editComment",
      fieldType = Types.comment,
      arguments = Argument(name = "input", argumentType = Types.editCommentInput) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "deleteComment",
      fieldType = Types.comment,
      arguments = Argument(name = "input", argumentType = Types.deleteCommentInput) :: Nil,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    )
  )

//  override def subscriptions: List[Field[UserContext, Unit]] = List(
//    Field(
//      name = "postUpdated",
//      fieldType = Types.updatePostPayloadOutput,
//      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
//      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
//    ),
//    Field(
//      name = "postsUpdated",
//      fieldType = Types.updatePostPayloadOutput,
//      arguments = Argument(name = "endCursor", argumentType = IntType) :: Nil,
//      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
//    ),
//    Field(
//      name = "commentUpdated",
//      fieldType = Types.updateCommentPayloadOutput,
//      arguments = Argument(name = "postId", argumentType = IntType) :: Nil,
//      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
//    )
//  )
}
