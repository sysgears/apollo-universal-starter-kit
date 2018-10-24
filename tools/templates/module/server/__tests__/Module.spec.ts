import chai, { expect } from 'chai';
import { Server } from 'http';
import { ApolloClient } from 'apollo-client';
import { step } from 'mocha-steps';
import { getServer, getApollo } from '../../../testHelpers/integrationSetup';
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
  let server: Server;
  let apollo: ApolloClient<any>;

  before(() => {
    server = getServer();
    apollo = getApollo();
  });

  step('Should have a GraphiQL endpoint', () => {
    return chai
      .request(server)
      .keepOpen()
      .get('/graphiql')
      .set('Accept', 'text/html')
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.eql({});
      });
  });

  step('Should send a query to the GraphQL back end', async () => {
    const result = await apollo.query({ query: INTROSPECTION_QUERY });
    expect(result.data).to.have.property('__schema');
  });
});
