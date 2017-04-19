import chai from 'chai';
import chaiHttp from 'chai-http';
import { step } from 'mocha-steps';
import { createNetworkInterface } from 'apollo-client';

import getServer from '../../test-helpers/integration_setup';

import createApolloClient from '../../../common/apollo_client';
import COUNT_GET_QUERY from '../../../client/modules/counter/graphql/count_get.graphql';
import COUNT_ADD_MUTATION from '../../../client/modules/counter/graphql/count_add_mutation.graphql';

chai.use(chaiHttp);
chai.should();

const networkInterface = createNetworkInterface({ uri: "http://localhost:8080/graphql" });
const apollo = createApolloClient(networkInterface);

describe('Counter example API works', () => {
  let server;

  before(() => {
    server = getServer();
  });

  step('Has GraphiQL endpoint', () => {
    return chai.request(server).get('/graphiql').end((err, res) => {
      res.status.should.be(200);
      res.body.should.be('{}');
    });
  });

  step('Responds to counter get GraphQL query', () => {
    return apollo.query({ query: COUNT_GET_QUERY }).then(result => {
      result.data.should.deep.equal({ count: { amount: 5, __typename: 'Count' } });
    });
  });

  step('Increments counter on GraphQL mutation', () => {
    return apollo.mutate({ mutation: COUNT_ADD_MUTATION, variables: { amount: 2 } }).then(result => {
      result.data.should.deep.equal({ addCount: { amount: 7, __typename: 'Count' } });
    });
  });
});