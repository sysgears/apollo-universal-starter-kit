import React from 'react'
import { connect } from 'react-redux';
import { graphql, compose, withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import update from 'react-addons-update'
import { Row, Button } from 'react-bootstrap'
import log from '../../log'
import AMOUNT_QUERY from '../graphql/CountGet.graphql'
import ADD_COUNT_MUTATION from '../graphql/CountAddMutation.graphql'

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

  handleTestIncrement(e) {
    let value;
    if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }

    this.props.onTestIncrement(value);
  }

  subscribe() {
    const { client, updateCountQuery } = this.props;
    this.subscription                  = client.subscribe({
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
      error(err) { log.error(err); },
    });
  }

  render() {
    const { loading, count, addCount, test } = this.props;
    if (loading) {
      return (
        <Row className="text-center">
          Loading...
        </Row>
      );
    } else {
      return (
        <Row className="text-center">
          <div>
            Current count, is {count.amount}. This is being stored server-side in the database and using Apollo subscription for real-time updates.
          </div>
          <br />
          <Button bsStyle="primary" onClick={addCount(1)}>
            Click to increase count
          </Button>
          <br /><br /><br />
          <div>Current test, is {test}. This is being stored client-side with Redux.</div>
          <br />
          <Button bsStyle="primary" value="1" onClick={this.handleTestIncrement.bind(this)}>
            Click to increase test
          </Button>
        </Row>
      );
    }
  }
}

Counter.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  count: React.PropTypes.object,
  updateCountQuery: React.PropTypes.func,
  addCount: React.PropTypes.func.isRequired,
  client: React.PropTypes.instanceOf(ApolloClient).isRequired,
  test: React.PropTypes.number.isRequired,
};

const CounterWithApollo = withApollo(compose(
  graphql(AMOUNT_QUERY, {
    props({data: {loading, count, updateQuery}}) {
      return {loading, count, updateCountQuery: updateQuery};
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
  (state) => ({ test: state.counter.test }),
  (dispatch) => ({
    onTestIncrement(value)
    {
      dispatch({
        type: 'COUNTER_TEST_INCREMENT',
        value: Number(value)
      });
    }
  }),
)(CounterWithApollo);
