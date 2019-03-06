import app.PostModule
import guice.CommentBinding
import guice.PostBinding
import repositories.{CommentRepository, CommentSchemaInitializer, PostRepository, PostSchemaInitializer}
import akka.http.scaladsl.server.Route
import com.google.inject.Guice
import core.guice.bindings.CoreBinding
import guice.ItemBinding
import net.codingwell.scalaguice.ScalaModule
import scala.collection.JavaConverters._
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
import common.implicits.RichDBIO._

trait PostHelper extends TestHelper {

  lazy val postRepo: PostRepository = inject[PostRepository]
  lazy val commentRepo: CommentRepository = inject[CommentRepository]

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

  protected def seedPostDatabase = {
    val posts = List
      .range(1, 6)
      .map(num => model.Post(id = Some(num), title = s"Post title #[$num]", content = s"Test post content. $num"))
    posts.map(post => await(postRepo.save(post).run))
  }

  protected def seedCommentDatabase = {
    val comments =
      List.range(1, 11).map(num => model.Comment(id = Some(num), content = s"Test comment. $num", postId = 1))
    comments.map(comment => await(commentRepo.save(comment).run))
  }

  override def beforeEach() {
    clean()
    dropDb()
    initDb()
    seedPostDatabase
    seedCommentDatabase
  }

  override protected def afterEach() {
    dropDb()
    initDb()
  }

  /**
    * Retrieves a value from the future for checking for testing purposes.
    */
  implicit def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}
