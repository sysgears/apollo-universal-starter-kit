package modules.pagination.graphql.resolvers

import akka.actor.{Actor, ActorLogging, ActorRef}
import com.google.inject.name.Named
import common.ActorNamed
import javax.inject.Inject
import modules.pagination.Pagination
import modules.pagination.actor.DataObjectActor
import modules.pagination.actor.DataObjectActor.GetPaginatedList

object DataObjectResolver extends ActorNamed {
  final val name = "DataObjectResolver"
}

class DataObjectResolver @Inject()(@Named(DataObjectActor.name) dataObjectActor: ActorRef) extends Actor
  with ActorLogging {

  override def receive: Receive = {
    case paginationParams: Pagination => dataObjectActor.forward(GetPaginatedList(paginationParams))
  }
}
