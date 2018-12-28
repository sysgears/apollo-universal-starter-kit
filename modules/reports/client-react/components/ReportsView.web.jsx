import React from 'react';
import PropTypes from 'prop-types';
import { PageLayout } from '@module/look-client-react';
import { translate } from '@module/i18n-client-react';
import PrintText from './PrintText';

class ReportsView extends React.PureComponent {
  static propTypes = {
    t: PropTypes.func
  };

  render() {
    const { t } = this.props;

    return (
      <PageLayout>
        <h1 className="text-center">{t('title')}</h1>
        <hr />
        <PrintText />
      </PageLayout>
    );
  }
}

export default translate('reports')(ReportsView);
