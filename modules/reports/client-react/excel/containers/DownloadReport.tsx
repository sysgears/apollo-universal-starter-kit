import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { withApollo } from 'react-apollo';

import { Button } from '@gqlapp/look-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import query from '../../graphql/Excel.graphql';
import { downloadFile, getObjectURLFromArray } from '../../common';

interface DownloadReportProps {
  t: TranslateFunction;
  client: ApolloClient<any>;
}

class DownloadReport extends Component<DownloadReportProps> {
  public state = {
    isLoading: false
  };

  public donwload = async () => {
    this.setState({ isLoading: true });
    const { client } = this.props;
    const { data } = await client.query({
      query
    });
    const url = getObjectURLFromArray(data.excel);
    downloadFile(url, 'Report.xlsx');
    this.setState({ isLoading: false });
  };

  public render() {
    const { t } = this.props;
    return (
      <Button disabled={this.state.isLoading} style={{ marginLeft: '10px' }} onClick={this.donwload}>
        {t('downloadExcel')}
      </Button>
    );
  }
}

export default translate('ExcelReport')(withApollo(DownloadReport));
