import gql from 'graphql-tag';

export default gql`
  # Report
  type Report {
    id: Int!
    name: String!
    phone: String!
    email: String!
  }

  extend type Query {
    #Report
    report: [Report]
  }
`;
