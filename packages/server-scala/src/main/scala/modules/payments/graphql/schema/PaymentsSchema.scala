package modules.payments.graphql.schema

import com.google.inject.Inject
import core.graphql.{GraphQLSchema, UserContext}
import sangria.schema.{Argument, Field, OptionType}

import scala.concurrent.{ExecutionContext, Future}

class PaymentsSchema @Inject()()(implicit ec: ExecutionContext) extends GraphQLSchema {
  import modules.payments.graphql.schema.types.input._
  import modules.payments.graphql.schema.types.output._
  import modules.payments.graphql.schema.types.unmarshallers._

  override def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "stripeSubscription",
      fieldType = OptionType(StripeSubscription),
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "stripeSubscriptionProtectedNumber",
      fieldType = OptionType(StripeSubscriberProtectedNumber),
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "stripeSubscriptionCard",
      fieldType = OptionType(StripeSubscriptionCard),
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    )
  )

  override def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "addStripeSubscription",
      fieldType = StripeSubscription,
      arguments = List(Argument("input", StripeSubscriptionInput)),
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "stripeSubscriptionProtectedNumber",
      fieldType = StripeSubscriberProtectedNumber,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    ),
    Field(
      name = "stripeSubscriptionCard",
      fieldType = StripeSubscriptionCard,
      resolve = { ctx => Future.successful(null) /*TODO: Stub*/ }
    )
  )
}
