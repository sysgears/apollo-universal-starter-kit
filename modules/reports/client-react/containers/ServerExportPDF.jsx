import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';
import { Button } from '@module/look-client-react';
import { translate } from '@module/i18n-client-react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import ReportQuery from '../graphql/ReportQuery.graphql';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@translate('reports')
class ServerExportPDF extends Component {
  static propTypes = {
    t: PropTypes.func
  };

  handleServerPDF = docDefinition => {
    console.log(docDefinition);
    pdfMake.createPdf(docDefinition).print();
  };

  render() {
    const { t } = this.props;

    return (
      <Query query={ReportQuery} variables={{ id: 1 }}>
        {({ loading, data: { report } }) => {
          if (loading) return null;
          return (
            <div>
              <Button onClick={() => this.handleServerPDF(JSON.parse(report.content))}>{t('btn')}</Button>
              {/*<div id="iframeContainer"></div>*/}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default ServerExportPDF;
