package common

import sangria.macros.derive.{ObjectTypeName, deriveObjectType}
import sangria.schema.ObjectType

case class FieldError(field: String, message: String)

object FieldError {
  implicit val fieldError: ObjectType[Unit, FieldError] = deriveObjectType(ObjectTypeName("FieldError"))
}
