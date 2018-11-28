package graphql.resolvers

import models.{Contact, ContactPayload}

import scala.concurrent.Future

trait ContactResolver {
  def sendMail(contact: Contact): Future[ContactPayload]
}