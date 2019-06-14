import React, { useEffect } from 'react';
import { Mutation, Query } from 'react-apollo';
import update from 'immutability-helper';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { COUNTER_QUERY, ADD_COUNTER, COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';
import { ServerCounterView, ServerCounterButton } from '../components/ServerCounterView';

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
          optimisticResponse: {
            __typename: 'Mutation',
            addServerCounter: {
              __typename: 'Counter',
              amount: counter.amount + 1
            }
          },
          update: (cache: any, { data }: any) => {
            const newAmount = data.addServerCounter.amount;

            cache.writeQuery({
              query: COUNTER_QUERY,
              data: {
                serverCounter: {
                  amount: newAmount,
                  __typename: 'Counter'
                }
              }
            });
          }
        });

      const onClickHandler = () => addServerCounter(counterAmount);

      return <ServerCounterButton text={t('btnLabel')} onClick={onClickHandler()} />;
    }}
  </Mutation>
);

const subscribeToCount = (subscribeToMore: (opts: any) => any): any => {
  return subscribeToMore({
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
};

interface CounterProps {
  t: TranslateFunction;
  subscribeToMore: (opts: any) => any;
  loading: boolean;
  counter: any;
}

const ServerCounter = (props: CounterProps) => {
  const { t, counter, loading, subscribeToMore } = props;

  useEffect(() => {
    const subscribe = subscribeToCount(subscribeToMore);
    return () => subscribe();
  });

  return (
    <ServerCounterView t={t} counter={counter} loading={loading}>
      <IncreaseButton t={t} counterAmount={1} counter={counter} />
    </ServerCounterView>
  );
};

const ServerCounterWithQuery = (props: any) => (
  <Query query={COUNTER_QUERY}>
    {({ loading, error, data, subscribeToMore }: any) => {
      if (error) {
        throw new Error(String(error));
      }
      return (
        <ServerCounter {...props} loading={loading} subscribeToMore={subscribeToMore} counter={data.serverCounter} />
      );
    }}
  </Query>
);

export default translate('serverCounter')(ServerCounterWithQuery);
