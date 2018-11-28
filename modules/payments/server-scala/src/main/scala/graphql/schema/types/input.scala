package graphql.schema.types

import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType}
import sangria.schema.InputObjectType

object input {
  implicit val StripeSubscriptionInput: InputObjectType[StripeSubscriptionInput] = deriveInputObjectType(InputObjectTypeName("StripeSubscriptionInput"))
}
