package modules.pagination.model

case class DataObjectsPayload(hasNextPage: Boolean, entities: List[DataObject], totalCount: Int)
