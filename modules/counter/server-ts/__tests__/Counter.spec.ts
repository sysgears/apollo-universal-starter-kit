import chai from 'chai';
import { step } from 'mocha-steps';

import { getServer, getApollo } from '../../../../packages/server/src/testHelpers/integrationSetup';

import { COUNTER_QUERY, ADD_COUNTER, COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';

describe('Counter example API works', () => {
  let server: any;
  let apollo: any;

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

  step('Responds to counter get GraphQL query', async () => {
    const result = await apollo.query({ query: COUNTER_QUERY });

    result.data.should.deep.equal({
      serverCounter: { amount: 5, __typename: 'Counter' }
    });
  });

  step('Increments counter on GraphQL mutation', async () => {
    const result = await apollo.mutate({
      mutation: ADD_COUNTER,
      variables: { amount: 2 }
    });

    result.should.deep.equal({
      data: { addServerCounter: { amount: 7, __typename: 'Counter' } }
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
        next(data: any) {
          data.should.deep.equal({
            data: { counterUpdated: { amount: 8, __typename: 'Counter' } }
          });
          done();
        }
      });
  });
});
