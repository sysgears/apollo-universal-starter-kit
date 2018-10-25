package modules.counter.graphql.schema

import akka.stream.ActorMaterializer
import core.graphql.GraphQLSchema
import javax.inject.Inject
import modules.counter.graphql.resolvers.CounterResolver
import modules.counter.models.Counter
import sangria.macros.derive.{ObjectTypeName, deriveObjectType, ExcludeFields}
import sangria.schema.{Argument, Field, IntType, ObjectType}
import sangria.streaming.akkaStreams._
import util.Logger

class CounterSchema @Inject()(counterResolver: CounterResolver)
                             (implicit val materializer: ActorMaterializer) extends GraphQLSchema with Logger {

  object Types {
    implicit val counter: ObjectType[Unit, Counter] = deriveObjectType(ObjectTypeName("Counter"), ExcludeFields("id"))
  }

  override def queries: List[Field[Unit, Unit]] = List(
    Field(
      name = "serverCounter",
      fieldType = Types.counter,
      resolve = _ => counterResolver.serverCounter
    )
  )

  override def mutations: List[Field[Unit, Unit]] = List(
    Field(
      name = "addServerCounter",
      fieldType = Types.counter,
      arguments = Argument(name = "amount", argumentType = IntType) :: Nil,
      resolve = sc => {
        val amount = sc.args.arg[Int]("amount")
        counterResolver.addServerCounter(amount)
      }
    )
  )

  override def subscriptions: List[Field[Unit, Unit]] = List(
    Field.subs(
      name = "counterUpdated",
      fieldType = Types.counter,
      resolve = _ => counterResolver.counterUpdated
    )
  )
}