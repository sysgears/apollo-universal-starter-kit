package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.Logger
import common.graphql.DispatcherResolver._
import common.graphql.UserContext
import common.publisher.PubSubService
import common.publisher.RichPubSubService._
import graphql.resolvers.CounterResolver
import javax.inject.Inject
import models.Counter
import sangria.macros.derive.{ExcludeFields, ObjectTypeName, deriveObjectType}
import sangria.schema.{Argument, Field, IntType, ObjectType}
import sangria.streaming.akkaStreams._
import services.count.CounterActor.GetAmount

import scala.concurrent.ExecutionContext

class CounterSchema @Inject()(implicit val pubsubService: PubSubService[Counter],
                              materializer: ActorMaterializer,
                              actorSystem: ActorSystem,
                              executionContext: ExecutionContext) extends Logger {

  object Types {
    implicit val counter: ObjectType[Unit, Counter] = deriveObjectType(ObjectTypeName("Counter"), ExcludeFields("id"))
  }

  def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "serverCounter",
      fieldType = Types.counter,
      resolve = sc => resolveWithDispatcher[Counter](
        input = GetAmount,
        userContext = sc.ctx,
        namedResolverActor = CounterResolver
      )
    )
  )

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "addServerCounter",
      fieldType = Types.counter,
      arguments = Argument(name = "amount", argumentType = IntType) :: Nil,
      resolve = sc => {
        val amount = sc.args.arg[Int]("amount")
        resolveWithDispatcher[Counter](
          input = amount,
          userContext = sc.ctx,
          namedResolverActor = CounterResolver
        ).pub
      }
    )
  )

  def subscriptions: List[Field[UserContext, Unit]] = List(
    Field.subs(
      name = "counterUpdated",
      fieldType = Types.counter,
      resolve = _ => pubsubService.subscribe
    )
  )
}