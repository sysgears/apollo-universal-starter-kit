package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import services.publisher._
import common.{InputUnmarshallerGenerator, Logger}
import common.graphql.DispatcherResolver.resolveWithDispatcher
import common.graphql.UserContext
import common.publisher.{Event, PubSubService}
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

class PostSchema @Inject()(
    implicit val postPubSubService: PubSubService[Event[Post]],
    commentPubSubService: PubSubService[Event[Comment]],
    materializer: ActorMaterializer,
    actorSystem: ActorSystem,
    executionContext: ExecutionContext
) extends InputUnmarshallerGenerator
  with Logger {

  object Types {

    implicit val comment: ObjectType[UserContext, Comment] =
      deriveObjectType(ObjectTypeName("Comment"), ExcludeFields("postId"))
    implicit val post: ObjectType[UserContext, Post] = deriveObjectType(
      ObjectTypeName("Post"),
      AddFields(
        Field(
          name = "comments",
          fieldType = ListType(comment),
          resolve = {
            sc =>
              sc.value.id
                .map(
                  id =>
                    resolveWithDispatcher[Seq[Comment]](
                      input = QueryComments(id),
                      userContext = sc.ctx,
                      namedResolverActor = CommentResolver
                  )
                )
                .getOrElse(Future.successful(Seq.empty[Comment]))
          }
        )
      )
    )

    implicit val posts: ObjectType[Unit, Posts] = deriveObjectType(ObjectTypeName("Posts"))
    implicit val postEdges: ObjectType[Unit, PostEdges] = deriveObjectType(ObjectTypeName("PostEdges"))
    implicit val postPageInfo: ObjectType[Unit, PostPageInfo] = deriveObjectType(ObjectTypeName("PostPageInfo"))

    implicit val addPostInput: InputObjectType[AddPostInput] = deriveInputObjectType(
      InputObjectTypeName("AddPostInput")
    )
    implicit val editPostInput: InputObjectType[EditPostInput] = deriveInputObjectType(
      InputObjectTypeName("EditPostInput")
    )
    implicit val addCommentInput: InputObjectType[AddCommentInput] = deriveInputObjectType(
      InputObjectTypeName("AddCommentInput")
    )
    implicit val editCommentInput: InputObjectType[EditCommentInput] = deriveInputObjectType(
      InputObjectTypeName("EditCommentInput")
    )
    implicit val deleteCommentInput: InputObjectType[DeleteCommentInput] = deriveInputObjectType(
      InputObjectTypeName("DeleteCommentInput")
    )

    implicit val updatePostPayloadOutput: ObjectType[Unit, UpdatePostPayload] = deriveObjectType(
      ObjectTypeName("UpdatePostPayload")
    )
    implicit val updateCommentPayloadOutput: ObjectType[Unit, UpdateCommentPayload] = deriveObjectType(
      ObjectTypeName("UpdateCommentPayload")
    )
  }

  object Names {

    final val POST = "post"
    final val POSTS = "posts"

    final val ADD_POST = "addPost"
    final val DELETE_POST = "deletePost"
    final val EDIT_POST = "editPost"
    final val ADD_COMMENT = "addComment"
    final val EDIT_COMMENT = "editComment"
    final val DELETE_COMMENT = "deleteComment"

    final val POST_UPDATED = "postUpdated"
    final val POSTS_UPDATED = "postsUpdated"
    final val COMMENT_UPDATED = "commentUpdated"
  }

  import marshalling.Unmarshallers._
  import Names._
  import Types._

  def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = POST,
      fieldType = OptionType(post),
      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
      resolve = {
        sc =>
          resolveWithDispatcher[Post](
            input = QueryPost(sc.args.arg[Int]("id")),
            userContext = sc.ctx,
            namedResolverActor = PostResolver
          )
      }
    ),
    Field(
      name = POSTS,
      fieldType = OptionType(posts),
      arguments = Argument(name = "limit", argumentType = OptionInputType(IntType)) ::
        Argument(name = "after", argumentType = OptionInputType(IntType)) :: Nil,
      resolve = {
        sc =>
          val limit: Option[Int] = sc.argOpt("limit")
          val after: Option[Int] = sc.argOpt("after")
          resolveWithDispatcher[Posts](
            input = QueryPosts(limit.getOrElse(10), after.getOrElse(0)),
            userContext = sc.ctx,
            namedResolverActor = PostResolver
          )
      }
    )
  )

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = ADD_POST,
      fieldType = OptionType(post),
      arguments = Argument(name = "input", argumentType = Types.addPostInput) :: Nil,
      resolve = {
        sc =>
          resolveWithDispatcher[Post](
            input = MutationAddPost(sc.args.arg[AddPostInput]("input")),
            userContext = sc.ctx,
            namedResolverActor = PostResolver
          ).pub(ADD_POST)
      }
    ),
    Field(
      name = DELETE_POST,
      fieldType = OptionType(post),
      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
      resolve = {
        sc =>
          resolveWithDispatcher[Post](
            input = resolvers.MutationDeletePost(sc.args.arg("id")),
            userContext = sc.ctx,
            namedResolverActor = PostResolver
          ).pub(DELETE_POST)
      }
    ),
    Field(
      name = EDIT_POST,
      fieldType = OptionType(post),
      arguments = Argument(name = "input", argumentType = Types.editPostInput) :: Nil,
      resolve = {
        sc =>
          resolveWithDispatcher[Post](
            input = resolvers.MutationEditPost(sc.args.arg[EditPostInput]("input")),
            userContext = sc.ctx,
            namedResolverActor = PostResolver
          ).pub(EDIT_POST)
      }
    ),
    Field(
      name = ADD_COMMENT,
      fieldType = OptionType(comment),
      arguments = Argument(name = "input", argumentType = Types.addCommentInput) :: Nil,
      resolve = {
        sc =>
          resolveWithDispatcher[Comment](
            input = resolvers.MutationAddComment(sc.args.arg[AddCommentInput]("input")),
            userContext = sc.ctx,
            namedResolverActor = CommentResolver
          ).pub(ADD_COMMENT)
      }
    ),
    Field(
      name = EDIT_COMMENT,
      fieldType = OptionType(comment),
      arguments = Argument(name = "input", argumentType = Types.editCommentInput) :: Nil,
      resolve = {
        sc =>
          resolveWithDispatcher[Comment](
            input = resolvers.MutationEditComment(sc.args.arg[EditCommentInput]("input")),
            userContext = sc.ctx,
            namedResolverActor = CommentResolver
          ).pub(EDIT_COMMENT)
      }
    ),
    Field(
      name = DELETE_COMMENT,
      fieldType = OptionType(comment),
      arguments = Argument(name = "input", argumentType = Types.deleteCommentInput) :: Nil,
      resolve = {
        sc =>
          resolveWithDispatcher[Comment](
            input = resolvers.MutationDeleteComment(sc.args.arg[DeleteCommentInput]("input")),
            userContext = sc.ctx,
            namedResolverActor = CommentResolver
          ).pub(DELETE_COMMENT)
      }
    )
  )

  def subscriptions: List[Field[UserContext, Unit]] = List(
    Field.subs(
      name = POST_UPDATED,
      fieldType = OptionType(updatePostPayloadOutput),
      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
      resolve = sc => {
        val id = sc.args.arg[Int]("id")
        postPubSubService
          .subscribe(Seq(EDIT_POST, DELETE_POST), Seq(EntityId(id)))
          .map(
            action =>
              action.map(publishElement => {
                UpdatePostPayload(
                  mutation = publishElement.name,
                  id = publishElement.element.id.get.toString,
                  node = publishElement.element
                )
              })
          )
      }
    ),
    Field.subs(
      name = POSTS_UPDATED,
      fieldType = OptionType(updatePostPayloadOutput),
      arguments = Argument(name = "endCursor", argumentType = IntType) :: Nil,
      resolve = sc => {
        val endCursor = sc.args.arg[Int]("endCursor")
        postPubSubService
          .subscribe(Seq(ADD_POST, EDIT_POST, DELETE_POST), Seq(EndCursor(endCursor)))
          .map(
            action =>
              action.map(event => {
                UpdatePostPayload(mutation = event.name, id = event.element.id.get.toString, node = event.element)
              })
          )
      }
    ),
    Field.subs(
      name = COMMENT_UPDATED,
      fieldType = OptionType(updateCommentPayloadOutput),
      arguments = Argument(name = "postId", argumentType = IntType) :: Nil,
      resolve = sc => {
        val postId = sc.args.arg[Int]("postId")
        commentPubSubService
          .subscribe(Seq(EDIT_COMMENT, DELETE_COMMENT), Seq(PostId(id = postId)))
          .map(
            action =>
              action.map(event => {
                UpdateCommentPayload(
                  mutation = event.name,
                  id = event.element.id.get,
                  postId = postId,
                  node = event.element
                )
              })
          )
      }
    )
  )
}
