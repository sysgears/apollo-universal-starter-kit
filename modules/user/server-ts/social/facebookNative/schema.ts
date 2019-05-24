import gql from 'graphql-tag';

export default gql`
  input LoginInputFacebookNative {
    accessToken: String!
  }

  type LoginPayloadFacebookNative {
    user: User
    tokens: Tokens
  }

  extend type Mutation {
    loginFacebookNative(input: LoginInputFacebookNative!): LoginPayloadFacebookNative
  }
`;
