package modules.counter.graphql.schema

import akka.actor.{ActorRef, ActorSystem}
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Source
import com.google.inject.name.Named
import common.Logger
import core.graphql.{GraphQLSchema, UserContext}
import core.services.publisher.PublisherService
import javax.inject.Inject
import common.actors.DispatcherActor
import common.graphql.GraphQLUtil
import modules.counter.graphql.resolvers.CounterResolver
import modules.counter.models.Counter
import modules.counter.services.count.CounterActor.GetAmount
import sangria.macros.derive.{ExcludeFields, ObjectTypeName, deriveObjectType}
import sangria.schema.{Action, Argument, Field, IntType, ObjectType}
import sangria.streaming.akkaStreams._

import scala.concurrent.ExecutionContext

class CounterSchema @Inject()(@Named(DispatcherActor.name) dispatcherActor: ActorRef,
                              publisherService: PublisherService[Counter])
                             (implicit val materializer: ActorMaterializer,
                              actorSystem: ActorSystem,
                              executionContext: ExecutionContext) extends GraphQLSchema
  with Logger
  with GraphQLUtil {

  object Types {
    implicit val counter: ObjectType[Unit, Counter] = deriveObjectType(ObjectTypeName("Counter"), ExcludeFields("id"))
  }

  override def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "serverCounter",
      fieldType = Types.counter,
      resolve = sc => sendMessageToDispatcher[Counter](
        input = GetAmount,
        userContext = sc.ctx,
        resolverActor = CounterResolver.name
      )
    )
  )

  override def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "addServerCounter",
      fieldType = Types.counter,
      arguments = Argument(name = "amount", argumentType = IntType) :: Nil,
      resolve = sc => {
        val amount = sc.args.arg[Int]("amount")
        sendMessageToDispatcher[Counter](
          input = amount,
          userContext = sc.ctx,
          resolverActor = CounterResolver.name
        ).map {
          counter => {
            publisherService.publish(counter)
            counter
          }
        }
      }
    )
  )

  override def subscriptions: List[Field[UserContext, Unit]] = List(
    Field.subs(
      name = "counterUpdated",
      fieldType = Types.counter,
      resolve = _ => Source.fromPublisher(publisherService.getPublisher).map {
        counter =>
          log.info(s"Sending event [$counter] to client ...")
          Action(counter)
      }
    )
  )
}