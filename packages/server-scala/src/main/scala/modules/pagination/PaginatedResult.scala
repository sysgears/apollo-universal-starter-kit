package modules.pagination

case class PaginatedResult[T](totalCount: Long, entities: List[T], hasNextPage: Boolean)
