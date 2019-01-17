import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Query, withApollo } from 'react-apollo';
import { PageLayout, Button } from '@module/look-client-react';
import { translate } from '@module/i18n-client-react';
import settings from '../../../../settings';

import ReportPreview from '../components/ReportPreview';
import ReportsQuery from '../graphql/ReportsQuery.graphql';
import excelReport from '../graphql/excelReport.graphql';
import pdfReport from '../graphql/pdfReport.graphql';

function getObjectURLFromArray(array) {
  const buffer = new window.Uint8Array(array);
  const blob = new window.Blob([buffer]);
  return window.URL.createObjectURL(blob);
}

function downloadFile(url, name) {
  const a = document.createElement('a');

  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = name;
  a.click();
  window.URL.revokeObjectURL(url);
}

@translate('report')
class Report extends Component {
  static propTypes = {
    t: PropTypes.func,
    client: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.downloadPdf = this.downloadPdf.bind(this, 'Report.pdf');
    this.downloadExcel = this.downloadExcel.bind(this, 'Report.xlsx');
  }

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

  async downloadPdf(name) {
    const { data } = await this.props.client.query({
      query: pdfReport
    });
    const url = getObjectURLFromArray(data.pdfReport);
    downloadFile(url, name);
  }

  async downloadExcel(name) {
    const { data } = await this.props.client.query({
      query: excelReport
    });
    const url = getObjectURLFromArray(data.excelReport);
    downloadFile(url, name);
  }

  render() {
    const { t } = this.props;
    const button = <Button>{t('btn')}</Button>;

    return (
      <PageLayout>
        {this.renderMetaData()}
        <Query query={ReportsQuery}>
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;

            return (
              <ReportPreview
                reports={data.reports}
                button={button}
                title="Report preview"
                onDownloadPdf={this.downloadPdf}
                onDownloadExcel={this.downloadExcel}
              />
            );
          }}
        </Query>
      </PageLayout>
    );
  }
}

export default withApollo(Report);
