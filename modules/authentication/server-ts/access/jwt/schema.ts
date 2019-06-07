import gql from 'graphql-tag';

export default gql`
  extend type Mutation {
    # Refresh user tokens
    refreshTokens(refreshToken: String!): Tokens!
    logoutFromAllDevices(deviceId: String!): Tokens!
  }

  extend type Subscription {
    subscriptionLogoutFromAllDevices(input: LogoutSubscriptionInput): String
  }

  input LogoutSubscriptionInput {
    id: Int
    deviceId: String!
  }
`;
