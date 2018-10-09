package controllers.graphql

import actors.counter.CounterPersistentActor
import actors.counter.CounterPersistentActor.Reset
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
    val persistentCounterActor = inject[ActorRef](Names.named(CounterPersistentActor.name))
    Await.ready(Future(persistentCounterActor ! Reset), Duration.Inf)
  }
}