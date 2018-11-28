package graphql.resolvers.subscription.contexts

import model.User

//TODO: Hardcoded. Remove this direct ref to other module's model, when an approach for handling intermodular dependencies will be agreed


case class StripeSubscriptionInputContext(subscriptionOwner: Option[User])
