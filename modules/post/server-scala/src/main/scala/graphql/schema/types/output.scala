package graphql.schema.types

import model.{UpdateCommentPayload, UpdatePostPayload}
import sangria.macros.derive.{ObjectTypeName, deriveObjectType}
import sangria.schema.ObjectType

object output {

  implicit val updatePostPayloadOutput: ObjectType[Unit, UpdatePostPayload] = deriveObjectType(ObjectTypeName("UpdatePostPayload"))
  implicit val updateCommentPayloadOutput: ObjectType[Unit, UpdateCommentPayload] = deriveObjectType(ObjectTypeName("UpdateCommentPayload"))
}
