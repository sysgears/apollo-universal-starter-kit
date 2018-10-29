import { expect } from 'chai';
import { ApolloClient } from 'apollo-client';
import { step } from 'mocha-steps';
import { getApollo } from '../../../testHelpers/integrationSetup';
import gql from 'graphql-tag';

const INTROSPECTION_QUERY = gql`
  query introspectionQuery {
    __schema {
      types {
        name
      }
    }
  }
`;

describe('$Module$ API works', () => {
  let apollo: ApolloClient<any>;

  before(() => {
    apollo = getApollo();
  });

  step('Should send a query to the GraphQL back end', async () => {
    const result = await apollo.query({ query: INTROSPECTION_QUERY });
    expect(result.data).to.have.property('__schema');
  });
});
