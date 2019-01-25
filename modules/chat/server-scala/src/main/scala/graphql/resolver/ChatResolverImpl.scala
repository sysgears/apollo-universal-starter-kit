package graphql.resolver
import models.{AddMessageInput, EditMessageInput, Message, Messages}

import scala.concurrent.Future

class ChatResolverImpl extends ChatResolver {
  override def addMessage(input: AddMessageInput): Future[Message] = ???

  override def editMessage(input: EditMessageInput): Future[Message] = ???

  override def deleteMessage(id: Int): Future[Message] = ???

  override def findMessage(id: Int): Future[Message] = ???

  override def messages(limit: Int, after: Int): Future[Messages] = ???

  override def message(id: Int): Future[Message] = ???
}
