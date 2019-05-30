import gql from 'graphql-tag';

export default gql`
  extend type Mutation {
    # Refresh user tokens
    refreshTokens(refreshToken: String!): Tokens!
    logoutFromAllDevices(accessToken: String!): Tokens!
  }

  extend type Subscription {
    subscriptionLogoutFromAllDevices(token: String!): LogoutPayload
  }

  # Payload for Subscription
  type LogoutPayload {
    token: String
  }
`;
