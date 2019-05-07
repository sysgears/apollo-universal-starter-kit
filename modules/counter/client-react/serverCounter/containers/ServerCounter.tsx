import React from 'react';
import { useQuery, useSubscription, useMutation } from 'react-apollo-hooks';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { COUNTER_QUERY, ADD_COUNTER, COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';
import { ServerCounterView, ServerCounterButton } from '../components/ServerCounterView';

interface ButtonProps {
  counterAmount: number;
  t: TranslateFunction;
  counter: any;
}

const IncreaseButton = ({ counterAmount, t, counter }: ButtonProps) => {
  const addServerCounter = useMutation(ADD_COUNTER, {
    variables: { amount: counterAmount },
    optimisticResponse: {
      __typename: 'Mutation',
      addServerCounter: {
        __typename: 'Counter',
        amount: counter.amount + 1
      }
    },
    update: (proxy: any, { data }: any) => {
      const newAmount = data.addServerCounter.amount;

      proxy.writeQuery({
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

  return <ServerCounterButton text={t('btnLabel')} onClick={addServerCounter} />;
};

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
