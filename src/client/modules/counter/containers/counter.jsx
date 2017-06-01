import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import Helmet from 'react-helmet';
import { Button } from 'reactstrap';

import AMOUNT_QUERY from '../graphql/count_get.graphql';
import ADD_COUNT_MUTATION from '../graphql/count_add_mutation.graphql';
import COUNT_SUBSCRIPTION from '../graphql/count_subscribe.graphql';

import TestReactNativeWeb from './testReactNativeWeb';

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
      if (this.subscription) {
        this.subscription();
        this.subscription = null;
      }

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

  handleReduxIncrement = (e) => {
    let value;
    if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }

    this.props.onReduxIncrement(value);
  }

  subscribeToCount() {
    const { subscribeToMore } = this.props;
    this.subscription = subscribeToMore({
      document: COUNT_SUBSCRIPTION,
      variables: {},
      updateQuery: (prev, {subscriptionData: {data: {countUpdated: { amount }}}}) => {
        return update(prev, {
          count: {
            amount: {
              $set: amount,
            },
          }
        });
      }
    });
  }

  render() {
    const { loading, count, addCount, reduxCount } = this.props;
    if (loading) {
      return (
        <div className="text-center">
          Loading...
        </div>
      );
    } else {
      return (
        <div>
          <Helmet
            title="Apollo Starter Kit - Counter"
            meta={[{
              name: 'description',
              content: 'Apollo Fullstack Starter Kit - Counter example page'
            }]}/>
          <div className="text-center mt-4 mb-4">
          Current count, is {count.amount}. This is being stored server-side in the database and using Apollo
          subscription for real-time updates.
          <br/>
          <br/>
          <Button id="graphql-button" color="primary" onClick={addCount(1)}>
            Click to increase count
          </Button>
          <br/>
          <br/>
            <TestReactNativeWeb/>
          <br/>
          <br/>
          Current reduxCount, is {reduxCount}. This is being stored client-side with Redux.
          <br/>
          <br/>
          <Button id="redux-button" color="primary" value="1" onClick={this.handleReduxIncrement}>
            Click to increase reduxCount
          </Button>
          </div>
        </div>  
      );
    }
  }
}

Counter.propTypes = {
  loading: PropTypes.bool.isRequired,
  count: PropTypes.object,
  updateCountQuery: PropTypes.func,
  onReduxIncrement: PropTypes.func,
  addCount: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  reduxCount: PropTypes.number.isRequired,
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
        return () => mutate({
          variables: { amount },
          updateQueries: {
            getCount: (prev, { mutationResult }) => {
              const newAmount = mutationResult.data.addCount.amount;
              return update(prev, {
                count: {
                  amount: {
                    $set: newAmount,
                  },
                },
              });
            },
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addCount: {
              __typename: 'Count',
              amount: ownProps.count.amount + 1,
            },
          },
        });
      },
    }),
  })
)(Counter);

export default connect(
  (state) => ({ reduxCount: state.counter.reduxCount }),
  (dispatch) => ({
    onReduxIncrement(value)
    {
      dispatch({
        type: 'COUNTER_INCREMENT',
        value: Number(value)
      });
    }
  }),
)(CounterWithApollo);
