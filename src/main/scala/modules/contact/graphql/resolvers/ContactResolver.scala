package modules.contact.graphql.resolvers

import modules.contact.models.{Contact, ContactPayload}

trait ContactResolver {
  def sendMail(contact: Contact): ContactPayload
}