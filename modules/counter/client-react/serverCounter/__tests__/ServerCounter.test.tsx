import React from 'react';

import { act, fireEvent, render, waitForElement, wait, RenderResult } from '@testing-library/react';

import { Renderer } from '@gqlapp/testing-client-react';
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

  let dom: RenderResult;

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
    const graphQLButton = dom.getByText('Increase server counter');

    act(() => {
      fireEvent.click(graphQLButton);
    });

    await waitForElement(() => dom.getByText(RegExp(`The current counter value is ${INC_COUNTER_VALUE + 1}.`)));
  });

  it('Check subscribed to counter updates', () => {
    expect(renderer.getSubscriptions(COUNTER_SUBSCRIPTION)).toHaveLength(1);
  });

  it('Updates counter on data from subscription', async () => {
    const subscription = renderer.getSubscriptions(COUNTER_SUBSCRIPTION)[0];

    act(() => {
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
