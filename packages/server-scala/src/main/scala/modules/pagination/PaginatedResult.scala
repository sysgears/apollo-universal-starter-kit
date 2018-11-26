package modules.pagination

case class PaginatedResult[T](totalCount: Int, entities: List[T], hasNextPage: Boolean)
