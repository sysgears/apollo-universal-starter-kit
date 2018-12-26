package common.actors

import akka.actor.{Actor, ActorLogging}
import common.implicits.RichList._
import common.actors.Dispatcher.{Failure, InterceptorBeforeMessage, Success}
import common.graphql.UserContext

trait InterceptorBefore extends Actor
  with ActorLogging {

  final def continue: Right[Nothing, Unit] = Right()

  final def continue(result: Any): Right[Nothing, Any] = Right(result)

  final def reject(e: Exception): Left[Exception, _] = Left(e)

  def handle(input: Any, context: UserContext): Either[Exception, Any]

  final override def receive: Receive = {
    case msg: InterceptorBeforeMessage =>

      handle(msg, msg.context) match {
        case Left(e) => sender ! Failure(e)

        case Right(_) =>
          val interceptors = msg.before
          if (interceptors.nonEmpty) {
            val (head, tail) = interceptors.cutOff
            head.forward(msg.copy(before = tail))
          } else {
            sender ! Success
          }
      }
  }
}