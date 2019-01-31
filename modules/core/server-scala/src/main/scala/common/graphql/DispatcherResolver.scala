package common.graphql

import akka.actor.{ActorRef, ActorSystem}
import akka.stream.ActorMaterializer
import common.actors.{ActorMessageDelivering, Dispatcher}
import common.ActorNamed
import common.actors.Dispatcher.DispatcherMessage
import core.guice.injection.GuiceActorRefProvider

import scala.concurrent.Future

object DispatcherResolver extends ActorMessageDelivering with GuiceActorRefProvider {

  def resolveWithDispatcher[T](
      input: Any,
      userContext: UserContext,
      namedResolverActor: ActorNamed,
      before: List[ActorRef] = Nil,
      after: List[ActorRef] = Nil
  )(implicit actorSystem: ActorSystem, materializer: ActorMaterializer): Future[T] = {

    sendMessageWithFunc[T] {
      replyTo =>
        provideActorRef(Dispatcher) ! DispatcherMessage(
          input,
          userContext,
          replyTo,
          provideActorRef(namedResolverActor),
          before,
          after
        )
    }
  }
}
