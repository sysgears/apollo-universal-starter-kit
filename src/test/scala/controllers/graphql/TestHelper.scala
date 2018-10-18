package controllers.graphql

import java.util.concurrent.TimeUnit.SECONDS

import actors.counter.CounterPersistentActor
import actors.counter.CounterPersistentActor.Init
import akka.actor.ActorRef
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import akka.pattern.ask
import akka.util.Timeout
import com.google.inject.name.Names
import injection.Injecting
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, Matchers, WordSpec}

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait TestHelper extends WordSpec
  with Injecting
  with Matchers
  with ScalatestRouteTest
  with BeforeAndAfter
  with BeforeAndAfterAll
  with PersistenceCleanup {

  implicit val timeout: Timeout = Timeout(5, SECONDS)

  val endpoint: String = "/graphql"
  val routes: Route = inject[GraphQLController].Routes

  before(resetCounter())
  after(resetCounter())

  def resetCounter(): Unit = {
    val persistentCounterActor = inject[ActorRef](Names.named(CounterPersistentActor.name))
    Await.result(Future(ask(persistentCounterActor, Init(0))), Duration.Inf)
    deleteStorageLocations()
  }

  override protected def afterAll() {
    cleanUp
    deleteStorageLocations()
  }
}