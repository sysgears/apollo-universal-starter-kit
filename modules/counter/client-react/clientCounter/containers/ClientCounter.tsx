import React from 'react';
import { useQuery, useMutation } from 'react-apollo-hooks';

import { ClientCounterButton, ClientCounterView } from '../components/ClientCounterView';
import { COUNTER_QUERY_CLIENT, ADD_COUNTER_CLIENT } from '@gqlapp/counter-common';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

interface ButtonProps {
  counterAmount: number;
  t: TranslateFunction;
}

const IncreaseButton = ({ counterAmount, t }: ButtonProps) => {
  const addClientCounter = useMutation(ADD_COUNTER_CLIENT, {
    variables: { amount: counterAmount }
  });

  return <ClientCounterButton text={t('btnLabel')} onClick={addClientCounter} />;
};

interface CounterProps {
  t: TranslateFunction;
}

const ClientCounter = ({ t }: CounterProps) => {
  const {
    data: {
      clientCounter: { amount }
    }
  } = useQuery(COUNTER_QUERY_CLIENT);

  return (
    <ClientCounterView text={t('text', { amount })}>
      <IncreaseButton t={t} counterAmount={1} />
    </ClientCounterView>
  );
};

export default translate('clientCounter')(ClientCounter);
