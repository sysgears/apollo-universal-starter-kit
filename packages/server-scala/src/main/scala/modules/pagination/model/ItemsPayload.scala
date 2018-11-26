package modules.pagination.model

case class ItemsPayload(hasNextPage: Boolean, entities: List[Item], totalCount: Int)
