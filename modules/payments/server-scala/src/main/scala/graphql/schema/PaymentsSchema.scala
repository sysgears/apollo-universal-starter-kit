package graphql.schema

import com.google.inject.Inject
import core.graphql.{GraphQLSchema, UserContext}
import graphql.resolvers.subscription.StripeSubscriptionResolver
import graphql.resolvers.subscription.contexts.StripeSubscriptionInputContext
import sangria.schema._

import scala.concurrent.ExecutionContext

class PaymentsSchema @Inject()(stripeSubscriptionResolver: StripeSubscriptionResolver)
                              (implicit ec: ExecutionContext) extends GraphQLSchema {
  import graphql.schema.types.input._
  import graphql.schema.types.output._
  import graphql.schema.types.unmarshallers._
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
      resolve = {
        ctx => addStripeSubscription(StripeSubscriptionInputContext(null /*TODO: Stub. Resolve when userContext in User module will be implemented*/)) {
          ctx.arg[types.StripeSubscriptionInput]("input")
        }
      }
    ),
    Field(
      name = "updateStripeSubscriptionCard",
      fieldType = BooleanType,
      arguments = List(Argument("input", StripeSubscriptionInput)),
      resolve = {
        ctx => updateStripeSubscriptionCard(StripeSubscriptionInputContext(null /*TODO: Stub. Resolve when userContext in User module will be implemented*/)) {
          ctx.arg[types.StripeSubscriptionInput]("input")
        }
      }
    ),
    Field(
      name = "cancelStripeSubscription",
      fieldType = StripeSubscription,
      resolve = { ctx => cancelStripeSubscription(StripeSubscriptionInputContext(null /*TODO: Stub. Resolve when userContext in User module will be implemented*/)) }
    )
  )
}
