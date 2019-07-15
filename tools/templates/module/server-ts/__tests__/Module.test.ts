import { expect } from 'chai';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';

import { getApollo } from '@gqlapp/testing-server-ts';

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

  beforeAll(() => {
    apollo = getApollo();
  });

  it('Should send a query to the GraphQL back end', async () => {
    const result = await apollo.query({ query: INTROSPECTION_QUERY });
    expect(result.data).to.have.property('__schema');
  });
});
