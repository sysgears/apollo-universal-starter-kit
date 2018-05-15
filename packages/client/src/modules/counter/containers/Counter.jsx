import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import update from 'immutability-helper';

import { connect } from 'react-redux';
import CounterView from '../components/CounterView';

import COUNTER_QUERY from '../graphql/CounterQuery.graphql';
import ADD_COUNTER from '../graphql/AddCounter.graphql';
import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';

class Counter extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidUpdate() {
    if (!this.props.loading) {
      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToCount();
      }
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription();
    }
  }

  subscribeToCount() {
    const { subscribeToMore } = this.props;
    this.subscription = subscribeToMore({
      document: COUNTER_SUBSCRIPTION,
      variables: {},
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              counterUpdated: { amount }
            }
          }
        }
      ) => {
        return update(prev, {
          counter: {
            amount: {
              $set: amount
            }
          }
        });
      }
    });
  }

  render() {
    return <CounterView {...this.props} />;
  }
}

const ApolloCounter = props => (
  <Query query={COUNTER_QUERY}>
    {({ loading, error, data: { counter }, subscribeToMore }) => {
      if (error) throw new Error(error);
      return (
        <Mutation mutation={ADD_COUNTER}>
          {mutate => {
            const addCounter = amount => () =>
              mutate({
                variables: { amount },
                updateQueries: {
                  counterQuery: (prev, { mutationResult }) => {
                    const newAmount = mutationResult.data.addCounter.amount;
                    return update(prev, {
                      counter: {
                        amount: {
                          $set: newAmount
                        }
                      }
                    });
                  }
                },
                optimisticResponse: {
                  __typename: 'Mutation',
                  addCounter: {
                    __typename: 'Counter',
                    amount: counter.amount + 1
                  }
                }
              });

            return (
              <Counter
                {...props}
                loading={loading}
                counter={counter}
                subscribeToMore={subscribeToMore}
                addCounter={addCounter}
              />
            );
          }}
        </Mutation>
      );
    }}
  </Query>
);

export default connect(
  state => ({ reduxCount: state.counter.reduxCount }),
  dispatch => ({
    onReduxIncrement(value) {
      return () =>
        dispatch({
          type: 'COUNTER_INCREMENT',
          value: Number(value)
        });
    }
  })
)(ApolloCounter);
