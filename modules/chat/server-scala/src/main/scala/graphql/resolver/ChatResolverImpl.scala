package graphql.resolver

import akka.http.scaladsl.model.Multipart.FormData
import akka.stream.scaladsl.Source
import com.google.inject.Inject
import common.Logger
import common.actors.ActorMessageDelivering
import common.implicits.RichDBIO._
import models._
import repositories.ChatRepository

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ChatResolverImpl @Inject()(chatRepository: ChatRepository)
  extends ChatResolver
  with Logger
  with ActorMessageDelivering {

  override def addMessage(input: AddMessageInput, parts: Source[FormData.BodyPart, Any]): Future[Message] = ???

  override def editMessage(input: EditMessageInput): Future[Message] = ???

  override def deleteMessage(id: Int): Future[Option[Message]] = ???

  override def messages(limit: Int, after: Int): Future[Option[Messages]] = ???

  override def message(id: Int): Future[Option[Message]] =
    for {
      maybeMessage <- chatRepository.findMessage(id).run
    } yield maybeMessage

  override def findQuotedMessage(id: Int): Future[Option[QuotedMessage]] =
    for {
      maybeQuotedMessage <- chatRepository.findQuotedMessage(id).run
      _ = println(maybeQuotedMessage)
    } yield maybeQuotedMessage
}
