package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.InputUnmarshallerGenerator
import common.graphql.DispatcherResolver.resolveWithDispatcher
import core.graphql.{GraphQLSchema, UserContext}
import core.services.publisher.PubSubService
import core.services.publisher.RichPubSubService._
import graphql.resolvers
import graphql.resolvers._
import javax.inject.Inject
import model._
import sangria.macros.derive._
import sangria.schema.{Argument, Field, InputObjectType, IntType, ListType, ObjectType}

import scala.concurrent.{ExecutionContext, Future}

class PostSchema @Inject()(implicit val pubSubPostService: PubSubService[Post],
                           implicit val pubSubCommentService: PubSubService[Comment],
                           implicit val materializer: ActorMaterializer,
                           actorSystem: ActorSystem,
                           executionContext: ExecutionContext) extends GraphQLSchema
  with InputUnmarshallerGenerator {

  import types.unmarshallers._

  object Types {

    implicit val comment: ObjectType[UserContext, Comment] = deriveObjectType(ObjectTypeName("Comment"), ExcludeFields("postId"))
    implicit val post: ObjectType[UserContext, Post] = deriveObjectType(ObjectTypeName("Post"), AddFields(
      Field(name = "comments",
        fieldType = ListType(Types.comment),
        resolve = { sc =>
          sc.value.id.map(id =>
            resolveWithDispatcher[Seq[Comment]](
              input = QueryComments(id),
              userContext = sc.ctx,
              namedResolverActor = CommentResolver
            )
          ).getOrElse(Future.successful(Seq.empty[Comment]))
        }
      )
    ))

    implicit val posts: ObjectType[Unit, Posts] = deriveObjectType(ObjectTypeName("Posts"))
    implicit val postEdges: ObjectType[Unit, PostEdges] = deriveObjectType(ObjectTypeName("PostEdges"))
    implicit val postPageInfo: ObjectType[Unit, PostPageInfo] = deriveObjectType(ObjectTypeName("PostPageInfo"))

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
      resolve = { sc =>
        resolveWithDispatcher[Post](
          input = QueryPost(sc.args.arg[Int]("id")),
          userContext = sc.ctx,
          namedResolverActor = PostResolver
        )
      }
    ),
    Field(
      name = "posts",
      fieldType = Types.posts,
      arguments = Argument(name = "limit", argumentType = IntType) ::
                  Argument(name = "after", argumentType = IntType) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Posts](
          input = QueryPosts(sc.args.arg("limit"), sc.args.arg("after")),
          userContext = sc.ctx,
          namedResolverActor = PostResolver
        )
      }
    )
  )

  override def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "addPost",
      fieldType = Types.post,
      arguments = Argument(name = "input", argumentType = Types.addPostInput) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Post](
          input = MutationAddPost(sc.args.arg[AddPostInput]("input")),
          userContext = sc.ctx,
          namedResolverActor = PostResolver
        )
      }
    ),
    Field(
      name = "deletePost",
      fieldType = Types.post,
      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Post](
          input = resolvers.MutationDeletePost(sc.args.arg("id")),
          userContext = sc.ctx,
          namedResolverActor = PostResolver
        )
      }
    ),
    Field(
      name = "editPost",
      fieldType = Types.post,
      arguments = Argument(name = "input", argumentType = Types.editPostInput) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Post](
          input = resolvers.MutationEditPost(sc.args.arg[EditPostInput]("input")),
          userContext = sc.ctx,
          namedResolverActor = PostResolver
        )
      }
    ),
    Field(
      name = "addComment",
      fieldType = Types.comment,
      arguments = Argument(name = "input", argumentType = Types.addCommentInput) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Comment](
          input = resolvers.MutationAddComment(sc.args.arg[AddCommentInput]("input")),
          userContext = sc.ctx,
          namedResolverActor = CommentResolver
        )
      }
    ),
    Field(
      name = "editComment",
      fieldType = Types.comment,
      arguments = Argument(name = "input", argumentType = Types.editCommentInput) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Comment](
          input = resolvers.MutationEditComment(sc.args.arg[EditCommentInput]("input")),
          userContext = sc.ctx,
          namedResolverActor = CommentResolver
        )
      }
    ),
    Field(
      name = "deleteComment",
      fieldType = Types.comment,
      arguments = Argument(name = "input", argumentType = Types.deleteCommentInput) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Comment](
          input = resolvers.MutationDeleteComment(sc.args.arg[DeleteCommentInput]("input")),
          userContext = sc.ctx,
          namedResolverActor = CommentResolver
        )
      }
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
