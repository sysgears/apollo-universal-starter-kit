import React from 'react';
import { Mutation, Query } from 'react-apollo';
import update from 'immutability-helper';

import { translate, TranslateFunction } from '@module/i18n-client-react';
import { ServerCounterView, ServerCounterButton } from '../components/ServerCounterView';
import { COUNTER_QUERY, ADD_COUNTER, COUNTER_SUBSCRIPTION } from '@module/counter-common';

interface ButtonProps {
  counterAmount: number;
  t: TranslateFunction;
  counter: any;
}

const IncreaseButton = ({ counterAmount, t, counter }: ButtonProps) => (
  <Mutation mutation={ADD_COUNTER}>
    {(mutate: any) => {
      const addServerCounter = (amount: number) => () =>
        mutate({
          variables: { amount },
          updateQueries: {
            serverCounterQuery: (prev: any, { mutationResult }: any) => {
              const newAmount = mutationResult.data.addServerCounter.amount;
              return update(prev, {
                serverCounter: {
                  amount: {
                    $set: newAmount
                  }
                }
              });
            }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addServerCounter: {
              __typename: 'Counter',
              amount: counter.amount + 1
            }
          }
        });

      const onClickHandler = () => addServerCounter(counterAmount);

      return <ServerCounterButton text={t('btnLabel')} onClick={onClickHandler()} />;
    }}
  </Mutation>
);

interface CounterProps {
  t: TranslateFunction;
  subscribeToMore: (opts: any) => any;
  loading: boolean;
  counter: any;
}

class ServerCounter extends React.Component<CounterProps> {
  private subscription: any;

  constructor(props: CounterProps) {
    super(props);
    this.subscription = null;
  }

  public componentDidMount() {
    if (!this.props.loading) {
      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToCount();
      }
    }
  }

  // remove when Renderer is overwritten
  public componentDidUpdate(prevProps: CounterProps) {
    if (!prevProps.loading) {
      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToCount();
      }
    }
  }

  public componentWillUnmount() {
    if (this.subscription) {
      this.subscription();
    }
  }

  public subscribeToCount() {
    this.subscription = this.props.subscribeToMore({
      document: COUNTER_SUBSCRIPTION,
      variables: {},
      updateQuery: (
        prev: any,
        {
          subscriptionData: {
            data: {
              counterUpdated: { amount }
            }
          }
        }: any
      ) => {
        return update(prev, {
          serverCounter: {
            amount: {
              $set: amount
            }
          }
        });
      }
    });
  }

  public render() {
    const { t, counter, loading } = this.props;
    return (
      <ServerCounterView t={t} counter={counter} loading={loading}>
        <IncreaseButton t={t} counterAmount={1} counter={counter} />
      </ServerCounterView>
    );
  }
}

const ServerCounterWithQuery = (props: any) => (
  <Query query={COUNTER_QUERY}>
    {({ loading, error, data: { serverCounter }, subscribeToMore }) => {
      if (error) {
        throw new Error(String(error));
      }
      return <ServerCounter {...props} loading={loading} subscribeToMore={subscribeToMore} counter={serverCounter} />;
    }}
  </Query>
);

export default translate('serverCounter')(ServerCounterWithQuery);
