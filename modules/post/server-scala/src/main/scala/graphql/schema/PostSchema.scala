package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import services.publisher._
import common.{InputUnmarshallerGenerator, Logger}
import common.graphql.DispatcherResolver.resolveWithDispatcher
import common.graphql.UserContext
import common.publisher.PublishElement
import graphql.resolvers
import graphql.resolvers._
import javax.inject.Inject
import model._
import sangria.macros.derive._
import sangria.schema.{Argument, Field, InputObjectType, IntType, ListType, ObjectType, OptionInputType, OptionType}
import sangria.macros.derive.{ExcludeFields, ObjectTypeName, deriveObjectType}
import sangria.streaming.akkaStreams._
import common.publisher.RichPubSubService._

import scala.concurrent.{ExecutionContext, Future}

class PostSchema @Inject()(implicit val postPubSubPostService: PostPubSubServiceImpl,
                            implicit val commentPubSubPostService: CommentPubSubServiceImpl,
                            implicit val materializer: ActorMaterializer,
                            actorSystem: ActorSystem,
                            executionContext: ExecutionContext) extends InputUnmarshallerGenerator
  with Logger {

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

  def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "post",
      fieldType = OptionType(Types.post),
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
      fieldType = OptionType(Types.posts),
      arguments = Argument(name = "limit", argumentType = OptionInputType(IntType)) :: //TODO Unsafe (without default value)
                  Argument(name = "after", argumentType = OptionInputType(IntType)) :: Nil, //TODO Unsafe (without default value)
      resolve = { sc =>
        resolveWithDispatcher[Posts](
          input = QueryPosts(sc.args.arg("limit"), sc.args.arg("after")),
          userContext = sc.ctx,
          namedResolverActor = PostResolver
        )
      }
    )
  )

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "addPost",
      fieldType = OptionType(Types.post),
      arguments = Argument(name = "input", argumentType = Types.addPostInput) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Post](
          input = MutationAddPost(sc.args.arg[AddPostInput]("input")),
          userContext = sc.ctx,
          namedResolverActor = PostResolver
        ).map(post =>
          PublishElement(triggerName = "addPost", element = post))
          .pub
          .map(_.element)
      }
    ),
    Field(
      name = "deletePost",
      fieldType = OptionType(Types.post),
      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Post](
          input = resolvers.MutationDeletePost(sc.args.arg("id")),
          userContext = sc.ctx,
          namedResolverActor = PostResolver
        ).map(post =>
          PublishElement(triggerName = "deletePost", element = post))
          .pub
          .map(_.element)
      }
    ),
    Field(
      name = "editPost",
      fieldType = OptionType(Types.post),
      arguments = Argument(name = "input", argumentType = Types.editPostInput) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Post](
          input = resolvers.MutationEditPost(sc.args.arg[EditPostInput]("input")),
          userContext = sc.ctx,
          namedResolverActor = PostResolver
        ).map(post =>
          PublishElement(triggerName = "editPost", element = post))
          .pub
          .map(_.element)
      }
    ),
    Field(
      name = "addComment",
      fieldType = OptionType(Types.comment),
      arguments = Argument(name = "input", argumentType = Types.addCommentInput) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Comment](
          input = resolvers.MutationAddComment(sc.args.arg[AddCommentInput]("input")),
          userContext = sc.ctx,
          namedResolverActor = CommentResolver
        ).map(comment =>
          PublishElement(triggerName = "addComment", element = comment))
          .pub
          .map(_.element)
      }
    ),
    Field(
      name = "editComment",
      fieldType = OptionType(Types.comment),
      arguments = Argument(name = "input", argumentType = Types.editCommentInput) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Comment](
          input = resolvers.MutationEditComment(sc.args.arg[EditCommentInput]("input")),
          userContext = sc.ctx,
          namedResolverActor = CommentResolver
        ).map(comment =>
          PublishElement(triggerName = "editComment", element = comment))
          .pub
          .map(_.element)
      }
    ),
    Field(
      name = "deleteComment",
      fieldType = OptionType(Types.comment),
      arguments = Argument(name = "input", argumentType = Types.deleteCommentInput) :: Nil,
      resolve = { sc =>
        resolveWithDispatcher[Comment](
          input = resolvers.MutationDeleteComment(sc.args.arg[DeleteCommentInput]("input")),
          userContext = sc.ctx,
          namedResolverActor = CommentResolver
        ).map(comment =>
          PublishElement(triggerName = "deleteComment", element = comment))
          .pub
          .map(_.element)
      }
    )
  )

  def subscriptions: List[Field[UserContext, Unit]] = List(
    Field.subs(
      name = "postUpdated",
      fieldType = OptionType(Types.updatePostPayloadOutput),
      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
      resolve = sc => {
        val id = sc.args.arg[Int]("id")
        postPubSubPostService.subscribe(Seq("editPost", "deletePost"), Seq(EntityId(id)))
          .map(action => action.map(publishElement => {
            UpdatePostPayload(mutation = publishElement.triggerName, id = publishElement.element.id.get.toString, node = publishElement.element)
          }
          ))
      }
    ),
    Field.subs(
      name = "postsUpdated",
      fieldType = OptionType(Types.updatePostPayloadOutput),
      arguments = Argument(name = "endCursor", argumentType = IntType) :: Nil,
      resolve = sc => {
        val endCursor = sc.args.arg[Int]("endCursor")
        postPubSubPostService.subscribe(Seq("addPost", "editPost", "deletePost"), Seq(EndCursor(endCursor)))
          .map(action => action.map(publishElement => {
            UpdatePostPayload(mutation = publishElement.triggerName, id = publishElement.element.id.get.toString, node = publishElement.element)
          }
          ))
      }
    ),
    Field.subs(
      name = "commentUpdated",
      fieldType = OptionType(Types.updateCommentPayloadOutput),
      arguments = Argument(name = "postId", argumentType = IntType) :: Nil,
      resolve = sc => {
        val postId = sc.args.arg[Int]("postId")
        commentPubSubPostService.subscribe(Seq("editComment", "deleteComment"), Seq(PostId(id = postId)))
          .map(action => action.map(publishElement => {
            UpdateCommentPayload(mutation = publishElement.triggerName, id = publishElement.element.id.get, postId = postId, node = publishElement.element)
          }
          ))
      }
    )
  )
}
