package repositories

import com.google.inject.Inject
import common.errors.NotFound
import models.StripeSubscription
import slick.jdbc.SQLiteProfile.api._

import scala.concurrent.{ExecutionContext, Future}
import scala.language.postfixOps

trait StripeSubscriptionRepo {
  def createSubscription(subscription: StripeSubscription): Future[StripeSubscription]
  def editSubscription(subscription: StripeSubscription): Future[StripeSubscription]
  def getSubscriptionByUserId(userId: Long): Future[Option[StripeSubscription]]
  def getSubscriptionByStripeSubscriptionId(stripeSubscriptionId: String): Future[Option[StripeSubscription]]
  def getSubscriptionByStripeCustomerId(stripeCustomerId: String): Future[Option[StripeSubscription]]
  def getCreditCardByUserId(userId: Long): Future[Option[StripeSubscription.CreditCard]]
}

class StripeSubscriptionRepoImpl @Inject()(db: Database)(implicit executionContext: ExecutionContext) extends StripeSubscriptionRepo {
  def stripeSubscriptions = TableQuery[StripeSubscription.Table]

  override def createSubscription(subscription: StripeSubscription): Future[StripeSubscription] = db run {
    stripeSubscriptions returning stripeSubscriptions.map(_.id) into {
      (subscription, id) => subscription.copy(id = Some(id))
    } += subscription
  }

  override def editSubscription(stripeSubscription: StripeSubscription): Future[StripeSubscription] = db run {
    stripeSubscriptions.filter(_.id === stripeSubscription.id).update(stripeSubscription).flatMap {
      case 0 => DBIO.failed(NotFound(s"StripeSubscription(id: ${stripeSubscription.id})"))
      case _ => DBIO.successful(stripeSubscription)
    }: DBIOAction[StripeSubscription, NoStream, Effect.Write with Effect]
  }

  override def getSubscriptionByUserId(userId: Long): Future[Option[StripeSubscription]] = db run {
    stripeSubscriptions.filter(_.userId === userId).take(1).result.headOption
  }

  override def getSubscriptionByStripeSubscriptionId(stripeSubscriptionId: String): Future[Option[StripeSubscription]] = db run {
    stripeSubscriptions.filter(_.stripeSubscriptionId === stripeSubscriptionId).take(1).result.headOption
  }

  override def getSubscriptionByStripeCustomerId(stripeCustomerId: String): Future[Option[StripeSubscription]] = db run {
    stripeSubscriptions.filter(_.stripeCustomerId === stripeCustomerId).take(1).result.headOption
  }

  override def getCreditCardByUserId(userId: Long): Future[Option[StripeSubscription.CreditCard]] = db run {
    for {
      maybeCCData <- stripeSubscriptions.filter(_.userId === userId).take(1).map(ss => (ss.expiryMonth, ss.expiryYear, ss.last4, ss.brand)).result.headOption
      maybeCreditCard = maybeCCData map (StripeSubscription.CreditCard(_))
    } yield maybeCreditCard
  }
}
