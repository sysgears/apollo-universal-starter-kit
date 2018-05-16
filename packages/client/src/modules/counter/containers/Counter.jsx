import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import CounterView from '../components/CounterView';
import COUNTER_QUERY from '../serverCounter/graphql/CounterQuery.graphql';
import translate from '../../../i18n';

const Counter = ({ t }) => {
  return (
    <Query query={COUNTER_QUERY}>
      {({ loading, error, data: { counter }, subscribeToMore }) => {
        if (error) throw new Error(error);
        return <CounterView t={t} loading={loading} subscribeToMore={subscribeToMore} counter={counter} />;
      }}
    </Query>
  );
};

Counter.propTypes = {
  t: PropTypes.func
};

export default translate('counter')(Counter);
