package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.graphql.DispatcherResolver.resolveWithDispatcher
import common.{InputUnmarshallerGenerator, Logger}
import core.graphql.{GraphQLSchema, UserContext}
import graphql.resolvers.TokenResolver
import javax.inject.Inject
import model.Tokens
import sangria.macros.derive.{ObjectTypeName, deriveObjectType}
import sangria.schema.{Argument, Field, ObjectType, StringType}

import scala.concurrent.Future

class TokenSchema @Inject()(implicit val materializer: ActorMaterializer,
                            actorSystem: ActorSystem) extends GraphQLSchema
  with InputUnmarshallerGenerator
  with Logger {

  implicit val tokens: ObjectType[UserContext, Tokens] = deriveObjectType(ObjectTypeName("Tokens"))

  override def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "refreshTokens",
      fieldType = tokens,
      arguments = List(Argument("refreshToken", StringType)),
      resolve = sc => resolveWithDispatcher[Tokens](
        input = sc.args.arg[String]("refreshToken"),
        userContext = sc.ctx,
        onException = e => Future.failed(e),
        namedResolverActor = TokenResolver
      )
    )
  )
}