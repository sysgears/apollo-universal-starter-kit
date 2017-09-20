import chai from 'chai';
import { step } from 'mocha-steps';

import Renderer from '../../../../client/testHelpers/Renderer';
import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';

chai.should();

const COUNTER_APOLLO_VALUE = 11;
const COUNTER_REDUX_VALUE = 7;
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
  let content;

  step('Counter page renders without data', () => {
    app = renderer.mount();
    renderer.history.push('/');
    content = app.find('#content');
    content.text().should.equal('Loading...');
  });

  step('Counter page renders with queries data', () => {
    content.text().should.has.string(`Current counter, is ${COUNTER_APOLLO_VALUE}.`);
    content.text().should.has.string(`reduxCount, is ${COUNTER_REDUX_VALUE}.`);
  });

  step('Clicking on increase counter button shows optimistic response', () => {
    const graphQLButton = content.find('#graphql-button');
    graphQLButton.simulate('click');
    content.text().should.has.string(`Current counter, is ${COUNTER_APOLLO_VALUE + 1}.`);
  });

  step('Page shows GraphQL response when it arrives after button click', () => {
    content.text().should.has.string(`Current counter, is ${INC_COUNTER_VALUE + 1}.`);
  });

  step('Increase Redux counter button works', () => {
    const reduxButton = content.find('#redux-button');
    reduxButton.simulate('click');
    content.text().should.has.string(`reduxCount, is ${COUNTER_REDUX_VALUE + 1}.`);
  });

  step('Check subscribed to counter updates', () => {
    renderer.getSubscriptions(COUNTER_SUBSCRIPTION).should.has.lengthOf(1);
  });

  step('Updates counter on data from subscription', () => {
    const subscription = renderer.getSubscriptions(COUNTER_SUBSCRIPTION)[0];
    subscription(null, {
      counterUpdated: { amount: COUNTER_SUBSCRIPTION_VALUE, __typename: 'Counter' }
    });
    content.text().should.has.string(`Current counter, is ${COUNTER_SUBSCRIPTION_VALUE}.`);
  });

  step('Unmount page and check unsubscription', () => {
    app.unmount();
    renderer.getSubscriptions(COUNTER_SUBSCRIPTION).should.has.lengthOf(0);
  });
});
