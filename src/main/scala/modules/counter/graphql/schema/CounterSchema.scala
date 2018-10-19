package modules.counter.graphql.schema

import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Source
import core.graphql.{GraphQLContext, GraphQLSchema}
import javax.inject.Inject
import modules.counter.models.Counter
import sangria.macros.derive.{ObjectTypeName, deriveObjectType}
import sangria.schema.{Action, Argument, Field, IntType, ObjectType}
import sangria.streaming.akkaStreams._
import util.Logger

class CounterSchema @Inject()(implicit val materializer: ActorMaterializer) extends GraphQLSchema with Logger {

  object Types {
    implicit val counter: ObjectType[Unit, Counter] = deriveObjectType(ObjectTypeName("Counter"))
  }

  override def queries: List[Field[GraphQLContext, Unit]] = List(
    Field(
      name = "serverCounter",
      fieldType = Types.counter,
      resolve = sc => sc.ctx.counterResolver.serverCounter
    )
  )

  override def mutations: List[Field[GraphQLContext, Unit]] = List(
    Field(
      name = "addServerCounter",
      fieldType = Types.counter,
      arguments = Argument(name = "amount", argumentType = IntType) :: Nil,
      resolve = sc => {
        val amount = sc.args.arg[Int]("amount")
        sc.ctx.counterResolver.addServerCounter(amount)
      }
    )
  )

  override def subscriptions: List[Field[GraphQLContext, Unit]] = List(
    Field.subs(
      name = "counterUpdated",
      fieldType = Types.counter,
      resolve = sc => Source.fromPublisher(sc.ctx.publisherService.getPublisher).map {
        e =>
          log.info(s"Sending event [$e] to client ...")
          Action(e)
      }
    )
  )
}