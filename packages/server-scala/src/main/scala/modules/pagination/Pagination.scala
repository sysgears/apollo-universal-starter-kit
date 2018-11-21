package modules.pagination

import slick.lifted.TableQuery

//TODO: fix problem with generics type
trait Pagination {
  def withPagination[E](query: TableQuery[E], paginationParams: PaginationParams) = for {
   res <- query.drop(paginationParams.offset).take(paginationParams.limit)
  } yield res
}
