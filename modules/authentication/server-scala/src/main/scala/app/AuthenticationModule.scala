package app

import com.google.inject.Inject
import common.shapes.ServerModule
import graphql.schema.{AuthenticationSchema, TokenSchema}
import repositories._

class AuthenticationModule @Inject()(authenticationSchema: AuthenticationSchema,
                                     tokenSchema: TokenSchema,
                                     facebookAuthSchemaInitializer: FacebookAuthSchemaInitializer,
                                     githubAuthSchemaInitializer: GithubAuthSchemaInitializer,
                                     googleAuthSchemaInitializer: GoogleAuthSchemaInitializer,
                                     linkedinAuthSchemaInitializer: LinkedinAuthSchemaInitializer,
                                     certificateAuthSchemaInitializer: CertificateAuthSchemaInitializer) extends ServerModule {

  slickSchemas ++= facebookAuthSchemaInitializer ::
    githubAuthSchemaInitializer ::
    googleAuthSchemaInitializer ::
    linkedinAuthSchemaInitializer ::
    certificateAuthSchemaInitializer :: Nil

  queries ++= authenticationSchema.queries

  mutations ++= authenticationSchema.mutations ++ tokenSchema.mutations

  extensions += authenticationSchema.extension
}