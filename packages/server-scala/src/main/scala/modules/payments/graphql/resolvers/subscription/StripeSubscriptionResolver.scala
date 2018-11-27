package modules.payments.graphql.resolvers.subscription

import scala.concurrent.Future

import modules.payments.graphql.schema.types._
import modules.payments.graphql.resolvers.subscription.contexts._

trait StripeSubscriptionResolver {
  def stripeSubscription(inputCtx: StripeSubscriptionInputContext): Future[StripeSubscription]
  def stripeSubscriptionCard(inputCtx: StripeSubscriptionInputContext): Future[StripeSubscriptionCard]
  def stripeSubscriptionProtectedNumber(inputCtx: StripeSubscriptionInputContext): StripeSubscriberProtectedNumber
}
