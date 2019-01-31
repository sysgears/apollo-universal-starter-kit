import React from 'react';
import chai from 'chai';
import { step } from 'mocha-steps';

import Renderer from '../../../../../packages/client/src/testHelpers/Renderer';
import { click, find, wait, render } from '../../../../../packages/client/src/testHelpers/testUtils';
import ClientCounter from '../containers/ClientCounter';
import { translate } from '@gqlapp/i18n-client-react';

chai.should();

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

  let app: any;
  let container: any;
  let content;
  const ApolloLinkStateCounterWithI18n = translate('counter')(ClientCounter);

  beforeEach(() => {
    if (app) {
      container = app.container;
      content = container.firstChild;
    }
  });

  step('Counter section renders with link data', () => {
    app = render(renderer.withApollo(<ApolloLinkStateCounterWithI18n />));
    container = app.container;
    content = container.firstChild;
    content.textContent.should.has.string(`The current counter value is ${COUNTER_APOLLO_LINK_VALUE}.`);
  });

  step('Clicking on increase counter button increases counter', async () => {
    const apolloLinkButton = find(container, '#apollo-link-button');
    await click(apolloLinkButton);
    await wait();
    mockedCache.data.clientCounter.amount.should.to.equal(COUNTER_APOLLO_LINK_VALUE + INCREMENT);
  });
});
