import React from 'react';
import { act } from 'react-dom/test-utils';

import { render } from '@testing-library/react';
import { click, Renderer, waitForElement, wait } from '@gqlapp/testing-client-react';
import { COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';

import ServerCounter from '../containers/ServerCounter';

const COUNTER_APOLLO_VALUE = 11;
const INC_COUNTER_VALUE = COUNTER_APOLLO_VALUE + 5;
const COUNTER_SUBSCRIPTION_VALUE = 17;

const mocks = {
  Counter: () => ({
    amount: COUNTER_APOLLO_VALUE,
    __typename: 'Counter'
  }),
  Mutation: () => ({
    addServerCounter: (obj: any, { amount }: any) => ({
      amount: INC_COUNTER_VALUE + amount,
      __typename: 'Counter'
    })
  })
};

describe('Server counter example UI works', () => {
  const renderer = new Renderer(mocks, {});
  let dom: any;

  it('Counter section renders without data', async () => {
    act(() => {
      dom = render(renderer.withApollo(<ServerCounter />));
    });
    await waitForElement(() => dom.getByText('loading'));
  });

  it('Counter section renders with queries data', async () => {
    await waitForElement(() => dom.getByText(RegExp(`The current counter value is ${COUNTER_APOLLO_VALUE}.`)));
  });

  it('Section shows GraphQL response when it arrives after button click', async () => {
    act(() => {
      const graphQLButton = dom.getByTestId('increase-button');
      click(graphQLButton);
    });

    await waitForElement(() => dom.getByText(RegExp(`The current counter value is ${INC_COUNTER_VALUE + 1}.`)));
  });

  it('Check subscribed to counter updates', () => {
    expect(renderer.getSubscriptions(COUNTER_SUBSCRIPTION)).toHaveLength(1);
  });

  it('Updates counter on data from subscription', async () => {
    act(() => {
      const subscription = renderer.getSubscriptions(COUNTER_SUBSCRIPTION)[0];
      subscription.next({
        data: {
          counterUpdated: { amount: COUNTER_SUBSCRIPTION_VALUE, __typename: 'Counter' }
        }
      });
    });
    await waitForElement(() => dom.getByText(RegExp(`The current counter value is ${COUNTER_SUBSCRIPTION_VALUE}.`)));
  });

  it('Unmount section and check unsubscription', async () => {
    act(() => {
      dom.unmount();
    });

    await wait(() => {
      expect(renderer.getSubscriptions(COUNTER_SUBSCRIPTION)).toHaveLength(0);
    });
  });
});
