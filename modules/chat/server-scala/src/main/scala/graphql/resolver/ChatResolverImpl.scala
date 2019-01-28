package graphql.resolver
import akka.http.scaladsl.model.Multipart.FormData
import akka.stream.scaladsl.Source
import common.Logger
import common.actors.ActorMessageDelivering
import models.{AddMessageInput, EditMessageInput, Message, Messages}

import scala.concurrent.Future

class ChatResolverImpl extends ChatResolver with Logger with ActorMessageDelivering {

  override def addMessage(input: AddMessageInput, parts: Source[FormData.BodyPart, Any]): Future[Message] = ???

  override def editMessage(input: EditMessageInput): Future[Message] = ???

  override def deleteMessage(id: Int): Future[Option[Message]] = ???

  override def messages(limit: Int, after: Int): Future[Option[Messages]] = ???

  override def message(id: Int): Future[Option[Message]] = ???

}
