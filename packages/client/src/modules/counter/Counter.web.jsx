import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { PageLayout } from '../common/components/web';
import settings from '../../../../../settings';
import ClientCounter from './clientCounter';
import ServerCounter from './serverCounter';
import ReduxCounter from './reduxCounter';
import translate from '../../i18n';

const Counter = ({ t }) => (
  <PageLayout>
    <Helmet
      title={`${settings.app.name} - ${t('title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('meta')}`
        }
      ]}
    />
    <ServerCounter t={t} />
    <ReduxCounter t={t} />
    <ClientCounter t={t} />
  </PageLayout>
);

Counter.propTypes = {
  t: PropTypes.func
};

export default translate('counter')(Counter);
