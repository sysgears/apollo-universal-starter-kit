package modules.payments.graphql.schema
import modules.common.FieldError

package object types {
  case class StripeSubscription(
    active: Boolean,
    errors: List[FieldError]
  )

  case class StripeSubscriptionCard(
    expiryMonth: Option[Int],
    expiryYear: Option[Int],
    last4: Option[String],
    brand: Option[String]
  )

  case class StripeSubscriberProtectedNumber(
    number: Option[Int]
  )

  case class StripeSubscriptionInput(
    token: String,
    expiryMonth: Int,
    expiryYear: Int,
    last4: String,
    brand: String
  )
}
