package guice.modules

import graphql.resolvers.subscription.{StripeSubscriptionResolver, StripeSubscriptionResolverImpl}
import repositories.{StripeSubscriptionRepo, StripeSubscriptionRepoImpl}
import net.codingwell.scalaguice.ScalaModule

class PaymentsModule extends ScalaModule {
  override def configure(): Unit = {
    bind[StripeSubscriptionRepo].to[StripeSubscriptionRepoImpl]
    bind[StripeSubscriptionResolver].to[StripeSubscriptionResolverImpl]
  }
}
