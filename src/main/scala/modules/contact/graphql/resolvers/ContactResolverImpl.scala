package modules.contact.graphql.resolvers

import java.util.concurrent.TimeUnit.SECONDS

import akka.actor.ActorRef
import akka.pattern.ask
import akka.util.Timeout
import javax.inject.{Inject, Named}
import modules.contact.actor.ContactActor
import modules.contact.actor.ContactActor.SendMail
import modules.contact.models.{Contact, ContactPayload}

import scala.concurrent.{ExecutionContext, Future}

class ContactResolverImpl @Inject()(@Named(ContactActor.name) contactActor: ActorRef)
                                   (implicit executionContext: ExecutionContext) extends ContactResolver {

  implicit val timeout: Timeout = Timeout(5, SECONDS)

  override def sendMail(contact: Contact): Future[ContactPayload] = {
    ask(contactActor, SendMail(contact)).mapTo[ContactPayload]
  }
}