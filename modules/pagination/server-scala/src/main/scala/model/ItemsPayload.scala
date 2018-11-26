package model

/**
  * Entity for representing paginated result.
  */
case class ItemsPayload(hasNextPage: Boolean, entities: List[Item], totalCount: Int)
