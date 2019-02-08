import akka.http.scaladsl.server.Route
import app.ChatModule
import com.google.inject.Guice
import common.implicits.RichDBIO._
import core.guice.bindings.CoreBinding
import guice.ChatBinding
import model.User
import models.{DbMessage, Message}
import net.codingwell.scalaguice.ScalaModule
import repositories._

import scala.collection.JavaConverters._
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait ChatHelper extends TestHelper {

  val bindings: Seq[ScalaModule] = Seq(new CoreBinding, new ChatBinding)
  Guice.createInjector(bindings.asJava)
  val routes: Route = routesWithGraphQLSchema(new ChatModule())

  val dbMessageInitializer: DbMessageSchemaInitializer = inject[DbMessageSchemaInitializer]
  val attachmentInitializer: MessageAttachmentSchemaInitializer = inject[MessageAttachmentSchemaInitializer]

  lazy val userSchemaInitializer: UserSchemaInitializer = inject[UserSchemaInitializer]
  lazy val userProfileSchemaInitializer: UserProfileSchemaInitializer = inject[UserProfileSchemaInitializer]

  val userRepo: UserRepository = inject[UserRepository]
  val chatRepo: ChatRepository = inject[ChatRepository]

  override def beforeEach() {
    clean()
    dropDb()
    initDb()
    seedDatabase
  }

  override protected def afterEach() {
    dropDb()
    initDb()
  }

  protected def seedDatabase = {
    await(
      userRepo
        .save(
          User(
            Some(1),
            "testUser",
            "mock@test.com",
            "12345password",
            "admin",
            true
          )
        )
        .run
    )

    val messageList: List[Message] = List
      .range(1, 5)
      .map(
        num =>
          Message(
            id = num,
            text = s"Message text #[$num]",
            uuid = Some("dfvlrkjgimneo12ldms345")
        )
      )
    messageList.map(
      message =>
        await(
          chatRepo
            .saveMessage(
              message = DbMessage(
                id = Some(message.id),
                text = message.text,
                userId = Some(1),
                uuid = message.uuid,
                quotedId = message.quotedId
              )
            )
            .run
      )
    )
  }

  def clean(): Unit = ()

  private def initDb(): Unit = {
    await(dbMessageInitializer.create())
    await(attachmentInitializer.create())
    await(userSchemaInitializer.create())
    await(userProfileSchemaInitializer.create())
  }

  private def dropDb(): Unit = {
    await(dbMessageInitializer.drop())
    await(attachmentInitializer.drop())
    await(userProfileSchemaInitializer.drop())
    await(userSchemaInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}
