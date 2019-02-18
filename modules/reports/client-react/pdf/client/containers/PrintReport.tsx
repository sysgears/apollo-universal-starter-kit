import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Query } from 'react-apollo';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { removeTypename } from '@gqlapp/core-common';
import { Table, Button } from '@gqlapp/look-client-react';

import settings from '../../../../../../settings';
import ReportQuery from '../../../graphql/ReportQuery.graphql';

interface Report {
  id: string;
  name: string;
  phone: string;
  email: string;
  typename?: string;
}

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

  public print = () => {
    window.print();
  };

  public render() {
    const { t } = this.props;

    return (
      <Query query={ReportQuery}>
        {({ loading, data }) => {
          if (loading) {
            return t('loading');
          }

          const report = data.report.map((item: Report) => removeTypename(item));
          const columns = Object.keys(report[0]).map((name: string) => ({
            title: name,
            key: name,
            dataIndex: name
          }));
          return (
            <>
              <Table dataSource={report} columns={columns} />
              <Button className="no-print" onClick={this.print}>
                {t('print')}
              </Button>
            </>
          );
        }}
      </Query>
    );
  }
}

export default translate('PrintReport')(Report);
