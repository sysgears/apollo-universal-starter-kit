package graphql.resolvers.subscription

import graphql.resolvers.subscription.contexts.StripeSubscriptionInputContext
import graphql.schema.types
import repositories.StripeSubscriptionRepo
import com.google.inject.Inject
import com.stripe.model.{Customer, Source, Subscription}
import common.errors.{NotFound, Unauthenticated}
import services.config.subscription.StripeSubscriptionConfigService
import models.StripeSubscription
import utils.StripeParamsUtils

import scala.concurrent.{ExecutionContext, Future}
import scala.language.postfixOps

class StripeSubscriptionResolverImpl @Inject()(stripeSubscriptionRepo: StripeSubscriptionRepo,
                                               stripeSubscriptionConfig: StripeSubscriptionConfigService)
                                              (implicit ec: ExecutionContext) extends StripeSubscriptionResolver with StripeParamsUtils {
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

  //TODO: Fix code duplication. Move all direct stripe logic to a dedicated service
  override def addStripeSubscription(inputCtx: StripeSubscriptionInputContext)
                                    (input: types.StripeSubscriptionInput): Future[types.StripeSubscription] = for {
    currentUser <- Future.successful(inputCtx.subscriptionOwner) failOnNone Unauthenticated()
    userId = currentUser.id.get.toLong
    stripeSubscription <- stripeSubscriptionRepo.getSubscriptionByUserId(userId) flatMap {
      case Some(subscription: StripeSubscription) => for {
        customer <- Future { Customer retrieve subscription.stripeCustomerId }
        stripeSourceId <- Future { customer.getSources create obj("source" -> input.token) } map { _.getId }
        stripeCustomerId = customer.getId
        deactivatedSubscriptionWithNewCC <- stripeSubscriptionRepo.editSubscription {
          import input._
          subscription.copy(
            expiryMonth = Some(expiryMonth), expiryYear = Some(expiryYear), last4 = Some(last4.toInt), brand = Some(brand),
            stripeSourceId = Some(stripeSourceId), stripeCustomerId = stripeCustomerId, active = false, userId = userId
          )
        }
        stripeSubscriptionId <- Future {
          Subscription.create {
            obj(
              "customer" -> stripeCustomerId,
              "items" -> seq(
                obj("plan" -> stripeSubscriptionConfig.plan.id)
              )
            )
          }
        } map { _.getId }
        updatedSubscription <- stripeSubscriptionRepo.editSubscription(deactivatedSubscriptionWithNewCC.copy(stripeSubscriptionId = Some(stripeSubscriptionId), active = true))
      } yield updatedSubscription
      case _ => for {
        customer: Customer <- Future { Customer create obj("email" -> currentUser.email, "source" -> input.token) }
        (stripeSourceId, stripeCustomerId) = (customer.getDefaultSource, customer.getId)
        subscription <- stripeSubscriptionRepo.createSubscription {
          import input._
          StripeSubscription(
            id = None,
            userId = userId,
            active = false,
            stripeSourceId = Some(stripeSourceId),
            stripeCustomerId = stripeCustomerId,
            expiryMonth = Some(expiryMonth),
            expiryYear = Some(expiryYear),
            last4 = Some(last4.toInt),
            brand = Some(brand)
          )
        }
        stripeSubscriptionId <- Future {
          Subscription.create {
            obj(
              "customer" -> stripeCustomerId,
              "items" -> seq(
                obj("plan" -> stripeSubscriptionConfig.plan.id)
              )
            )
          }
        } map { _.getId }
        updatedSubscription = subscription.copy(stripeSubscriptionId = Some(stripeSubscriptionId), active = true)
        _ = stripeSubscriptionRepo.editSubscription(updatedSubscription)
      } yield updatedSubscription
    }
  } yield stripeSubscription

  override def cancelStripeSubscription(inputCtx: StripeSubscriptionInputContext): Future[types.StripeSubscription] = for {
    currentUser <- Future.successful(inputCtx.subscriptionOwner) failOnNone Unauthenticated()
    userId = currentUser.id.get.toLong
    stripeSubscription <- stripeSubscriptionRepo.getSubscriptionByUserId(userId) failOnNone NotFound(s"StripeSubscription(userId: $userId)")
    //TODO: Get rid of option.get
    _ <- Future { Subscription retrieve stripeSubscription.stripeSubscriptionId.get } map { _ cancel null }
    //TODO: Get rid of option.get
    _ <- Future { Source retrieve stripeSubscription.stripeSourceId.get } map { _ detach }
    cancelledSubscription <- stripeSubscriptionRepo.editSubscription(stripeSubscription.copy(active = false, stripeSourceId = None, stripeSubscriptionId = None, expiryMonth = None, expiryYear = None, last4 = None, brand = None))
  } yield cancelledSubscription


  override def updateStripeSubscriptionCard(inputCtx: StripeSubscriptionInputContext)
                                           (input: types.StripeSubscriptionInput): Future[Boolean] = for {
    currentUser <- Future.successful(inputCtx.subscriptionOwner) failOnNone Unauthenticated()
    userId = currentUser.id.get.toLong
    stripeSubscription <- stripeSubscriptionRepo.getSubscriptionByUserId(userId) failOnNone NotFound(s"StripeSubscription(userId: $userId)")
    _ <- Future { Source retrieve stripeSubscription.stripeSourceId.get } map { _ detach }
    customer <- Future { Customer retrieve stripeSubscription.stripeCustomerId }
    stripeSourceId <- Future { customer.getSources create obj("source" -> input.token) } map { _.getId }
    _ <- stripeSubscriptionRepo.editSubscription(stripeSubscription.copy(stripeSourceId = Some(stripeSourceId), expiryMonth = Some(input.expiryMonth), expiryYear = Some(input.expiryYear), last4 = Some(input.last4.toInt), brand = Some(input.brand)))
  } yield true
}
