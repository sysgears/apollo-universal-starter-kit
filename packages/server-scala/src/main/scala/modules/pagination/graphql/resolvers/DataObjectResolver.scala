package modules.pagination.graphql.resolvers

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import common.ActorNamed
import javax.inject.Inject
import modules.pagination.Pagination
import modules.pagination.model.DataObjectsPayload
import modules.pagination.repositories.DataObjectRepo

import scala.concurrent.ExecutionContext

object DataObjectResolver extends ActorNamed {
  final val name = "DataObjectResolver"
}

class DataObjectResolver @Inject()(dataObjectRepo: DataObjectRepo)
                                  (implicit executionContext: ExecutionContext) extends Actor with ActorLogging {

  override def receive: Receive = {
    case paginationParams: Pagination => {
      log.info(s"Received message: [ $paginationParams ]")
      dataObjectRepo.getPaginatedObjectsList(paginationParams)
        .map(res => DataObjectsPayload(hasNextPage = res.hasNextPage, entities = res.entities, totalCount = res.totalCount.toInt))
        .pipeTo(sender)
    }
  }
}
