import akka.http.scaladsl.server.Route
import app.UserModule
import com.google.inject.Guice
import core.guice.bindings.CoreBinding
import guice.{MailBinding, UserBinding}
import net.codingwell.scalaguice.ScalaModule
import repositories.UserSchemaInitializer
import repositories.auth.{FacebookAuthSchemaInitializer, GithubAuthSchemaInitializer, GoogleAuthSchemaInitializer, LinkedinAuthSchemaInitializer}
import scala.collection.JavaConverters._
import app.{AuthenticationModule, UserModule}
import repositories._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait UserHelper extends TestHelper {

  val bindings: Seq[ScalaModule] = Seq(new UserBinding, new CoreBinding, new MailBinding)
  Guice.createInjector(bindings.asJava)
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
