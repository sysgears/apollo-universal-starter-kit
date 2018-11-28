package repositories

import com.google.inject.Inject
import core.slick.{SchemaInitializer, SchemaUtil}
import models.StripeSubscription
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.{ExecutionContext, Future}

class StripeSubscriptionSchemaInitializer @Inject()(database: Database)
                                                   (implicit executionContext: ExecutionContext) extends SchemaInitializer with SchemaUtil {
  val stripeSubscriptions: TableQuery[StripeSubscription.Table] = TableQuery[StripeSubscription.Table]

  override def create(): Future[Unit] = withTable(database, stripeSubscriptions, StripeSubscription.name, _.isEmpty) {
    stripeSubscriptions.schema.create
  }

  override def drop(): Future[Unit] = withTable(database, stripeSubscriptions, StripeSubscription.name, _.nonEmpty) {
    stripeSubscriptions.schema.drop
  }
}
