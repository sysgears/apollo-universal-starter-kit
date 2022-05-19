import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { COUNTER_QUERY_CLIENT, ADD_COUNTER_CLIENT } from '@gqlapp/counter-common';
import IncreaseButton from '../components/IncreaseButton';
import ClientCounterView from '../components/ClientCounterView';

interface ButtonProps {
  increaseAmount: number;
  counter: any;
}

const IncreaseButtonContainer = ({ increaseAmount }: ButtonProps) => {
  const [increaseCounter] = useMutation(ADD_COUNTER_CLIENT);

  const onClickHandler = (): any => increaseCounter({ variables: { amount: increaseAmount } });

  return <IncreaseButton onClick={onClickHandler} />;
};

const ClientCounter = () => {
  const result = useQuery(COUNTER_QUERY_CLIENT);
  const { error, data, loading } = result;

  if (error) {
    throw new Error(String(error));
  }

  return (
    <ClientCounterView counter={data?.clientCounter} loading={loading}>
      <IncreaseButtonContainer increaseAmount={1} counter={data?.clientCounter} />
    </ClientCounterView>
  );
};

export default ClientCounter;
