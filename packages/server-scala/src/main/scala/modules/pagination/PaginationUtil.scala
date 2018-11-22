package modules.pagination

import slick.jdbc.SQLiteProfile.api._
import slick.relational.RelationalProfile

trait PaginationUtil {

  def withPagination[E <: RelationalProfile#Table[_], Y, U, C[Z]](query: Query[Y, U, C], paginationParams: Pagination) = {
    query.drop(paginationParams.offset).take(paginationParams.limit)
  }
}
