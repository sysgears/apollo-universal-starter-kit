import gql from 'graphql-tag';

export default gql`
  # Entity
  type TypeName {
    typeName: String!
  }

  extend type Query {
    queryName: TypeName
  }

  extend type Mutation {
    mutationName(varName: Int!): TypeName
  }

  extend type Subscription {
    subscriptionName: TypeName
  }
`;
