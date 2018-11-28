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
                              expiryMonth: Int,
                              expiryYear: Int,
                              last4: Int,
                              brand: String)

/**
  * Defines slick schema for the "stripe_subscription" table
  */
object StripeSubscription extends ((Option[Long], Long, Boolean, String, String, String, Int, Int, Int, String) => StripeSubscription) {
  val name = "stripe_subscription"

  class Table(tag: Tag) extends SlickTable[StripeSubscription](tag, name) {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    //TODO: Define some kind of foreign key to User table, when an approach for handling intermodular dependencies will be agreed
    def userId = column[Long]("user_id")
    def active = column[Boolean]("active")
    def stripeSourceId = column[String]("stripe_source_id")
    def stripeCustomerId = column[String]("stripe_customer_id")
    def stripeSubscriptionId = column[String]("stripe_subscription_id")
    def expiryMonth = column[Int]("expiry_month")
    def expiryYear = column[Int]("expiry_year")
    def last4 = column[Int]("last4")
    def brand = column[String]("brand")

    override def * = (id ?, userId, active, stripeSourceId, stripeCustomerId, stripeSubscriptionId, expiryMonth,
      expiryYear, last4, brand).mapTo[StripeSubscription]
  }

  /**
    * A separate model, which contains a subset of StripeSubscription's fields, which represent the subscriber's
    * credit card
    *
    * @param expiryMonth a month of a card expiration date
    * @param expiryYear a month of a card expiration date
    * @param last4 last four digits of a credit card number
    * @param brand a credit card brand - "Visa", "MasterCard", etc.
    */
  case class CreditCard(expiryMonth: Int, expiryYear: Int, last4: Int, brand: String)
  object CreditCard {
    /**
      * A helper apply-method for this model that constructs instance from a tuple
      */
    def apply(ccDataTuple: (Int, Int, Int, String)): CreditCard = CreditCard(
      expiryMonth = ccDataTuple._1,
      expiryYear = ccDataTuple._2,
      last4 = ccDataTuple._3,
      brand = ccDataTuple._4
    )
  }
}