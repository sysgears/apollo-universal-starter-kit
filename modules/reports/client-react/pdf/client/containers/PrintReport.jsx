import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Query } from 'react-apollo';
import { translate } from '@gqlapp/i18n-client-react';
import { removeTypename } from '@gqlapp/core-common';

import settings from '../../../../../../settings';
import ReportPreview from '../components/ReportPreview';
import Button from '../components/Button';
import ReportQuery from '../../../graphql/ReportQuery.graphql';

@translate('PrintReport')
class Report extends Component {
  static propTypes = {
    t: PropTypes.func
  };

  renderMetaData = () => {
    const { t } = this.props;
    return (
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
  };

  render() {
    const { t } = this.props;
    const button = <Button>{t('print')}</Button>;

    return (
      <Query query={ReportQuery}>
        {({ loading, error, data }) => {
          if (loading) return t('loading');
          if (error) throw new Error(error);

          const report = data.report.map(report => removeTypename(report));
          return <ReportPreview data={report} button={button} title={t('title')} />;
        }}
      </Query>
    );
  }
}

export default Report;
