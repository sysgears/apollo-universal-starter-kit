package modules.payments.graphql.schema

import com.google.inject.Inject
import core.graphql.{GraphQLSchema, UserContext}
import modules.payments.graphql.resolvers.subscription.StripeSubscriptionResolver
import modules.payments.graphql.resolvers.subscription.contexts.StripeSubscriptionInputContext
import sangria.schema.{Argument, Field, OptionType}

import scala.concurrent.{ExecutionContext, Future}

class PaymentsSchema @Inject()(stripeSubscriptionResolver: StripeSubscriptionResolver)
                              (implicit ec: ExecutionContext) extends GraphQLSchema {
  import modules.payments.graphql.schema.types.input._
  import modules.payments.graphql.schema.types.output._
  import modules.payments.graphql.schema.types.unmarshallers._
  import stripeSubscriptionResolver._

  override def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "stripeSubscription",
      fieldType = OptionType(StripeSubscription),
      resolve = { ctx => stripeSubscription(StripeSubscriptionInputContext(null /*TODO: Stub. Resolve when userContext in User module will be implemented*/)) }
    ),
    Field(
      name = "stripeSubscriptionProtectedNumber",
      fieldType = OptionType(StripeSubscriberProtectedNumber),
      resolve = { ctx => stripeSubscriptionProtectedNumber(StripeSubscriptionInputContext(null /*TODO: Stub. Resolve when userContext in User module will be implemented*/)) }
    ),
    Field(
      name = "stripeSubscriptionCard",
      fieldType = OptionType(StripeSubscriptionCard),
      resolve = { ctx => stripeSubscriptionCard(StripeSubscriptionInputContext(null /*TODO: Stub. Resolve when userContext in User module will be implemented*/)) }
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
