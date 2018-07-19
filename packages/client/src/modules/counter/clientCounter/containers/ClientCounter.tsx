import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';

import { ClientCounterButton, ClientCounterView } from '../components/ClientCounterView';
import COUNTER_QUERY_CLIENT from '../graphql/CounterQuery.client.graphql';
import ADD_COUNTER_CLIENT from '../graphql/AddCounter.client.graphql';
import translate from '../../../../i18n';

const IncreaseButton = ({ counterAmount, t }) => (
  <Mutation mutation={ADD_COUNTER_CLIENT}>
    {mutate => {
      const addClientCounter = amount => () => {
        const { value } = mutate({ variables: { amount } });
        return value;
      };

      const onClickHandler = () => addClientCounter(counterAmount);
      return <ClientCounterButton text={t('btnLabel')} onClick={onClickHandler()} />;
    }}
  </Mutation>
);

IncreaseButton.propTypes = {
  counterAmount: PropTypes.number,
  t: PropTypes.func
};

const ClientCounter = ({ t }) => (
  <Query query={COUNTER_QUERY_CLIENT} t={t}>
    {({
      data: {
        clientCounter: { amount }
      }
    }) => {
      return (
        <ClientCounterView text={t('text', { amount })} t>
          <IncreaseButton t={t} counterAmount={1} />
        </ClientCounterView>
      );
    }}
  </Query>
);

ClientCounter.propTypes = {
  t: PropTypes.func
};

export default translate('clientCounter')(ClientCounter);
