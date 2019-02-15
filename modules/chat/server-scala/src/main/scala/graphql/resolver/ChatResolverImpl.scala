package graphql.resolver

import java.nio.file.Files
import java.util.UUID

import akka.http.scaladsl.model.Multipart.FormData
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.{FileIO, Sink, Source}
import com.google.inject.Inject
import common.Logger
import common.actors.ActorMessageDelivering
import common.errors.NotFound
import common.implicits.RichDBIO._
import common.implicits.RichFuture._
import models._
import repositories.ChatRepository
import repositories.PublicResources._

import scala.concurrent.{ExecutionContext, Future}

class ChatResolverImpl @Inject()(chatRepository: ChatRepository)(
    implicit val executionContext: ExecutionContext,
    materializer: ActorMaterializer
) extends ChatResolver
  with Logger
  with ActorMessageDelivering {

  override def addMessage(input: AddMessageInput, parts: Source[FormData.BodyPart, Any]): Future[Message] =
    for {
      maybeAttachments <- parts.filter(_.filename.nonEmpty).runWith(Sink.seq)
      isEmpty = maybeAttachments.isEmpty
      maybeMessage <- if (isEmpty) {
        chatRepository
          .saveMessage(
            message = DbMessage(
              text = input.text,
              userId = input.userId,
              uuid = input.uuid,
              quotedId = input.quotedId
            )
          )
          .run
      } else {
        parts
          .filter(_.filename.nonEmpty)
          .mapAsync(1) {
            part =>
              val hashedFilename = append(part.filename.get)
              if (!publicDirPath.toFile.exists) Files.createDirectory(publicDirPath)
              part.entity.dataBytes.runWith(FileIO.toPath(publicDirPath.resolve(hashedFilename))).map {
                ioResult =>
                  Some(
                    MessageAttachment(
                      messageId = 0,
                      name = part.filename.get,
                      contentType = part.entity.contentType.toString,
                      size = ioResult.count.toInt,
                      path = s"public/$hashedFilename"
                    )
                  )
              }
          }
          .mapAsync(1) {
            attachment =>
              chatRepository
                .saveMessage(
                  DbMessage(
                    text = input.text,
                    userId = input.userId,
                    uuid = input.uuid,
                    quotedId = input.quotedId
                  ),
                  attachment
                )
                .run
          }
          .runWith(Sink.head)
      }
    } yield maybeMessage

  override def editMessage(input: EditMessageInput): Future[Message] =
    for {
      updatedMessage <- chatRepository.editMessage(input.id, input.text, input.userId).run
    } yield updatedMessage

  override def deleteMessage(id: Int): Future[Message] =
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

  def append(str: String): String = UUID.randomUUID.toString.take(9) + str
}
