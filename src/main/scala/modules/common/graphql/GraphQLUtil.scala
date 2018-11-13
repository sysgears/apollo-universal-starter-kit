package modules.common.graphql

import akka.actor.{ActorRef, ActorSystem}
import akka.stream.ActorMaterializer
import common.ActorUtil
import core.graphql.UserContext
import core.guice.injection.GuiceActorRefProvider
import modules.common.actors.DispatcherActor
import modules.common.actors.DispatcherActor.DispatcherInput

import scala.concurrent.Future

trait GraphQLUtil extends ActorUtil
  with GuiceActorRefProvider {

  def sendMessageToDispatcher[T](input: Any,
                                 userContext: UserContext,
                                 resolverActor: String,
                                 filtersBefore: List[ActorRef] = Nil,
                                 filtersAfter: List[ActorRef] = Nil)
                                (implicit actorSystem: ActorSystem,
                                 materializer: ActorMaterializer): Future[T] = {

    sendMessageWithFunc[T] {
      actorRef =>
        provideActorRef(DispatcherActor.name) ! DispatcherInput(
          input,
          userContext,
          provideActorRef(resolverActor),
          actorRef,
          filtersBefore,
          filtersAfter
        )
    }
  }
}