package graphql.resolver

import java.nio.file.{Files, Path, Paths}

import akka.http.scaladsl.model.Multipart.FormData
import akka.stream.scaladsl.Source
import graphql.resolver.PublicResources._
import com.google.inject.Inject
import common.Logger
import common.actors.ActorMessageDelivering
import common.errors.NotFound
import common.implicits.RichDBIO._
import common.implicits.RichFuture._
import models._
import repositories.ChatRepository

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ChatResolverImpl @Inject()(chatRepository: ChatRepository)
  extends ChatResolver
  with Logger
  with ActorMessageDelivering {

  override def addMessage(input: AddMessageInput, parts: Source[FormData.BodyPart, Any]): Future[Message] = ???

  override def editMessage(input: EditMessageInput): Future[Message] =
    for {
      updatedMessage <- chatRepository.editMessage(input.id, input.text, input.userId).run
    } yield updatedMessage

  override def deleteMessage(id: Int): Future[Option[Message]] =
    for {
      deleteResult <- chatRepository.deleteMessage(id).run
    } yield deleteResult

  override def messages(limit: Int, after: Int): Future[Messages] =
    for {
      paginatedResult <- chatRepository.messagesPaginated(limit, after).run
    } yield paginatedResult

  override def message(id: Int): Future[Option[Message]] =
    for {
      maybeMessage <- chatRepository.findMessage(id).run
    } yield maybeMessage

  override def findQuotedMessage(id: Option[Int]): Future[Option[QuotedMessage]] = {
    for {
      maybeId <- Future(id) failOnNone NotFound("ID isn`t defined")
      maybeQuotedMessage <- chatRepository.findQuotedMessage(maybeId).run
    } yield maybeQuotedMessage
  }.recover {
    case _: NotFound => None
  }

  def deleteFile(path: String): Boolean = Files.deleteIfExists(resourcesDirPath.resolve(path))
}

object PublicResources {
  val resourcesDirPath: Path = Paths.get(getClass.getResource("/").getPath)
  val publicDirPath: Path = resourcesDirPath.resolve("public")
}
