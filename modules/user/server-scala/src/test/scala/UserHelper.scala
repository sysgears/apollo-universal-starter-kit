import akka.http.scaladsl.server.Route
import app.UserModule
import repositories.UserSchemaInitializer
import repositories.auth.{FacebookAuthSchemaInitializer, GithubAuthSchemaInitializer, GoogleAuthSchemaInitializer, LinkedinAuthSchemaInitializer}

import scala.concurrent.{Await, Future}
import scala.concurrent.duration.Duration

trait UserHelper extends TestHelper {

  val userInitializer: UserSchemaInitializer = inject[UserSchemaInitializer]
  val routes: Route = routesWithGraphQLSchemaFor[UserModule]

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
