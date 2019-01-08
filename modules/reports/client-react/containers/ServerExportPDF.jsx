import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { removeTypename } from '@module/core-common';
import { translate } from '@module/i18n-client-react';
import { Query } from 'react-apollo';
import { Button } from '@module/look-client-react';
import WithExportPDF from './WithExportPDF';
import ServerReportDemo from '../components/ServerReportDemo';
import ReportsQuery from '../graphql/ReportsQuery.graphql';

@translate('reports')
class ServerExportPDF extends Component {
  static propTypes = {
    t: PropTypes.func
  };

  render() {
    const { t } = this.props;
    const button = <Button>{t('btn')}</Button>;
    return (
      <Query query={ReportsQuery}>
        {({ loading, data: { reports } }) => {
          if (loading) return null;
          reports = Object.values(removeTypename(reports));
          return (
            <WithExportPDF button={button} visibly={false}>
              <ServerReportDemo reports={reports} />
            </WithExportPDF>
          );
        }}
      </Query>
    );
  }
}

export default ServerExportPDF;
