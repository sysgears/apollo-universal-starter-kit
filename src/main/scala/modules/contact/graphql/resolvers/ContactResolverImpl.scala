package modules.contact.graphql.resolvers

import akka.actor.ActorRef
import akka.stream.ActorMaterializer
import common.ActorUtil
import javax.inject.{Inject, Named}
import modules.contact.actor.ContactActor
import modules.contact.actor.ContactActor.SendMail
import modules.contact.models.{Contact, ContactPayload}

import scala.concurrent.{ExecutionContext, Future}

class ContactResolverImpl @Inject()(@Named(ContactActor.name) contactActor: ActorRef)
                                   (implicit executionContext: ExecutionContext,
                                    materializer: ActorMaterializer) extends ContactResolver
  with ActorUtil {

  override def sendMail(contact: Contact): Future[ContactPayload] = {
    sendMessageWithFunc[ContactPayload](actorRef => contactActor ! SendMail(contact, actorRef))
  }
}