package models.counter

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Source
import graphql.GraphQLContext
import javax.inject.Inject
import monix.execution.Scheduler
import sangria.macros.derive._
import sangria.schema.{Action, Argument, Field, IntType, ObjectType}

case class Counter(amount: Int)

object Counter {

  import sangria.streaming.akkaStreams._

  @Inject implicit var actorSystem: ActorSystem = _
  @Inject implicit var scheduler: Scheduler = _
  @Inject implicit var materializer: ActorMaterializer = _

  object Types {
    implicit val counter: ObjectType[Unit, Counter] = deriveObjectType(ObjectTypeName("Counter"))
  }

  object GraphQL {

    val queries: List[Field[GraphQLContext, Unit]] = List(
      Field(
        name = "serverCounter",
        fieldType = Types.counter,
        resolve = sc => sc.ctx.counterResolver.serverCounter
      )
    )

    val mutations: List[Field[GraphQLContext, Unit]] = List(
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

    val subscriptions: List[Field[GraphQLContext, Unit]] = List(
      Field.subs(
        name = "counterUpdated",
        fieldType = Types.counter,
        resolve = sc => Source.fromPublisher(sc.ctx.publisherService.getPublisher).map {
          e =>
            println(s"Sending event [$e] to client ...")
            Action(e)
        }
      )
    )
  }

}