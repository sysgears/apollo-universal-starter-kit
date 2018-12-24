package graphql.resolvers

import akka.actor.{Actor, ActorLogging}
import common.ActorNamed

object UserResolver extends ActorNamed {
  final val name = "UserResolver"
}

class UserResolver extends Actor with ActorLogging {

  override def receive: Receive = {
    case unknownMessage@_ => log.warning(s"Received unknown message: $unknownMessage")
  }
}