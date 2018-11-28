package graphql.resolvers.subscription

import graphql.resolvers.subscription.contexts.StripeSubscriptionInputContext
import graphql.schema.types
import repositories.StripeSubscriptionRepo
import com.google.inject.Inject
import common.errors.{NotFound, Unauthenticated}

import scala.concurrent.{ExecutionContext, Future}
import scala.language.postfixOps

class StripeSubscriptionResolverImpl @Inject()(stripeSubscriptionRepo: StripeSubscriptionRepo)
                                              (implicit ec: ExecutionContext) extends StripeSubscriptionResolver {
  import common.implicits.RichFuture._
  import graphql.schema.types.mappings._

  override def stripeSubscription(inputCtx: StripeSubscriptionInputContext): Future[types.StripeSubscription] = for {
    currentUser <- Future.successful(inputCtx.subscriptionOwner) failOnNone Unauthenticated()
    userId = currentUser.id.get.toLong
    subscription <- stripeSubscriptionRepo.getSubscriptionByUserId(currentUser.id.get) failOnNone NotFound(s"StripeSubscription(userId: $userId)")
  } yield subscription

  override def stripeSubscriptionCard(inputCtx: StripeSubscriptionInputContext): Future[types.StripeSubscriptionCard] = for {
    currentUser <- Future.successful(inputCtx.subscriptionOwner) failOnNone Unauthenticated()
    userId = currentUser.id.get.toLong
    creditCard <- stripeSubscriptionRepo.getCreditCardByUserId(userId) failOnNone NotFound(s"StripeSubscriptionCard(userId: $userId)")
  } yield creditCard

  override def stripeSubscriptionProtectedNumber(inputCtx: StripeSubscriptionInputContext): types.StripeSubscriberProtectedNumber = {
    inputCtx.subscriptionOwner.map(_ => Math.floor(Math.random() * 10) toInt)
  }

  override def addStripeSubscription(inputCtx: StripeSubscriptionInputContext)
                                    (input: types.StripeSubscriptionInput): Future[types.StripeSubscription] = ???

  override def cancelStripeSubscription: Future[types.StripeSubscription] = ???

  override def updateStripeSubscriptionCard(input: types.StripeSubscriptionInput): Future[Boolean] = ???
}
