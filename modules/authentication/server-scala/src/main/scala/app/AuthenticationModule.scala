package app

import com.google.inject.Inject
import common.shapes.ServerModule
import graphql.schema.AuthenticationSchema
import repositories._

class AuthenticationModule @Inject()(authenticationSchema: AuthenticationSchema,
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

  mutations ++= authenticationSchema.mutations

  extensions += authenticationSchema.extension
}