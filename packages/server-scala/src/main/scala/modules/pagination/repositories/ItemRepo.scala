package modules.pagination.repositories

import common.errors.{AmbigousResult, NotFound}
import javax.inject.{Inject, Singleton}
import modules.pagination.model.Item
import modules.pagination.{PaginatedResult, Pagination, PaginationUtil}
import slick.jdbc.SQLiteProfile.api._

import scala.concurrent.{ExecutionContext, Future}

trait ItemRepo {

  def save(dataObject: Item): Future[Item]

  def find(id: Long): Future[Option[Item]]

  def update(dataObject: Item): Future[Item]

  def delete(id: Long): Future[Int]

  def getPaginatedObjectsList(paginationParams: Pagination): Future[PaginatedResult[Item]]
}

@Singleton
class ItemRepoImpl @Inject()(db: Database)(implicit executionContext: ExecutionContext) extends ItemRepo with PaginationUtil {

  def query = TableQuery[Item.Table]

  override def save(dataObject: Item): Future[Item] = db.run(Actions.save(dataObject))

  override def find(id: Long): Future[Option[Item]] = db.run(Actions.find(id))

  override def update(dataObject: Item): Future[Item] = db.run(Actions.update(dataObject))

  override def delete(id: Long): Future[Int] = db.run(Actions.delete(id))

  override def getPaginatedObjectsList(paginationParams: Pagination): Future[PaginatedResult[Item]] = db.run(Actions.getPaginatedObjectsList(paginationParams))

  object Actions {
    def save(dataObject: Item): DBIO[Item] = {
      query returning query.map(_.id) into ((dataObject, id) => dataObject.copy(id = Some(id))) += dataObject
    }

    def find(id: Long): DBIO[Option[Item]] = for {
      objects <- query.filter(_.id === id).result
      result <- if (objects.lengthCompare(2) < 0) DBIO.successful(objects.headOption) else DBIO.failed(AmbigousResult(s"DataObject with id = [$id]"))
    } yield result

    def update(dataObject: Item): DBIO[Item] = for {
      count <- query.filter(_.id === dataObject.id).update(dataObject)
      _ <- count match {
        case 0 => DBIO.failed(NotFound(s"DataObject with params = [$dataObject]"))
        case _ => DBIO.successful(())
      }
    } yield dataObject

    def delete(id: Long): DBIO[Int] = query.filter(_.id === id).delete

    def getPaginatedObjectsList(paginationParams: Pagination): DBIO[PaginatedResult[Item]] = {
      val (offset, limit) = (paginationParams.offset, paginationParams.limit)
      val paginatedQuery = withPagination(query, paginationParams)
      for {
        totalCount <- query.size.result
        paginatedResult <- paginatedQuery.result
      } yield PaginatedResult(
        totalCount = totalCount,
        entities = paginatedResult.toList,
        hasNextPage = (totalCount - (offset + limit)) > 0
      )
    }
  }

}
