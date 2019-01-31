package graphql.resolvers

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import com.google.inject.Inject
import common.implicits.RichDBIO._
import common.ActorNamed
import model.PaginationParams
import model.ItemsPayload
import repositories.ItemRepository

import scala.concurrent.ExecutionContext

object ItemResolver extends ActorNamed {
  final val name = "ItemResolver"
}

/**
  * Defines the resolve function for pagination input using actor model.
  *
  * @param itemRepo provides methods for operating an entity in a database
  */
class ItemResolver @Inject()(itemRepo: ItemRepository)(implicit executionContext: ExecutionContext)
  extends Actor
  with ActorLogging {

  override def receive: Receive = {
    case paginationParams: PaginationParams => {
      log.debug(s"Received message: [ $paginationParams ]")
      itemRepo
        .getPaginatedObjectsList(paginationParams)
        .map(res => ItemsPayload(hasNextPage = res.hasNextPage, entities = res.entities, totalCount = res.totalCount))
        .run
        .pipeTo(sender)
    }
  }
}
