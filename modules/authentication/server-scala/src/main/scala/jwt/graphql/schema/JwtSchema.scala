package jwt.graphql.schema

import common.graphql.UserContext
import common.Logger
import javax.inject.Inject
import jwt.graphql.resolvers.JwtResolver
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
