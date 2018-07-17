import React from 'react';
import chai from 'chai';
import { step } from 'mocha-steps';
import { render } from 'react-testing-library';

import Renderer from '../../../../testHelpers/Renderer';
import { click, find } from '../../../../testHelpers/testUtils';
import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';
import ServerCounter from './ServerCounter';
import translate from '../../../../i18n';

chai.should();

const COUNTER_APOLLO_VALUE = 11;
const INC_COUNTER_VALUE = COUNTER_APOLLO_VALUE + 5;
const COUNTER_SUBSCRIPTION_VALUE = 17;

const mocks = {
  Counter: () => ({
    amount: COUNTER_APOLLO_VALUE,
    __typename: 'Counter'
  }),
  Mutation: () => ({
    addServerCounter: (obj, { amount }) => ({
      amount: INC_COUNTER_VALUE + amount,
      __typename: 'Counter'
    })
  })
};

describe('Server counter example UI works', () => {
  const renderer = new Renderer(mocks, {});
  let app;
  let container;
  let content;
  const ServerCounterWithI18n = translate('counter')(ServerCounter);

  beforeEach(() => {
    if (app) {
      container = app.container;
      content = container.firstChild;
    }
  });

  step('Counter section renders without data', () => {
    app = render(renderer.withApollo(<ServerCounterWithI18n />));
    container = app.container;
    content = container.firstChild;
    content.textContent.should.has.string('loading');
  });

  step('Counter section renders with queries data', () => {
    content.textContent.should.has.string(`Current counter, is ${COUNTER_APOLLO_VALUE}.`);
  });

  step('Clicking on increase counter button shows optimistic response', () => {
    const graphQLButton = find(container, '#graphql-button');
    click(graphQLButton);
    content.textContent.should.has.string(`Current counter, is ${COUNTER_APOLLO_VALUE + 1}.`);
  });

  step('Section shows GraphQL response when it arrives after button click', () => {
    content.textContent.should.has.string(`Current counter, is ${INC_COUNTER_VALUE + 1}.`);
  });

  step('Check subscribed to counter updates', () => {
    renderer.getSubscriptions(COUNTER_SUBSCRIPTION).should.has.lengthOf(1);
  });

  step('Updates counter on data from subscription', () => {
    const subscription = renderer.getSubscriptions(COUNTER_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        counterUpdated: { amount: COUNTER_SUBSCRIPTION_VALUE, __typename: 'Counter' }
      }
    });
    content.textContent.should.has.string(`Current counter, is ${COUNTER_SUBSCRIPTION_VALUE}.`);
  });

  step('Unmount section and check unsubscription', () => {
    app.unmount();
    renderer.getSubscriptions(COUNTER_SUBSCRIPTION).should.has.lengthOf(0);
  });
});
