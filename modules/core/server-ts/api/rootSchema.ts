import gql from 'graphql-tag';

export default gql`
  type FieldError {
    field: String!
    message: String!
  }

  type Query {
    dummy: Int
  }

  type Mutation {
    dummy: Int
  }

  type Subscription {
    dummy: Int
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
