package modules.payments.models

import slick.jdbc.SQLiteProfile.api.{Table => SlickTable, _}
import scala.language.postfixOps

/**
  * A model for storing info about some stripe subscription
  */
case class StripeSubscription(id: Option[Long] = None,
                              userId: Long,
                              active: Boolean,
                              stripeSourceId: String,
                              stripeCustomerId: String,
                              stripeSubscriptionId: String,
                              expiryMonth: Long,
                              expiryYear: Long,
                              last4: Int,
                              brand: String)

/**
  * Defines slick schema for the "stripe_subscription" table
  */
object StripeSubscription extends ((Option[Long], Long, Boolean, String, String, String, Long, Long, Int, String) => StripeSubscription) {
  val name = "stripe_subscription"

  class Table(tag: Tag) extends SlickTable[StripeSubscription](tag, name) {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    //TODO: Define some kind of foreign key to User table, when an approach for handling intermodular dependencies will be agreed
    def userId = column[Long]("user_id")
    def active = column[Boolean]("active")
    def stripeSourceId = column[String]("stripe_source_id")
    def stripeCustomerId = column[String]("stripe_customer_id")
    def stripeSubscriptionId = column[String]("stripe_subscription_id")
    def expiryMonth = column[Long]("expiry_month")
    def expiryYear = column[Long]("expiry_year")
    def last4 = column[Int]("last4")
    def brand = column[String]("brand")

    override def * = (id ?, userId, active, stripeSourceId, stripeCustomerId, stripeSubscriptionId, expiryMonth,
      expiryYear, last4, brand).mapTo[StripeSubscription]
  }
}