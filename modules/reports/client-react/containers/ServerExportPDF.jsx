import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { translate } from '@module/i18n-client-react';
import DownloadReportButton from '../components/DownloadReportButton';
import pdfReport from '../graphql/pdfReport.graphql';
import excelReport from '../graphql/excelReport.graphql';

function getObjectURLFromArray(array) {
  const buffer = new window.Uint8Array(array);
  const blob = new window.Blob([buffer], { type: 'application/pdf' });
  return window.URL.createObjectURL(blob);
}

function openPDF(array) {
  const url = getObjectURLFromArray(array);
  window.open(url, '_blank');
}

function downloadFile(array) {
  const a = document.createElement('a');
  const url = getObjectURLFromArray(array);
  const name = 'Report.xlsx';

  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = name;
  a.click();
  window.URL.revokeObjectURL(url);
}

@translate('reports')
class ServerExportPDF extends Component {
  static propTypes = {
    t: PropTypes.func
  };

  render() {
    const { t } = this.props;

    return (
      <Fragment>
        <DownloadReportButton format="excel" title={t('downloadExcel')} onDataLoad={downloadFile} query={excelReport} />
        <DownloadReportButton format="pdf" title={t('downloadPDF')} onDataLoad={openPDF} query={pdfReport} />
      </Fragment>
    );
  }
}

export default ServerExportPDF;
