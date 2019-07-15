import React from 'react';
import chai from 'chai';
import { render } from 'react-testing-library';

import { translate } from '@gqlapp/i18n-client-react';
import { click, find, Renderer } from '@gqlapp/testing-client-react';
import { COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';

import ServerCounter from '../containers/ServerCounter';

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
    addServerCounter: (obj: any, { amount }: any) => ({
      amount: INC_COUNTER_VALUE + amount,
      __typename: 'Counter'
    })
  })
};

describe('Server counter example UI works', () => {
  const renderer = new Renderer(mocks, {});
  let app: any;
  let container: any;
  let content: any;
  const ServerCounterWithI18n = translate('counter')(ServerCounter);

  beforeEach(() => {
    if (app) {
      container = app.container;
      content = container.firstChild;
    }
  });

  it('Counter section renders without data', () => {
    app = render(renderer.withApollo(<ServerCounterWithI18n />));
    container = app.container;
    content = container.firstChild;
    content.textContent.should.has.string('loading');
  });

  it('Counter section renders with queries data', () => {
    content.textContent.should.has.string(`The current counter value is ${COUNTER_APOLLO_VALUE}.`);
  });

  it('Clicking on increase counter button shows optimistic response', () => {
    const graphQLButton = find(container, '#graphql-button');
    click(graphQLButton);
    content.textContent.should.has.string(`The current counter value is ${COUNTER_APOLLO_VALUE + 1}.`);
  });

  it('Section shows GraphQL response when it arrives after button click', () => {
    content.textContent.should.has.string(`The current counter value is ${INC_COUNTER_VALUE + 1}.`);
  });

  it('Check subscribed to counter updates', () => {
    renderer.getSubscriptions(COUNTER_SUBSCRIPTION).should.has.lengthOf(1);
  });

  it('Updates counter on data from subscription', () => {
    const subscription = renderer.getSubscriptions(COUNTER_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        counterUpdated: { amount: COUNTER_SUBSCRIPTION_VALUE, __typename: 'Counter' }
      }
    });
    content.textContent.should.has.string(`The current counter value is ${COUNTER_SUBSCRIPTION_VALUE}.`);
  });

  it('Unmount section and check unsubscription', () => {
    app.unmount();
    renderer.getSubscriptions(COUNTER_SUBSCRIPTION).should.has.lengthOf(0);
  });
});
