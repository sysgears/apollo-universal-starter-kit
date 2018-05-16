import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { PageLayout } from '../../common/components/web';
import settings from '../../../../../../settings';
import ClientCounter from '../clientCounter';
import ServerCounter from '../serverCounter';
import ReduxCounter from '../reduxCounter';

const CounterView = ({ t, loading, subscribeToMore, counter }) => {
  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - ${t('title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('meta')}`
        }
      ]}
    />
  );

  if (loading) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">{t('loading')}</div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <ServerCounter t={t} loading={loading} subscribeToMore={subscribeToMore} counter={counter} />
        <ReduxCounter t={t} />
        <ClientCounter t={t} />
      </PageLayout>
    );
  }
};

CounterView.propTypes = {
  t: PropTypes.func,
  loading: PropTypes.bool,
  subscribeToMore: PropTypes.func,
  counter: PropTypes.object
};

export default CounterView;
