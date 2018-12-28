import akka.http.scaladsl.server.Route
import app.AuthenticationModule
import com.google.inject.Guice
import core.guice.bindings.CoreBinding
import guice.{AuthenticationBinding, MailBinding, UserBinding}
import net.codingwell.scalaguice.ScalaModule
import repositories.UserSchemaInitializer

import scala.collection.JavaConverters._
import repositories._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait AuthenticationTestHelper extends TestHelper {

  val bindings: Seq[ScalaModule] = Seq(new UserBinding, new CoreBinding, new MailBinding, new AuthenticationBinding)
  Guice.createInjector(bindings.asJava)

  val routes: Route = routesWithGraphQLSchema(new AuthenticationModule())

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
