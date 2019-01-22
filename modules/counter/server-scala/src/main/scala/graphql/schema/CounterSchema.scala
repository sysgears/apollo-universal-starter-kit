package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.Logger
import common.graphql.DispatcherResolver._
import common.graphql.UserContext
import common.publisher.{Event, PubSubService}
import common.publisher.RichPubSubService._
import graphql.resolvers.CounterResolver
import javax.inject.Inject
import models.Counter
import sangria.macros.derive.{ExcludeFields, ObjectTypeName, deriveObjectType}
import sangria.schema.{Argument, Field, IntType, ObjectType}
import sangria.streaming.akkaStreams._
import services.count.CounterActor.GetAmount

import scala.concurrent.ExecutionContext

class CounterSchema @Inject()(
    implicit val counterPubSubService: PubSubService[Event[Counter]],
    materializer: ActorMaterializer,
    actorSystem: ActorSystem,
    executionContext: ExecutionContext
) extends Logger {

  object Types {
    implicit val counter: ObjectType[Unit, Counter] = deriveObjectType(ObjectTypeName("Counter"), ExcludeFields("id"))
  }

  object Names {

    final val SERVER_COUNTER = "serverCounter"

    final val ADD_SERVER_COUNTER = "addServerCounter"

    final val COUNTER_UPDATED = "counterUpdated"
  }

  import Names._

  def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = SERVER_COUNTER,
      fieldType = Types.counter,
      resolve = sc =>
        resolveWithDispatcher[Counter](
          input = GetAmount,
          userContext = sc.ctx,
          namedResolverActor = CounterResolver
      )
    )
  )

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = ADD_SERVER_COUNTER,
      fieldType = Types.counter,
      arguments = Argument(name = "amount", argumentType = IntType) :: Nil,
      resolve = sc => {
        val amount = sc.args.arg[Int]("amount")
        resolveWithDispatcher[Counter](
          input = amount,
          userContext = sc.ctx,
          namedResolverActor = CounterResolver
        ).pub(ADD_SERVER_COUNTER)
      }
    )
  )

  def subscriptions: List[Field[UserContext, Unit]] = List(
    Field.subs(
      name = COUNTER_UPDATED,
      fieldType = Types.counter,
      resolve = _ => {
        counterPubSubService.subscribe(Seq(ADD_SERVER_COUNTER), Seq.empty).map(action => action.map(_.element))
      }
    )
  )
}
