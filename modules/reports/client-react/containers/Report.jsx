import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

import { PageLayout } from '@gqlapp/look-client-react';
import { translate } from '@gqlapp/i18n-client-react';
import settings from '../../../../settings';
import reports from '../reports';

const Report = ({ t }) => (
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
    {reports.reportComponent.map((component, idx, items) => React.cloneElement(component, { key: idx + items.length }))}
  </PageLayout>
);

Report.propTypes = {
  t: PropTypes.func
};

export default translate('report')(Report);
