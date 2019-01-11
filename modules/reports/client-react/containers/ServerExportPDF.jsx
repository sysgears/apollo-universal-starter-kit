import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';

import { translate } from '@module/i18n-client-react';
import { Button } from '@module/look-client-react';
import getReport from '../graphql/getReport.graphql';

function getObjectURLFromArray(array) {
  const buffer = new window.Uint8Array(array);
  const blob = new window.Blob([buffer], { type: 'application/pdf' });
  return window.URL.createObjectURL(blob);
}

function openPDF(array) {
  const url = getObjectURLFromArray(array);
  window.open(url, '_blank');
}

@translate('reports')
class ServerExportPDF extends Component {
  static propTypes = {
    t: PropTypes.func
  };

  state = {
    isLoading: false
  };

  render() {
    const { t } = this.props;

    return (
      <ApolloConsumer>
        {client => (
          <Button
            onClick={async () => {
              this.setState({ isLoading: true });
              const { data } = await client.query({
                query: getReport
              });
              openPDF(data.getReport.data);
              this.setState({ isLoading: false });
            }}
          >
            {this.state.isLoading ? t('loading') : t('download')}
          </Button>
        )}
      </ApolloConsumer>
    );
  }
}

export default ServerExportPDF;
