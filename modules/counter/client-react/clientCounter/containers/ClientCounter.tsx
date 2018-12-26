import React from 'react';
import { Mutation, Query } from 'react-apollo';

import { ClientCounterButton, ClientCounterView } from '../components/ClientCounterView';
import { COUNTER_QUERY_CLIENT, ADD_COUNTER_CLIENT } from '@module/counter-common';
import { translate, TranslateFunction } from '@module/i18n-client-react';

interface ButtonProps {
  counterAmount: number;
  t: TranslateFunction;
}

const IncreaseButton = ({ counterAmount, t }: ButtonProps): any => (
  <Mutation mutation={ADD_COUNTER_CLIENT}>
    {mutate => {
      const addClientCounter = (amount: any) => () => {
        const { value }: any = mutate({ variables: { amount } });
        return value;
      };

      const onClickHandler = () => addClientCounter(counterAmount);
      return <ClientCounterButton text={t('btnLabel')} onClick={onClickHandler()} />;
    }}
  </Mutation>
);

interface CounterProps {
  t: TranslateFunction;
}

const ClientCounter = ({ t }: CounterProps) => (
  <Query query={COUNTER_QUERY_CLIENT}>
    {({
      data: {
        clientCounter: { amount }
      }
    }) => {
      return (
        <ClientCounterView text={t('text', { amount })}>
          <IncreaseButton t={t} counterAmount={1} />
        </ClientCounterView>
      );
    }}
  </Query>
);

export default translate('clientCounter')(ClientCounter);
