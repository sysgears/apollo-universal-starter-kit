import chai from 'chai';
import { step } from 'mocha-steps';

import { getServer, getApollo } from '../../testHelpers/integrationSetup';

import COUNTER_QUERY from '../../../client/modules/counter/graphql/CounterQuery.graphql';
import ADD_COUNTER from '../../../client/modules/counter/graphql/AddCounter.graphql';
import COUNTER_SUBSCRIPTION from '../../../client/modules/counter/graphql/CounterSubscription.graphql';

describe('Counter example API works', () => {
  let server, apollo;

  before(() => {
    server = getServer();
    apollo = getApollo();
  });

  step('Has GraphiQL endpoint', () => {
    return chai
      .request(server)
      .get('/graphiql')
      .end((err, res) => {
        res.status.should.be(200);
        res.body.should.be('{}');
      });
  });

  step('Responds to counter get GraphQL query', async () => {
    let result = await apollo.query({ query: COUNTER_QUERY });

    result.data.should.deep.equal({
      counter: { amount: 5, __typename: 'Counter' }
    });
  });

  step('Increments counter on GraphQL mutation', async () => {
    let result = await apollo.mutate({
      mutation: ADD_COUNTER,
      variables: { amount: 2 }
    });

    result.data.should.deep.equal({
      addCounter: { amount: 7, __typename: 'Counter' }
    });
  });

  step('Triggers subscription on GraphQL mutation', done => {
    apollo.mutate({ mutation: ADD_COUNTER, variables: { amount: 1 } });

    apollo
      .subscribe({
        query: COUNTER_SUBSCRIPTION,
        variables: {}
      })
      .subscribe({
        next(data) {
          data.should.deep.equal({
            counterUpdated: { amount: 8, __typename: 'Counter' }
          });
          done();
        }
      });
  });
});
