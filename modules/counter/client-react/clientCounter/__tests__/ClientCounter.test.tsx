import React from 'react';
import { act } from 'react-dom/test-utils';

import { click, wait, render, Renderer, waitForElement } from '@gqlapp/testing-client-react';

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

  let dom: any;

  it('Counter section renders with link data', async () => {
    act(() => {
      dom = render(renderer.withApollo(<ClientCounter />));
    });

    await waitForElement(() => dom.getByText(RegExp(`The current counter value is ${COUNTER_APOLLO_LINK_VALUE}.`)));
  });

  it('Clicking on increase counter button increases counter', async () => {
    act(() => {
      const apolloLinkButton = dom.getByTestId('apollo-link-button');
      click(apolloLinkButton);
    });

    await wait(() => {
      expect(mockedCache.data.clientCounter.amount).toEqual(COUNTER_APOLLO_LINK_VALUE + INCREMENT);
    });
  });
});
