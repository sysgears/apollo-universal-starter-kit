package modules.payments.graphql.resolvers.subscription.contexts

//TODO: Hardcoded. Remove this direct ref to other module's model, when an approach for handling intermodular dependencies will be agreed
import modules.user.model.User

case class StripeSubscriptionInputContext(subscriptionOwner: Option[User])
