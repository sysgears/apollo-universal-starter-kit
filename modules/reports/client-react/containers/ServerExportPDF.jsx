import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { translate } from '@module/i18n-client-react';
import { Query } from 'react-apollo';
import getReport from '../graphql/getReport.graphql';

function getObjectURLFromArray(array) {
  const buffer = new window.Uint8Array(array);
  const blob = new window.Blob([buffer], { type: 'application/pdf' });
  return window.URL.createObjectURL(blob);
}

@translate('reports')
class ServerExportPDF extends Component {
  static propTypes = {
    t: PropTypes.func
  };

  render() {
    const { t } = this.props;
    return (
      <Query query={getReport}>
        {({ loading, data: { getReport } }) => {
          if (loading) return null;
          const pdfURL = getObjectURLFromArray(getReport.data);

          return (
            <a href={pdfURL} target="_blank" rel="noopener noreferrer">
              {t('btn')}
            </a>
          );
        }}
      </Query>
    );
  }
}

export default ServerExportPDF;
