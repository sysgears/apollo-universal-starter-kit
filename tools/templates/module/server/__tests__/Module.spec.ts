import chai, { expect } from 'chai';
import { Server } from 'http';
import { ApolloClient } from 'apollo-client';
import { step } from 'mocha-steps';
import { getServer, getApollo } from '../../../testHelpers/integrationSetup';
import gql from 'graphql-tag';

const BACKEND_SUPPORTED_QUERIES_QUERY = gql`
  query __schema {
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

  step('Has GraphiQL endpoint', () => {
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

  step('Can query to Graphql backend', async () => {
    const result = await apollo.query({ query: BACKEND_SUPPORTED_QUERIES_QUERY });
    expect(result.data).to.have.property('__schema');
  });
});
