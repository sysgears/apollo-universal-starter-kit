import React from 'react';

import { act, fireEvent, render, wait, waitForElement, RenderResult } from '@testing-library/react';
import { Renderer } from '@gqlapp/testing-client-react';

import ClientCounter from '../containers/ClientCounter';

const COUNTER_APOLLO_LINK_VALUE = 20;
const INCREMENT = 1;

const mockedCache = {
  data: {
    clientCounter: {
      amount: COUNTER_APOLLO_LINK_VALUE,
      __typename: 'ClientCounter'
    }
  }
};

const resolvers = {
  defaults: {
    clientCounter: { amount: COUNTER_APOLLO_LINK_VALUE, __typename: 'ClientCounter' }
  },
  resolvers: {
    Query: {
      clientCounter: () => mockedCache.data.clientCounter
    },
    Mutation: {
      addClientCounter: (): any => {
        mockedCache.data = {
          clientCounter: {
            amount: mockedCache.data.clientCounter.amount + INCREMENT,
            __typename: 'ClientCounter'
          }
        };
        return null;
      }
    }
  }
};

describe('Client counter example UI works', () => {
  const renderer = new Renderer({}, {}, resolvers);

  let dom: RenderResult;

  it('Counter section renders with link data', async () => {
    act(() => {
      dom = render(renderer.withApollo(<ClientCounter />));
    });

    await waitForElement(() => dom.getByText(RegExp(`The current counter value is ${COUNTER_APOLLO_LINK_VALUE}.`)));
  });

  it('Clicking on increase counter button increases counter', async () => {
    const apolloLinkButton = dom.getByText('Increase Apollo Link State counter');

    act(() => {
      fireEvent.click(apolloLinkButton);
    });

    await wait(() => {
      expect(mockedCache.data.clientCounter.amount).toEqual(COUNTER_APOLLO_LINK_VALUE + INCREMENT);
    });
  });
});
