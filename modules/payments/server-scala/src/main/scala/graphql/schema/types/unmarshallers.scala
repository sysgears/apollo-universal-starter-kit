package graphql.schema.types

import common.InputUnmarshallerGenerator
import sangria.marshalling.FromInput

object unmarshallers extends InputUnmarshallerGenerator {
  implicit val stripeSubscriptionInputUnmarshaller: FromInput[StripeSubscriptionInput] = inputUnmarshaller {
    input => StripeSubscriptionInput(
      token = input("token").asInstanceOf[String],
      expiryMonth = input("expiryMonth").asInstanceOf[Int],
      expiryYear = input("expiryYear").asInstanceOf[Int],
      last4 = input("last4").asInstanceOf[String],
      brand = input("brand").asInstanceOf[String]
    )
  }
}
