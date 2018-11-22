package modules.pagination.repositories

import common.errors.{AmbigousResult, NotFound}
import javax.inject.{Inject, Singleton}
import modules.pagination.model.DataObject
import modules.pagination.{PaginatedResult, Pagination, PaginationUtil}
import slick.jdbc.SQLiteProfile.api._

import scala.concurrent.{ExecutionContext, Future}

trait DataObjectRepo {

  def save(dataObject: DataObject): Future[DataObject]

  def find(id: Long): Future[Option[DataObject]]

  def update(dataObject: DataObject): Future[DataObject]

  def delete(id: Long): Future[Int]

  def getPaginatedObjectsList(paginationParams: Pagination): Future[PaginatedResult[DataObject]]
}

@Singleton
class DataObjectRepoImpl @Inject()(db: Database)(implicit executionContext: ExecutionContext) extends DataObjectRepo with PaginationUtil {

  def query = TableQuery[DataObject.Table]

  override def save(dataObject: DataObject): Future[DataObject] = db.run(Actions.save(dataObject))

  override def find(id: Long): Future[Option[DataObject]] = db.run(Actions.find(id))

  override def update(dataObject: DataObject): Future[DataObject] = db.run(Actions.update(dataObject))

  override def delete(id: Long): Future[Int] = db.run(Actions.delete(id))

  override def getPaginatedObjectsList(paginationParams: Pagination): Future[PaginatedResult[DataObject]] = db.run(Actions.getPaginatedObjectsList(paginationParams))

  object Actions {
    def save(dataObject: DataObject): DBIO[DataObject] = {
      query returning query.map(_.id) into ((dataObject, id) => dataObject.copy(id = Some(id))) += dataObject
    }

    def find(id: Long): DBIO[Option[DataObject]] = for {
      objects <- query.filter(_.id === id).result
      result <- if (objects.lengthCompare(2) < 0) DBIO.successful(objects.headOption) else DBIO.failed(AmbigousResult(s"DataObject with id = [$id]"))
    } yield result

    def update(dataObject: DataObject): DBIO[DataObject] = for {
      count <- query.filter(_.id === dataObject.id).update(dataObject)
      _ <- count match {
        case 0 => DBIO.failed(NotFound(s"DataObject with params = [$dataObject]"))
        case _ => DBIO.successful(())
      }
    } yield dataObject

    def delete(id: Long): DBIO[Int] = query.filter(_.id === id).delete

    def getPaginatedObjectsList(paginationParams: Pagination): DBIO[PaginatedResult[DataObject]] = {
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
