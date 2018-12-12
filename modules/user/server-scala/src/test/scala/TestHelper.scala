import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import core.controllers.graphql.GraphQLController
import core.guice.injection.Injecting
import org.scalamock.scalatest.MockFactory
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, Matchers, WordSpec}
import repositories.UserSchemaInitializer
import repositories.auth.{FacebookAuthSchemaInitializer, GithubAuthSchemaInitializer, GoogleAuthSchemaInitializer, LinkedinAuthSchemaInitializer}

import scala.concurrent.{Await, Future}
import scala.concurrent.duration.Duration

trait TestHelper extends WordSpec
  with ScalatestRouteTest
  with BeforeAndAfter
  with BeforeAndAfterAll
  with Injecting
  with Matchers
  with MockFactory {

  val endpoint: String = "/graphql"
  val routes: Route = inject[GraphQLController].routes

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
    await(userInitializer.drop())
    await(googleAuthInitializer.drop())
    await(githubAuthInitializer.drop())
    await(facebookAuthInitializer.drop())
    await(linkedinAuthInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}
