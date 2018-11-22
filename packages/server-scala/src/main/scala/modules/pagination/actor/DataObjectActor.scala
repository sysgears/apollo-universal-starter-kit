package modules.pagination.actor

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import common.ActorNamed
import javax.inject.Inject
import modules.pagination.Pagination
import modules.pagination.actor.DataObjectActor.GetPaginatedList
import modules.pagination.model.DataObjectsPayload
import modules.pagination.repositories.DataObjectRepo

import scala.concurrent.ExecutionContext

object DataObjectActor extends ActorNamed {

  final val name = "DataObjectActor"

  case class GetPaginatedList(paginationParams: Pagination)

}

class DataObjectActor @Inject()(dataObjectRepo: DataObjectRepo)
                               (implicit executionContext: ExecutionContext) extends Actor with ActorLogging {

  override def receive: Receive = {
    case getPaginatedList: GetPaginatedList =>
      log.info(s"Received message: [ $getPaginatedList ]")
      dataObjectRepo.getPaginatedObjectsList(getPaginatedList.paginationParams)
        .map(res => DataObjectsPayload(hasNextPage = res.hasNextPage, entities = res.entities, totalCount = res.totalCount.toInt))
        .pipeTo(sender)
  }
}