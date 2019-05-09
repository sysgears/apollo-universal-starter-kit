import React from 'react';
import { Query } from 'react-apollo';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { removeTypename } from '@gqlapp/core-common';
import { Table, Button } from '@gqlapp/look-client-react';

import ReportQuery from '../../../graphql/ReportQuery.graphql';

interface ReportProps {
  t: TranslateFunction;
}

interface Report {
  id: string;
  name: string;
  phone: string;
  email: string;
  typename?: string;
}

const Report = ({ t }: ReportProps) => {
  const print = () => {
    window.print();
  };

  return (
    <Query query={ReportQuery}>
      {({ loading, data }: any) => {
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
            <Button className="no-print" onClick={print}>
              {t('print')}
            </Button>
          </>
        );
      }}
    </Query>
  );
};

export default translate('PrintReport')(Report);
