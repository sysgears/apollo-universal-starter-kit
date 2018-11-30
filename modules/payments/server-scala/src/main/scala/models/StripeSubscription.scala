package models

import slick.jdbc.SQLiteProfile.api.{Table => SlickTable, _}
import scala.language.postfixOps

/**
  * A model for storing info about some stripe subscription
  */
case class StripeSubscription(id: Option[Long] = None,
                              userId: Long,
                              active: Boolean,
                              stripeSourceId: Option[String] = None,
                              stripeCustomerId: String,
                              stripeSubscriptionId: Option[String] = None,
                              expiryMonth: Option[Int] = None,
                              expiryYear: Option[Int] = None,
                              last4: Option[Int] = None,
                              brand: Option[String] = None)

/**
  * Defines slick schema for the "stripe_subscription" table
  */
object StripeSubscription extends ((Option[Long], Long, Boolean, Option[String], String, Option[String], Option[Int], Option[Int], Option[Int], Option[String]) => StripeSubscription) {
  val name = "stripe_subscription"

  class Table(tag: Tag) extends SlickTable[StripeSubscription](tag, name) {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    //TODO: Define some kind of foreign key to User table, when an approach for handling intermodular dependencies will be agreed
    def userId = column[Long]("user_id")
    def active = column[Boolean]("active")
    def stripeSourceId = column[Option[String]]("stripe_source_id")
    def stripeCustomerId = column[String]("stripe_customer_id")
    def stripeSubscriptionId = column[Option[String]]("stripe_subscription_id")
    def expiryMonth = column[Option[Int]]("expiry_month")
    def expiryYear = column[Option[Int]]("expiry_year")
    def last4 = column[Option[Int]]("last4")
    def brand = column[Option[String]]("brand")

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
  case class CreditCard(expiryMonth: Option[Int], expiryYear: Option[Int], last4: Option[Int], brand: Option[String])
  object CreditCard {
    /**
      * A helper apply-method for this model that constructs instance from a tuple
      */
    def apply(ccDataTuple: (Option[Int], Option[Int], Option[Int], Option[String])): CreditCard = CreditCard(
      expiryMonth = ccDataTuple._1,
      expiryYear = ccDataTuple._2,
      last4 = ccDataTuple._3,
      brand = ccDataTuple._4
    )
  }
}