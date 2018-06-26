import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { PageLayout } from '../common/components/web';
import settings from '../../../../../settings';
import ClientCounter from './modules/clientCounter/containers/ClientCounter';
import ServerCounter from './modules/serverCounter/containers/ServerCounter';
import ReduxCounter from './modules/reduxCounter/containers/ReduxCounter';
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
    <ServerCounter />
    <ReduxCounter />
    <ClientCounter />
  </PageLayout>
);

Counter.propTypes = {
  t: PropTypes.func
};

export default translate('counter')(Counter);
