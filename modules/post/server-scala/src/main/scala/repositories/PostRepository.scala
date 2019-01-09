package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.{PaginatedResult, Pagination, PaginationParams, Post}
import model.PostTable.PostTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class PostRepository @Inject()(override val driver: JdbcProfile)(implicit executionContext: ExecutionContext)
  extends Repository[Post, Int](driver)
  with Pagination {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[PostTable]
  type TableType = PostTable

  def getPaginatedObjectsList(paginationParams: PaginationParams): DBIO[PaginatedResult[Post]] = {
    val (offset, limit) = (paginationParams.offset, paginationParams.limit)
    val paginatedQuery = withPagination(tableQuery, paginationParams)
    for {
      totalCount <- tableQuery.size.result
      paginatedResult <- paginatedQuery.result
    } yield
      PaginatedResult(
        totalCount = totalCount,
        entities = paginatedResult.toList,
        hasNextPage = (totalCount - (offset + limit)) > 0
      )
  }
}
