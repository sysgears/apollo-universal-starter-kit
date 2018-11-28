package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.ItemTable.ItemTable
import model.{Item, PaginatedResult, PaginationParams, Pagination}
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class ItemRepository @Inject()(override val driver: JdbcProfile)(implicit executionContext: ExecutionContext) extends Repository[Item, Int](driver) with Pagination {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[ItemTable]
  type TableType = ItemTable

  def getPaginatedObjectsList(paginationParams: PaginationParams): DBIO[PaginatedResult[Item]] = {
    val (offset, limit) = (paginationParams.offset, paginationParams.limit)
    val paginatedQuery = withPagination(tableQuery, paginationParams)
    for {
      totalCount <- tableQuery.size.result
      paginatedResult <- paginatedQuery.result
    } yield PaginatedResult(
      totalCount = totalCount,
      entities = paginatedResult.toList,
      hasNextPage = (totalCount - (offset + limit)) > 0
    )
  }
}


