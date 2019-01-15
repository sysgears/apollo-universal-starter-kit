import akka.http.scaladsl.server.Route
import app.{AuthenticationModule, MailModule, UserModule}
import com.google.inject.Guice
import common.graphql.UserContext
import common.slick.SchemaInitializer
import core.app.CoreModule
import repositories.UserSchemaInitializer

import repositories._
import shapes.ServerModule

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait AuthenticationTestHelper extends TestHelper {
  val modules = new ServerModule[UserContext, SchemaInitializer[_]](
    Seq(new CoreModule(), new MailModule(), new UserModule(), new AuthenticationModule())
  )
  Guice.createInjector(modules.foldBindings.bindings)

  val routes: Route = routesWithGraphQLSchema(modules.fold)

  val userInitializer: UserSchemaInitializer = inject[UserSchemaInitializer]
  val googleAuthInitializer: GoogleAuthSchemaInitializer = inject[GoogleAuthSchemaInitializer]
  val githubAuthInitializer: GithubAuthSchemaInitializer = inject[GithubAuthSchemaInitializer]
  val facebookAuthInitializer: FacebookAuthSchemaInitializer = inject[FacebookAuthSchemaInitializer]
  val linkedinAuthInitializer: LinkedinAuthSchemaInitializer = inject[LinkedinAuthSchemaInitializer]

  before {
    clean()
    dropDb()
    initDb()
  }

  after {
    dropDb()
    clean()
  }

  def clean(): Unit = ()

  private def initDb(): Unit = {
    await(userInitializer.create())
    await(googleAuthInitializer.create())
    await(githubAuthInitializer.create())
    await(facebookAuthInitializer.create())
    await(linkedinAuthInitializer.create())
  }

  private def dropDb(): Unit = {
    await(linkedinAuthInitializer.drop())
    await(facebookAuthInitializer.drop())
    await(githubAuthInitializer.drop())
    await(googleAuthInitializer.drop())
    await(userInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}
