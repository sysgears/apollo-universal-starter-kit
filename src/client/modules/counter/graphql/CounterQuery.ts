import gql from 'graphql-tag';

const CounterQuery = gql`
  query CounterQuery {
    counter {
      amount
    }
  }
`;

export { CounterQuery };
