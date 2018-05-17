import chai from 'chai';
import { step } from 'mocha-steps';

import Renderer from '../../../testHelpers/Renderer';
import { click, updateContent, find } from '../../../testHelpers/testUtils';
import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';

chai.should();

const COUNTER_APOLLO_VALUE = 11;
const COUNTER_REDUX_VALUE = 1;
const INC_COUNTER_VALUE = COUNTER_APOLLO_VALUE + 5;
const COUNTER_SUBSCRIPTION_VALUE = 17;

const mocks = {
  Counter: () => ({
    amount: COUNTER_APOLLO_VALUE,
    __typename: 'Counter'
  }),
  Mutation: () => ({
    addCounter: (obj, { amount }) => ({
      amount: INC_COUNTER_VALUE + amount,
      __typename: 'Counter'
    })
  })
};

describe('Counter example UI works', () => {
  const renderer = new Renderer(mocks, {
    counter: { reduxCount: COUNTER_REDUX_VALUE }
  });
  let app;
  let container;
  let content;

  beforeEach(() => {
    if (app) {
      container = app.container;
      content = updateContent(container);
    }
  });

  step('Counter page renders without data', () => {
    app = renderer.mount();
    container = app.container;
    renderer.history.push('/');
    content = updateContent(container);
    content.textContent.should.equal('Loading...');
  });

  step('Counter page renders with queries data', () => {
    content.textContent.should.has.string(`Current counter, is ${COUNTER_APOLLO_VALUE}.`);
    content.textContent.should.has.string(`reduxCount, is ${COUNTER_REDUX_VALUE}.`);
  });

  step('Clicking on increase counter button shows optimistic response', () => {
    const graphQLButton = find(container, '#graphql-button');
    click(graphQLButton);
    content.textContent.should.has.string(`Current counter, is ${COUNTER_APOLLO_VALUE + 1}.`);
  });

  step('Page shows GraphQL response when it arrives after button click', () => {
    content.textContent.should.has.string(`Current counter, is ${INC_COUNTER_VALUE + 1}.`);
  });

  step('Increase Redux counter button works', () => {
    const reduxButton = find(container, '#redux-button');
    click(reduxButton);
    content.textContent.should.has.string(`reduxCount, is ${COUNTER_REDUX_VALUE + 1}.`);
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

  step('Unmount page and check unsubscription', () => {
    app.unmount();
    renderer.getSubscriptions(COUNTER_SUBSCRIPTION).should.has.lengthOf(0);
  });
});
