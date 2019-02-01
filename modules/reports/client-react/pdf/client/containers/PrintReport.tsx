import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Query } from 'react-apollo';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { removeTypename } from '@gqlapp/core-common';

import settings from '../../../../../../settings';
import ReportPreview from '../components/ReportPreview';
import Button from '../components/Button';
import ReportQuery from '../../../graphql/ReportQuery.graphql';

class Report extends Component<{ t: TranslateFunction }> {
  public renderMetaData = () => {
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

  public render() {
    const { t } = this.props;
    const button = <Button>{t('print')}</Button>;

    return (
      <Query query={ReportQuery}>
        {({ loading, data }) => {
          if (loading) {
            return t('loading');
          }

          const report = data.report.map((item: object) => removeTypename(item));
          return <ReportPreview data={report} button={button} title={t('title')} />;
        }}
      </Query>
    );
  }
}

export default translate('PrintReport')(Report);
