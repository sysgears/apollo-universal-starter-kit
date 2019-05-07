// import React from 'react';
import React, { useEffect } from 'react';
import { Mutation, Query } from 'react-apollo';
import update from 'immutability-helper';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { ServerCounterView, ServerCounterButton } from '../components/ServerCounterView';
import { COUNTER_QUERY, ADD_COUNTER, COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';

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

interface CounterProps {
  t: TranslateFunction;
  subscribeToMore: (opts: any) => any;
  loading: boolean;
  counter: any;
}

const subscribeToCounter = (subscribeToMore: (opts: any) => any) =>
  subscribeToMore({
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

const ServerCounter = ({ t, counter, loading, subscribeToMore }: CounterProps) => {
  useEffect(() => {
    const subscribe = subscribeToCounter(subscribeToMore);
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
    {({ loading, error, data: { serverCounter }, subscribeToMore }: any) => {
      if (error) {
        throw new Error(String(error));
      }
      return <ServerCounter {...props} loading={loading} subscribeToMore={subscribeToMore} counter={serverCounter} />;
    }}
  </Query>
);

export default translate('serverCounter')(ServerCounterWithQuery);
