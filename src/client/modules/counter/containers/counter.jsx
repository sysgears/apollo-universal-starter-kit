import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose, withApollo } from 'react-apollo';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { Button } from 'reactstrap';
import log from 'common/log';

import AMOUNT_QUERY from '../graphql/count_get.graphql';
import ADD_COUNT_MUTATION from '../graphql/count_add_mutation.graphql';

const SUBSCRIPTION_QUERY = gql`
    subscription onCountUpdated {
        countUpdated {
            amount
        }
    }
`;

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.subscription && nextProps.loading === false) {
      this.subscribe();
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleReduxIncrement(e) {
    let value;
    if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }

    this.props.onReduxIncrement(value);
  }

  subscribe() {
    const { client, updateCountQuery } = this.props;
    this.subscription = client.subscribe({
      query: SUBSCRIPTION_QUERY,
      variables: {},
    }).subscribe({
      next(data) {
        updateCountQuery(prev => {
          let newAmount = data.countUpdated.amount;
          return update(prev, {
            count: {
              amount: {
                $set: newAmount,
              },
            },
          });
        });
      },
      error(err) {
        log.error(err);
      },
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
        <div className="text-center mt-4 mb-4">
          Current count, is {count.amount}. This is being stored server-side in the database and using Apollo
          subscription for real-time updates.
          <br/>
          <br/>
          <Button color="primary" onClick={addCount(1)}>
            Click to increase count
          </Button>
          <br/>
          <br/>
          <br/>
          <br/>
          Current reduxCount, is {reduxCount}. This is being stored client-side with Redux.
          <br/>
          <br/>
          <Button color="primary" value="1" onClick={this.handleReduxIncrement.bind(this)}>
            Click to increase reduxCount
          </Button>
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
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  reduxCount: PropTypes.number.isRequired,
};

const CounterWithApollo = withApollo(compose(
  graphql(AMOUNT_QUERY, {
    props({ data: { loading, count, updateQuery } }) {
      return { loading, count, updateCountQuery: updateQuery };
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
)(Counter));

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
