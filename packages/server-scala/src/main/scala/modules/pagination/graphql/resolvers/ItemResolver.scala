package modules.pagination.graphql.resolvers

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import common.ActorNamed
import javax.inject.Inject
import modules.pagination.Pagination
import modules.pagination.model.ItemsPayload
import modules.pagination.repositories.ItemRepo

import scala.concurrent.ExecutionContext

object ItemResolver extends ActorNamed {
  final val name = "ItemResolver"
}

/**
  * Defines the resolve function for pagination input using actor model.
  *
  * @param ItemRepo provides methods for operating an entity in a database
  */
class ItemResolver @Inject()(ItemRepo: ItemRepo)
                            (implicit executionContext: ExecutionContext) extends Actor with ActorLogging {

  override def receive: Receive = {
    case paginationParams: Pagination => {
      log.info(s"Received message: [ $paginationParams ]")
      ItemRepo.getPaginatedObjectsList(paginationParams)
        .map(res => ItemsPayload(hasNextPage = res.hasNextPage, entities = res.entities, totalCount = res.totalCount))
        .pipeTo(sender)
    }
  }
}
