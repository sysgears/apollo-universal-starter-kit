import gql from 'graphql-tag';

export default gql`
  extend type Mutation {
    # Refresh user tokens
    refreshTokens(refreshToken: String!): Tokens!
  }
`;
