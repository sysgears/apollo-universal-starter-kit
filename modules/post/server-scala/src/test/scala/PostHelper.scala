import app.PostModule
import guice.CommentBinding
import guice.PostBinding
import repositories.{CommentSchemaInitializer, PostSchemaInitializer}
import akka.http.scaladsl.server.Route
import com.google.inject.Guice
import core.guice.bindings.CoreBinding
import guice.ItemBinding
import net.codingwell.scalaguice.ScalaModule
import scala.collection.JavaConverters._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait PostHelper extends TestHelper {

  val bindings: Seq[ScalaModule] = Seq(new PostBinding, new CommentBinding, new CoreBinding, new ItemBinding)
  Guice.createInjector(bindings.asJava)
  val routes: Route = routesWithGraphQLSchema(new PostModule())
  val postInitializer: PostSchemaInitializer = inject[PostSchemaInitializer]
  val commentInitializer: CommentSchemaInitializer = inject[CommentSchemaInitializer]

  def clean(): Unit = ()

  protected def initDb(): Unit = {
    await(postInitializer.create())
    await(commentInitializer.create())
  }

  protected def dropDb(): Unit = {
    await(postInitializer.drop())
    await(commentInitializer.drop())
  }

  /**
    * Retrieves a value from the future for checking for testing purposes.
    */
  implicit def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}