import gql from 'graphql-tag';

export default gql`
  extend type Mutation {
    # Logout user
    logout: String
    logoutFromAllDevices(deviceId: String!): String
  }

  extend type Subscription {
    subscriptionLogoutFromAllDevices(input: LogoutSubscriptionInput): String
  }

  input LogoutSubscriptionInput {
    id: Int
    deviceId: String!
  }
`;
