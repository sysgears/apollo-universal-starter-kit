import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import CounterView from '../components/CounterView';

import AMOUNT_QUERY from '../graphql/getCount.graphql';
import ADD_COUNT_MUTATION from '../graphql/addCount.graphql';
import COUNT_SUBSCRIPTION from '../graphql/updateCount.graphql';

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
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
      document: COUNT_SUBSCRIPTION,
      variables: {},
      updateQuery: (
        prev,
        { subscriptionData: { data: { updateCount: { amount } } } }
      ) => {
        return update(prev, {
          count: {
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

Counter.propTypes = {
  loading: PropTypes.bool.isRequired,
  count: PropTypes.object,
  updateCountQuery: PropTypes.func,
  onReduxIncrement: PropTypes.func,
  addCount: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  reduxCount: PropTypes.number.isRequired
};

const CounterWithApollo = compose(
  graphql(AMOUNT_QUERY, {
    props({ data: { loading, count, subscribeToMore } }) {
      return { loading, count, subscribeToMore };
    }
  }),
  graphql(ADD_COUNT_MUTATION, {
    props: ({ ownProps, mutate }) => ({
      addCount(amount) {
        return () =>
          mutate({
            variables: { amount },
            updateQueries: {
              getCount: (prev, { mutationResult }) => {
                const newAmount = mutationResult.data.addCount.amount;
                return update(prev, {
                  count: {
                    amount: {
                      $set: newAmount
                    }
                  }
                });
              }
            },
            optimisticResponse: {
              __typename: 'Mutation',
              addCount: {
                __typename: 'Count',
                amount: ownProps.count.amount + 1
              }
            }
          });
      }
    })
  })
)(Counter);

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
)(CounterWithApollo);
