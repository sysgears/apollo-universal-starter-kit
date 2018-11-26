package model

import slick.lifted.Query
import slick.relational.RelationalProfile

/**
  * Contains helper for providing a pagination selection of data from the database.
  */
trait PaginationUtil {

  /**
    * Applies pagination options for a received database query
    *
    * @param query            database request
    * @param paginationParams contains Pagination entity
    * @return paginated query
    */
  def withPagination[E <: RelationalProfile#Table[_], Y, U, C[Z]](query: Query[Y, U, C], paginationParams: Pagination) = {
    query.drop(paginationParams.offset).take(paginationParams.limit)
  }
}
