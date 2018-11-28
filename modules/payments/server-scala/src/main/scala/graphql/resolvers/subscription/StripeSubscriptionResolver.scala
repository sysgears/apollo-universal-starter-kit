package graphql.resolvers.subscription

import scala.concurrent.Future

import graphql.schema.types._
import graphql.resolvers.subscription.contexts._

trait StripeSubscriptionResolver {
  def stripeSubscription(inputCtx: StripeSubscriptionInputContext): Future[StripeSubscription]
  def stripeSubscriptionCard(inputCtx: StripeSubscriptionInputContext): Future[StripeSubscriptionCard]
  def stripeSubscriptionProtectedNumber(inputCtx: StripeSubscriptionInputContext): StripeSubscriberProtectedNumber
}
