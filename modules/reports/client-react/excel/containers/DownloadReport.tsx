import React, { useState } from 'react';
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

const DownloadReport = ({ t, client }: DownloadReportProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const donwload = async () => {
    setIsLoading(true);
    const { data } = await client.query({
      query
    });
    const url = getObjectURLFromArray(data.excel);
    downloadFile(url, 'Report.xlsx');
    setIsLoading(false);
  };

  return (
    <Button className="no-print" disabled={isLoading} style={{ marginLeft: '10px' }} onClick={donwload}>
      {t('downloadExcel')}
    </Button>
  );
};

export default translate('ExcelReport')(withApollo(DownloadReport));
