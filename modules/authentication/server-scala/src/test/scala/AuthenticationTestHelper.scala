import akka.http.scaladsl.server.Route
import app.{AuthenticationModule, UserModule}
import repositories._

import scala.concurrent.{Await, Future}
import scala.concurrent.duration.Duration

trait AuthenticationTestHelper extends TestHelper {

  val routes: Route = routesWithGraphQLSchema[AuthenticationModule]

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
