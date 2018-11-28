package graphql.schema.types

import core.graphql.UserContext
import sangria.macros.derive.{ObjectTypeName, deriveObjectType}
import sangria.schema.ObjectType

object output {
  implicit val StripeSubscription: ObjectType[UserContext, StripeSubscription] = deriveObjectType(ObjectTypeName("StripeSubscription"))
  implicit val StripeSubscriptionCard: ObjectType[UserContext, StripeSubscriptionCard] = deriveObjectType(ObjectTypeName("StripeSubscriptionCard"))
  implicit val StripeSubscriberProtectedNumber: ObjectType[UserContext, StripeSubscriberProtectedNumber] = deriveObjectType(ObjectTypeName("StripeSubscriberProtectedNumber"))
}
