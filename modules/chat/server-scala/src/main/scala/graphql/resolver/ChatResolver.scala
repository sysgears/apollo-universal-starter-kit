package graphql.resolver

import models.{AddMessageInput, EditMessageInput, Message, Messages}

import scala.concurrent.Future

trait ChatResolver {

  def addMessage(input: AddMessageInput): Future[Message]

  def editMessage(input: EditMessageInput): Future[Message]

  def deleteMessage(id: Int): Future[Message]

  def findMessage(id: Int): Future[Message]

  def messages(limit: Int, after: Int): Future[Messages]

  def message(id: Int): Future[Message]
}
