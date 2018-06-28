import React from 'react';
import chai from 'chai';
import { step } from 'mocha-steps';
import { render } from 'react-testing-library';

import Renderer from '../../../../testHelpers/Renderer';
import { click, find } from '../../../../testHelpers/testUtils';
import ClientCounter from './ClientCounter';
import translate from '../../../../i18n';

chai.should();

const COUNTER_APOLLO_LINK_VALUE = 20;
const INCREMENT = 1;

const mockedCache = {
  data: {
    counterState: {
      counter: COUNTER_APOLLO_LINK_VALUE,
      __typename: 'CounterState'
    }
  }
};

const resolvers = {
  defaults: {
    counterState: { counter: COUNTER_APOLLO_LINK_VALUE, __typename: 'CounterState' }
  },
  resolvers: {
    Query: {
      counterState: () => mockedCache.data.counterState
    },
    Mutation: {
      addCounterState: () => {
        mockedCache.data = {
          counterState: {
            counter: mockedCache.data.counterState.counter + INCREMENT,
            __typename: 'CounterState'
          }
        };
        return null;
      }
    }
  }
};

describe('Apollo link counter example UI works', () => {
  const renderer = new Renderer({}, {}, resolvers);

  let app;
  let container;
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
    content.textContent.should.has.string(`Current apolloLinkStateCount, is ${COUNTER_APOLLO_LINK_VALUE}.`);
  });

  step('Clicking on increase counter button shows optimistic response', async () => {
    const apolloLinkButton = find(container, '#apollo-link-button');
    await click(apolloLinkButton);
    mockedCache.data.counterState.counter.should.to.equal(COUNTER_APOLLO_LINK_VALUE + INCREMENT);
  });
});
