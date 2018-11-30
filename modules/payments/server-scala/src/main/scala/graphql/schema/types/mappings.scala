package graphql.schema.types

import scala.language.implicitConversions
import scala.language.postfixOps

object mappings {
  implicit def stripeSubscriptionMapping(model: models.StripeSubscription): graphql.schema.types.StripeSubscription = {
    graphql.schema.types.StripeSubscription(model.active)
  }

  implicit def creditCardMapping(model: models.StripeSubscription.CreditCard): graphql.schema.types.StripeSubscriptionCard = {
    graphql.schema.types.StripeSubscriptionCard(model.expiryMonth, model.expiryYear, model.last4.map(_ toString), model.brand)
  }

  implicit def stripeSubscriberProtectedNumberMapping(maybeNumber: Option[Int]): graphql.schema.types.StripeSubscriberProtectedNumber = {
    graphql.schema.types.StripeSubscriberProtectedNumber(maybeNumber)
  }
}
