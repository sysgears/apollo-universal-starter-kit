import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Query } from 'react-apollo';
import { PageLayout, Button } from '@module/look-client-react';
import { translate } from '@module/i18n-client-react';
import { removeTypename } from '@module/core-common';

import settings from '../../../../settings';
import ReportPreview from '../components/ReportPreview';
import ReportQuery from '../graphql/ReportQuery.graphql';
import excelQuery from '../graphql/Excel.graphql';
import pdfQuery from '../graphql/PDF.graphql';
import DownloadPDF from '../download/pdf/';
import DownloadExcel from '../download/excel';

@translate('report')
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
    const button = <Button>{t('btn')}</Button>;

    return (
      <PageLayout>
        {this.renderMetaData()}
        <Query query={ReportQuery}>
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;

            const report = data.report.map(report => removeTypename(report));
            return <ReportPreview data={report} button={button} title="Report preview" />;
          }}
        </Query>
        <DownloadPDF query={pdfQuery} fileName="Report.pdf">
          {t('downloadPDF')}
        </DownloadPDF>
        <DownloadExcel query={excelQuery} fileName="Report.xlsx">
          {t('downloadExcel')}
        </DownloadExcel>
      </PageLayout>
    );
  }
}

export default Report;
