package app

import common.graphql.UserContext
import common.slick.SchemaInitializer
import core.guice.injection.InjectorProvider._
import graphql.schema.AuthenticationSchema
import guice.AuthenticationBinding
import jwt.graphql.schema.JwtSchema
import repositories._
import sangria.schema.Field
import shapes.ServerModule
import shapes.graphql.GraphQLSchemaExtension

import scala.collection.mutable

class AuthenticationModule extends ServerModule[UserContext, SchemaInitializer[_]] {

  lazy val authenticationSchema: AuthenticationSchema = inject[AuthenticationSchema]
  lazy val tokenSchema: JwtSchema = inject[JwtSchema]
  lazy val facebookAuthSchemaInitializer: FacebookAuthSchemaInitializer = inject[FacebookAuthSchemaInitializer]
  lazy val githubAuthSchemaInitializer: GithubAuthSchemaInitializer = inject[GithubAuthSchemaInitializer]
  lazy val googleAuthSchemaInitializer: GoogleAuthSchemaInitializer = inject[GoogleAuthSchemaInitializer]
  lazy val linkedinAuthSchemaInitializer: LinkedinAuthSchemaInitializer = inject[LinkedinAuthSchemaInitializer]
  lazy val certificateAuthSchemaInitializer: CertificateAuthSchemaInitializer = inject[CertificateAuthSchemaInitializer]

  override lazy val slickSchemas: mutable.HashSet[SchemaInitializer[_]] = mutable.HashSet(
    facebookAuthSchemaInitializer,
    githubAuthSchemaInitializer,
    googleAuthSchemaInitializer,
    linkedinAuthSchemaInitializer,
    certificateAuthSchemaInitializer
  )
  override lazy val queries: mutable.HashSet[Field[UserContext, Unit]] =
    mutable.HashSet(authenticationSchema.queries: _*)
  override lazy val mutations: mutable.HashSet[Field[UserContext, Unit]] =
    mutable.HashSet(authenticationSchema.mutations ++ tokenSchema.mutations: _*)
  override lazy val extensions: mutable.HashSet[GraphQLSchemaExtension[UserContext]] =
    mutable.HashSet(authenticationSchema.extension)

  bindings = new AuthenticationBinding
}
