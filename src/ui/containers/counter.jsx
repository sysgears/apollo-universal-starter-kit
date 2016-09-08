import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'react-addons-update'
import { Row, Button } from 'react-bootstrap'
import log from '../../log'

function Counter({ data, addCount }) {
  if (data.loading) {
    return (
      <Row className="text-center">
        Loading...
      </Row>
    );
  } else {
    return (
      <Row className="text-center">
        <div>
          Current count is {data.count.amount}. This is being stored server-side in the database and using Apollo to update.
        </div>
        <br />
        <Button bsStyle="primary" onClick={addCount(1)}>
          Click to increase count
        </Button>
      </Row>
    );
  }
}

Counter.propTypes = {
  data: React.PropTypes.object.isRequired,
  addCount: React.PropTypes.func.isRequired,
};

const AMOUNT_QUERY = gql`
  query getCount {
    count {
      amount
    }
  }
`;

const ADD_COUNT_MUTATION = gql`
  mutation addCount(
    $amount: Int!
  ) {
    addCount(amount: $amount) {
      amount
    }
  }
`;

export default compose(
  graphql(AMOUNT_QUERY),
  graphql(ADD_COUNT_MUTATION, {
    props: ({ ownProps, mutate }) => ({
      addCount(amount) {
        log
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
              amount: ownProps.data.count.amount + 1,
            },
          },
        });
      },
    }),
  })
)(Counter);
