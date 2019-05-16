import gql from 'graphql-tag';

export default gql`
  extend type Query {
    #excelReport
    excel: [Int]
  }
`;
