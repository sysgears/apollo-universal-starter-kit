package graphql.schema
import modules.common.FieldError

package object types {
  case class StripeSubscription(
    active: Boolean,
    errors: Option[List[FieldError]] = None
  )

  case class StripeSubscriptionCard(
    expiryMonth: Option[Int] = None,
    expiryYear: Option[Int] = None,
    last4: Option[String] = None,
    brand: Option[String] = None
  )

  case class StripeSubscriberProtectedNumber(
    number: Option[Int] = None
  )

  case class StripeSubscriptionInput(
    token: String,
    expiryMonth: Int,
    expiryYear: Int,
    last4: String,
    brand: String
  )
}
