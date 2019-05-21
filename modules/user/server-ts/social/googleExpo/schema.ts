import gql from 'graphql-tag';

export default gql`
  input GoogleExpoLoginInput {
    accessToken: String!
  }

  type ExpoTokens {
    accessToken: String
    refreshToken: String
  }
  type GoogleExpoLoginPayload {
    tokens: ExpoTokens!
  }

  extend type Mutation {
    googleExpoLogin(input: GoogleExpoLoginInput!): GoogleExpoLoginPayload!
  }
`;
