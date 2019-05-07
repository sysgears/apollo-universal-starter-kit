import React from 'react';
import { useQuery, useSubscription } from 'react-apollo-hooks';
import { Mutation } from 'react-apollo';

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

interface CounterProps {
  t: TranslateFunction;
  loading: boolean;
  counter: any;
}

const ServerCounter = ({ t, counter, loading }: CounterProps) => {
  useSubscription(COUNTER_SUBSCRIPTION, {
    onSubscriptionData: ({ client, subscriptionData: { data } }) => {
      const newAmount = data.counterUpdated.amount;

      client.writeQuery({
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

  return (
    <ServerCounterView t={t} counter={counter} loading={loading}>
      <IncreaseButton t={t} counterAmount={1} counter={counter} />
    </ServerCounterView>
  );
};

const ServerCounterWithQuery = (props: any) => {
  const {
    data: { serverCounter },
    error,
    loading
  } = useQuery(COUNTER_QUERY);
  if (error) {
    throw new Error(String(error));
  }
  return <ServerCounter {...props} loading={loading} counter={serverCounter} />;
};

export default translate('serverCounter')(ServerCounterWithQuery);
