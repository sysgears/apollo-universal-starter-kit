import React from 'react';
import { useMutation, useQuery, useSubscription, useApolloClient } from '@apollo/react-hooks';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

import { COUNTER_QUERY, ADD_COUNTER, COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';

import { ServerCounterView, ServerCounterButton } from '../components/ServerCounterView';

interface ButtonProps {
  counterAmount: number;
  t: TranslateFunction;
  counter: any;
}

const IncreaseButton = ({ counterAmount, t, counter }: ButtonProps) => {
  const [increaseCounter] = useMutation(ADD_COUNTER, {
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

  const onClickHandler = (): any =>
    increaseCounter({
      variables: { amount: counterAmount },
      optimisticResponse: {
        __typename: 'Mutation',
        addServerCounter: {
          __typename: 'Counter',
          amount: counter.amount + 1
        }
      }
    });

  return <ServerCounterButton text={t('btnLabel')} onClick={onClickHandler} />;
};

interface ServerCounterProps {
  t: TranslateFunction;
}

const ServerCounter = ({ t }: ServerCounterProps) => {
  const client = useApolloClient();

  const { loading: messageLoading, data: messageData } = useSubscription(COUNTER_SUBSCRIPTION);

  if (!messageLoading) {
    client.writeQuery({
      query: COUNTER_QUERY,
      data: {
        serverCounter: {
          amount: messageData.counterUpdated.amount,
          __typename: 'Counter'
        }
      }
    });
  }

  const {
    error,
    data: { serverCounter },
    loading
  } = useQuery(COUNTER_QUERY);

  if (error) {
    throw new Error(String(error));
  }

  return (
    <ServerCounterView t={t} counter={serverCounter} loading={loading}>
      <IncreaseButton t={t} counterAmount={1} counter={serverCounter} />
    </ServerCounterView>
  );
};

export default translate('serverCounter')(ServerCounter);
