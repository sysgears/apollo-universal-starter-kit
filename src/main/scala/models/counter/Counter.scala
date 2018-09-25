package models.counter

import graphql.GraphQLContext
import sangria.macros.derive._
import sangria.schema.{Argument, Field, IntType, ObjectType}

case class Counter(amount: Int)

object Counter {

  object Types {
    implicit val Сounter: ObjectType[Unit, Counter] = deriveObjectType(ObjectTypeName("Counter"))
  }

  object GraphQL {

    val Queries: List[Field[GraphQLContext, Unit]] = List(
      Field(
        name = "serverCounter",
        fieldType = Types.Сounter,
        arguments = Nil,
        resolve = sc => sc.ctx.counterResolver.serverCounter
      )
    )

    val Mutations: List[Field[GraphQLContext, Unit]] = List(
      Field(
        name = "addServerCounter",
        fieldType = Types.Сounter,
        arguments = Argument(name = "amount", argumentType = IntType) :: Nil,
        resolve = sc => {
          val amount = sc.args.arg[Int]("amount")
          sc.ctx.counterResolver.addServerCounter(amount)
        }
      )
    )
  }
}