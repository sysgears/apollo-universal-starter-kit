package modules.payments.guice.modules

import modules.payments.graphql.resolvers.subscription.{StripeSubscriptionResolver, StripeSubscriptionResolverImpl}
import modules.payments.repositories.{StripeSubscriptionRepo, StripeSubscriptionRepoImpl}
import net.codingwell.scalaguice.ScalaModule

class PaymentsModule extends ScalaModule {
  override def configure(): Unit = {
    bind[StripeSubscriptionRepo].to[StripeSubscriptionRepoImpl]
    bind[StripeSubscriptionResolver].to[StripeSubscriptionResolverImpl]
  }
}
