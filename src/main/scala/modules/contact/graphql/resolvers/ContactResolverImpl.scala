package modules.contact.graphql.resolvers

import modules.contact.models.{Contact, ContactPayload}

class ContactResolverImpl extends ContactResolver {
  override def sendMail(contact: Contact): ContactPayload = {
    ContactPayload()
  }
}