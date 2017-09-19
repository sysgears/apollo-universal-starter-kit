import chai from 'chai';
import { step } from 'mocha-steps';

import ApolloRenderer from '../../../../client/testHelpers/ApolloRenderer';
import COUNT_SUBSCRIBE from '../graphql/countUpdated.graphql';

chai.should();

const COUNTER_VALUE = 11;
const REDUX_VALUE = 7;
const INC_COUNTER_VALUE = COUNTER_VALUE + 5;
const SUBSCRIPTION_VALUE = 17;

const mocks = {
  Count: () => ({
    amount: COUNTER_VALUE,
    __typename: 'Count'
  }),
  Mutation: () => ({
    addCount: (obj, { amount }) => ({
      amount: INC_COUNTER_VALUE + amount,
      __typename: 'Count'
    })
  })
};

describe('Counter example UI works', () => {
  const renderer = new ApolloRenderer(mocks, {
    counter: { reduxCount: REDUX_VALUE }
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
    content.text().should.has.string(`Current count, is ${COUNTER_VALUE}.`);
    content.text().should.has.string(`reduxCount, is ${REDUX_VALUE}.`);
  });

  step('Clicking on increase count button shows optimistic response', () => {
    const graphQLButton = content.find('#graphql-button');
    graphQLButton.simulate('click');
    content.text().should.has.string(`Current count, is ${COUNTER_VALUE + 1}.`);
  });

  step('Page shows GraphQL response when it arrives after button click', () => {
    content
      .text()
      .should.has.string(`Current count, is ${INC_COUNTER_VALUE + 1}.`);
  });

  step('Increase Redux count button works', () => {
    const reduxButton = content.find('#redux-button');
    reduxButton.simulate('click');
    content.text().should.has.string(`reduxCount, is ${REDUX_VALUE + 1}.`);
  });

  step('Check subscribed to count updates', () => {
    renderer.getSubscriptions(COUNT_SUBSCRIBE).should.has.lengthOf(1);
  });

  step('Updates counter on data from subscription', () => {
    const subscription = renderer.getSubscriptions(COUNT_SUBSCRIBE)[0];
    subscription(null, {
      countUpdated: { amount: SUBSCRIPTION_VALUE, __typename: 'Count' }
    });
    content
      .text()
      .should.has.string(`Current count, is ${SUBSCRIPTION_VALUE}.`);
  });

  step('Unmount page and check unsubscription', () => {
    app.unmount();
    renderer.getSubscriptions(COUNT_SUBSCRIBE).should.has.lengthOf(0);
  });
});
