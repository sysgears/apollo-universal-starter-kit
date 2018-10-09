package controllers.graphql

import actors.counter.CounterActor
import actors.counter.CounterActor.Reset
import akka.actor.ActorRef
import akka.http.scaladsl.server.Route
import com.google.inject.name.Names
import util.Injecting

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext, Future}

object Utils extends Injecting {

  val endpoint: String = "/graphql"
  val routes: Route = inject[GraphQLController].Routes

  // TODO It is necessary remove after fix of actor counter
  def resetCounter(implicit executionContext: ExecutionContext): Unit = {
    val counteRef = inject[ActorRef](Names.named(CounterActor.name))
    Await.ready(Future(counteRef ! Reset), Duration.Inf)
  }
}