package graphql.schema

import common.Logger
import common.graphql.UserContext
import graphql.resolvers.JwtResolver
import javax.inject.Inject
import jwt.model.Tokens
import sangria.macros.derive.{ObjectTypeName, deriveObjectType}
import sangria.schema.{Argument, Field, ObjectType, StringType}

class JwtSchema @Inject()(tokenResolver: JwtResolver) extends Logger {

  implicit val tokens: ObjectType[UserContext, Tokens] = deriveObjectType(ObjectTypeName("Tokens"))

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "refreshTokens",
      fieldType = tokens,
      arguments = List(Argument("refreshToken", StringType)),
      resolve = sc => tokenResolver.refreshTokens(sc.args.arg[String]("refreshToken"))
    )
  )
}
