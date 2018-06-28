import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import update from 'immutability-helper';

import { ServerCounterView, ServerCounterButton } from '../components/ServerCounterView';
import ADD_COUNTER from '../graphql/AddCounter.graphql';
import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';
import COUNTER_QUERY from '../graphql/CounterQuery.graphql';
import translate from '../../../../i18n/index';

const IncreaseButton = ({ counterAmount, t, counter }) => (
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

      const onClickHandler = () => addCounter(counterAmount);

      return <ServerCounterButton text={t('btnLabel')} onClick={onClickHandler()} />;
    }}
  </Mutation>
);

IncreaseButton.propTypes = {
  counterAmount: PropTypes.number,
  t: PropTypes.func,
  counter: PropTypes.object
};

class ServerCounter extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    subscribeToMore: PropTypes.func,
    loading: PropTypes.bool,
    counter: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    if (!this.props.loading) {
      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToCount();
      }
    }
  }

  // remove when Renderer is overwritten
  componentDidUpdate(prevProps) {
    if (!prevProps.loading) {
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
    this.subscription = this.props.subscribeToMore({
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
      ) =>
        update(prev, {
          counter: {
            amount: {
              $set: amount
            }
          }
        })
    });
  }

  render() {
    const { t, counter, loading } = this.props;
    return (
      <ServerCounterView t={t} counter={counter} loading={loading}>
        <IncreaseButton t={t} counterAmount={1} counter={counter} />
      </ServerCounterView>
    );
  }
}

const ServerCounterWithQuery = props => (
  <Query query={COUNTER_QUERY}>
    {({ loading, error, data: { counter }, subscribeToMore }) => {
      if (error) throw new Error(error);
      return <ServerCounter {...props} loading={loading} subscribeToMore={subscribeToMore} counter={counter} />;
    }}
  </Query>
);

export default translate('serverCounter')(ServerCounterWithQuery);
