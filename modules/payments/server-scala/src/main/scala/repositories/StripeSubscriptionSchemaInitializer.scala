package repositories

import com.google.inject.Inject
import core.slick.SchemaInitializer
import models.StripeSubscription
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

class StripeSubscriptionSchemaInitializer @Inject()(database: Database) extends SchemaInitializer[StripeSubscription.Table] {
  override val name: String = StripeSubscription.name
  override val table = TableQuery[StripeSubscription.Table]
  override val db = database
}