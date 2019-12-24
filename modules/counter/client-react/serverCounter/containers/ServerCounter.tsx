import React from 'react';
import { useMutation, useQuery, useSubscription, useApolloClient } from '@apollo/react-hooks';

import { COUNTER_QUERY, ADD_COUNTER, COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';

import IncreaseButton from '../components/IncreaseButton';
import ServerCounterView from '../components/ServerCounterView';

interface ButtonProps {
  increaseAmount: number;
  counter: any;
}

const IncreaseButtonContainer = ({ increaseAmount, counter }: ButtonProps) => {
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
      variables: { amount: increaseAmount },
      optimisticResponse: {
        __typename: 'Mutation',
        addServerCounter: {
          __typename: 'Counter',
          amount: counter.amount + 1
        }
      }
    });

  return <IncreaseButton onClick={onClickHandler} />;
};

const ServerCounter = () => {
  const client = useApolloClient();

  const { data: messageData } = useSubscription(COUNTER_SUBSCRIPTION);

  if (messageData) {
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
    <ServerCounterView counter={serverCounter} loading={loading}>
      <IncreaseButtonContainer increaseAmount={1} counter={serverCounter} />
    </ServerCounterView>
  );
};

export default ServerCounter;
