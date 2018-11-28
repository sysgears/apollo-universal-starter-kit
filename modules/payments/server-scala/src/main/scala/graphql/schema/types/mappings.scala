package graphql.schema.types

import scala.language.implicitConversions

object mappings {
  implicit def stripeSubscriptionMapping(model: models.StripeSubscription): graphql.schema.types.StripeSubscription = {
    graphql.schema.types.StripeSubscription(model.active)
  }

  implicit def creditCardMapping(model: models.StripeSubscription.CreditCard): graphql.schema.types.StripeSubscriptionCard = {
    graphql.schema.types.StripeSubscriptionCard(Some(model.expiryMonth), Some(model.expiryYear), Some(model.last4.toString), Some(model.brand))
  }

  implicit def stripeSubscriberProtectedNumberMapping(maybeNumber: Option[Int]): graphql.schema.types.StripeSubscriberProtectedNumber = {
    graphql.schema.types.StripeSubscriberProtectedNumber(maybeNumber)
  }
}
