import chai from 'chai';
import { step } from 'mocha-steps';

import { getServer, getApollo } from '../../test-helpers/integration_setup';

import COUNT_GET_QUERY from '../../../client/modules/counter/graphql/count_get.graphql';
import COUNT_ADD_MUTATION from '../../../client/modules/counter/graphql/count_add_mutation.graphql';
import COUNT_SUBSCRIPTION from '../../../client/modules/counter/graphql/count_subscribe.graphql';

describe('Counter example API works', () => {
  let server, apollo;

  before(() => {
    server = getServer();
    apollo = getApollo();
  });

  step('Has GraphiQL endpoint', () => {
    return chai.request(server).get('/graphiql').end((err, res) => {
      res.status.should.be(200);
      res.body.should.be('{}');
    });
  });

  step('Responds to counter get GraphQL query', async () => {
    let result = await apollo.query({ query: COUNT_GET_QUERY });

    result.data.should.deep.equal({ count: { amount: 5, __typename: 'Count' } });
  });

  step('Increments counter on GraphQL mutation', async () => {
    let result = await apollo.mutate({ mutation: COUNT_ADD_MUTATION, variables: { amount: 2 } });

    result.data.should.deep.equal({ addCount: { amount: 7, __typename: 'Count' } });
  });

  step('Triggers subscription on GraphQL mutation', done => {
    apollo.subscribe({
      query: COUNT_SUBSCRIPTION,
      variables: {},
    }).subscribe({
      next(data) {
        data.should.deep.equal({ countUpdated: { amount: 8, __typename: 'Count' } });
        done();
      }
    });

    apollo.mutate({ mutation: COUNT_ADD_MUTATION, variables: { amount: 1 } });
  });
});