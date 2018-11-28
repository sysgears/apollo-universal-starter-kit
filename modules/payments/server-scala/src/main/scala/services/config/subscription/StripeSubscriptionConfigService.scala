package services.config.subscription

import com.google.inject.Inject
import com.typesafe.config.Config

/**
  * A service for reading stripe subscription configuration
  *
  * @param config a service for reading application config
  */
class StripeSubscriptionConfigService @Inject()(config: Config) {
  val rootConf: Config = config atPath "subscription.stripe"

  object product {
    val name: String = rootConf.getString("product.name")
    val `type`: String = rootConf.getString("product.type")
  }

  object plan {
    val id: String = rootConf.getString("plan.id")
    val nickname: String = rootConf.getString("plan.nickname")
    val amount: Long = rootConf.getLong("plan.amount")
    val interval: String = rootConf.getString("plan.amount")
    val currency: String = rootConf.getString("plan.amount")
  }
}
