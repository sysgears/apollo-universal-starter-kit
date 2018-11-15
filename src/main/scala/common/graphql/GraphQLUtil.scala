package common.graphql

import akka.actor.{ActorRef, ActorSystem}
import akka.stream.ActorMaterializer
import common.ActorUtil
import common.actors.Dispatcher
import common.actors.Dispatcher.DispatcherMessage
import core.graphql.UserContext
import core.guice.injection.GuiceActorRefProvider

import scala.concurrent.Future

trait GraphQLUtil extends ActorUtil
  with GuiceActorRefProvider {

  def sendMessageToDispatcher[T](input: Any,
                                 userContext: UserContext,
                                 resolverActor: String,
                                 onException: Exception => Any,
                                 filtersBefore: List[ActorRef] = Nil,
                                 filtersAfter: List[ActorRef] = Nil)
                                (implicit actorSystem: ActorSystem,
                                 materializer: ActorMaterializer): Future[T] = {

    sendMessageWithFunc[T] {
      replyTo =>
        provideActorRef(Dispatcher.name) ! DispatcherMessage(
          input,
          userContext,
          replyTo,
          provideActorRef(resolverActor),
          onException,
          filtersBefore,
          filtersAfter
        )
    }
  }
}