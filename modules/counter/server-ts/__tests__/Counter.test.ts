import { getApollo } from '@gqlapp/testing-server-ts';
import { COUNTER_QUERY, ADD_COUNTER, COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';

describe('Counter example API works', () => {
  let apollo: any;

  beforeAll(() => {
    apollo = getApollo();
  });

  // eslint-disable-next-line jest/expect-expect
  it('Responds to counter get GraphQL query', async () => {
    const result = await apollo.query({ query: COUNTER_QUERY });

    result.data.should.deep.equal({
      serverCounter: { amount: 5, __typename: 'Counter' },
    });
  });

  // eslint-disable-next-line jest/expect-expect
  it('Increments counter on GraphQL mutation', async () => {
    const result = await apollo.mutate({
      mutation: ADD_COUNTER,
      variables: { amount: 2 },
    });

    result.should.deep.equal({
      data: { addServerCounter: { amount: 7, __typename: 'Counter' } },
    });
  });

  // eslint-disable-next-line jest/expect-expect
  it('Triggers subscription on GraphQL mutation', async () => {
    apollo.mutate({ mutation: ADD_COUNTER, variables: { amount: 1 } });

    return new Promise((resolve) => {
      apollo
        .subscribe({
          query: COUNTER_SUBSCRIPTION,
          variables: {},
        })
        .subscribe({
          next(data: any) {
            data.should.deep.equal({
              data: { counterUpdated: { amount: 8, __typename: 'Counter' } },
            });
            resolve(null);
          },
        });
    });
  });
});
