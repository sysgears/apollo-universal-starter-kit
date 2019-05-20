import gql from 'graphql-tag';

export default gql`
  input GoogleExpoLoginInput {
    accessToken: String!
  }

  type GoogleExpoLoginPayload {
    accessToken: String
    refreshToken: String
  }

  extend type Mutation {
    googleExpoLogin(input: GoogleExpoLoginInput!): GoogleExpoLoginPayload!
  }
`;
