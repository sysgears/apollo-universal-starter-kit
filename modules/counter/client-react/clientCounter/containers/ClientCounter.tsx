import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import IncreaseButton from '../components/IncreaseButton';
import ClientCounterView from '../components/ClientCounterView';
import { COUNTER_QUERY_CLIENT, ADD_COUNTER_CLIENT } from '@gqlapp/counter-common';

interface ButtonProps {
  increaseAmount: number;
  counter: any;
}

const IncreaseButtonContainer = ({ increaseAmount, counter }: ButtonProps) => {
  const [increaseCounter] = useMutation(ADD_COUNTER_CLIENT);

  const onClickHandler = (): any => increaseCounter({ variables: { amount: increaseAmount } });

  return <IncreaseButton onClick={onClickHandler} />;
};

const ClientCounter = () => {
  const {
    error,
    data: { clientCounter },
    loading
  } = useQuery(COUNTER_QUERY_CLIENT);

  if (error) {
    throw new Error(String(error));
  }

  return (
    <ClientCounterView counter={clientCounter} loading={loading}>
      <IncreaseButtonContainer increaseAmount={1} counter={clientCounter} />
    </ClientCounterView>
  );
};

export default ClientCounter;
