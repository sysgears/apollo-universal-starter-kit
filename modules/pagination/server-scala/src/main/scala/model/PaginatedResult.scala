package model

/**
  * Container entity for representing paginated result of type T
  *
  * @param totalCount  total number of available objects of type T
  * @param entities    list of entities of type T
  * @param hasNextPage marker which showing whether there are still objects to request
  */
case class PaginatedResult[T](totalCount: Int, entities: List[T], hasNextPage: Boolean)
