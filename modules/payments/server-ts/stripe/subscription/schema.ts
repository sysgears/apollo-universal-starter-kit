import gql from 'graphql-tag';

export default gql`
  type StripeSubscription {
    active: Boolean!
  }

  type StripeSubscriptionCard {
    expiryMonth: Int
    expiryYear: Int
    last4: String
    brand: String
  }

  type StripeSubscriberProtectedNumber {
    number: Int
  }

  input StripeSubscriptionInput {
    token: String!
    expiryMonth: Int!
    expiryYear: Int!
    last4: String!
    brand: String!
  }

  extend type Query {
    # Get current user's subscription
    stripeSubscription: StripeSubscription
    # Get magic number only available to subscribers
    stripeSubscriptionProtectedNumber: StripeSubscriberProtectedNumber
    # Get payment information for current user's subscription
    stripeSubscriptionCard: StripeSubscriptionCard
  }

  extend type Mutation {
    # Subscribe a user
    addStripeSubscription(input: StripeSubscriptionInput!): StripeSubscription!
    # Cancel a user's subscription
    cancelStripeSubscription: StripeSubscription!
    # Update a user's card information
    updateStripeSubscriptionCard(input: StripeSubscriptionInput!): Boolean!
  }
`;
