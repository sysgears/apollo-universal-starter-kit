import React from 'react';
import chai from 'chai';
import { step } from 'mocha-steps';
import { render } from 'react-testing-library';

import Renderer from '../../../../testHelpers/Renderer';
import { click, find } from '../../../../testHelpers/testUtils';
import ClientCounter from './ClientCounter';
import translate from '../../../../i18n';

chai.should();

const COUNTER_APOLLO_LINK_VALUE = 1;
const INC_COUNTER_VALUE = COUNTER_APOLLO_LINK_VALUE + 5;

const mocks = {
  counterState: () => {
    return {
      counter: COUNTER_APOLLO_LINK_VALUE,
      __typename: 'CounterState'
    };
  },
  Mutation: () => ({
    addCounterState: (obj, { amount }) => {
      console.log('INCREMENT_COUNTER');
      return {
        amount: INC_COUNTER_VALUE + amount,
        __typename: 'CounterState'
      };
    }
  })
};

describe('Apollo link counter example UI works', () => {
  const renderer = new Renderer(mocks, {});
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
  /*TODO Don't work. Need to add apollo link state supporting to the Renderer class*/
  step('Clicking on increase counter button shows optimistic response', () => {
    const apolloLinkButton = find(container, '#apollo-link-button');
    click(apolloLinkButton);
    content.textContent.should.has.string(`Current apolloLinkStateCount, is ${COUNTER_APOLLO_LINK_VALUE + 1}.`);
  });
});
