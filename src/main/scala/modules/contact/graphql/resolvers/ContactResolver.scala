package modules.contact.graphql.resolvers

import modules.contact.models.{Contact, ContactPayload}

import scala.concurrent.Future

trait ContactResolver {
  def sendMail(contact: Contact): Future[ContactPayload]
}