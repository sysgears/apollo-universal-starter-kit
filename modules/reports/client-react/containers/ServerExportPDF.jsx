import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// import { removeTypename } from '@module/core-common';
import { translate } from '@module/i18n-client-react';
import { Query } from 'react-apollo';
// import { Button } from '@module/look-client-react';
// import WithExportPDF from './WithExportPDF';
// import ServerReportDemo from '../components/ServerReportDemo';
// import ReportsQuery from '../graphql/ReportsQuery.graphql';
import getReport from '../graphql/getReport.graphql';

@translate('reports')
class ServerExportPDF extends Component {
  static propTypes = {
    t: PropTypes.func
  };

  render() {
    // const { t } = this.props;
    // const button = <Button>{t('btn')}</Button>;
    return (
      <Query query={getReport}>
        {({ loading, data: { getReport } }) => {
          if (loading) return null;
          console.log(getReport);
          // const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
          //   const byteCharacters = atob(b64Data);
          //
          //   const byteArrays = [];
          //
          //   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          //     const slice = byteCharacters.slice(offset, offset + sliceSize),
          //       byteNumbers = new Array(slice.length);
          //     for (let i = 0; i < slice.length; i++) {
          //       byteNumbers[i] = slice.charCodeAt(i);
          //     }
          //     const byteArray = new Uint8Array(byteNumbers);
          //
          //     byteArrays.push(byteArray);
          //   }
          //
          //   return new Blob(byteArrays, { type: contentType });
          // };
          //
          // const blob = b64toBlob(getReport, 'application/pdf');
          // console.log(blob);
          //
          // const myReader = new FileReader();
          // myReader.addEventListener('loadend', function(e) {
          //   // console.log( e.srcElement.result)
          //   document.getElementById('Iframe').innerHTML = e.srcElement.result;
          // });
          // myReader.readAsText(blob);

          // const iframeEle = document.getElementById("Iframe");
          // if (iframeEle) {
          //   iframeEle.contentWindow.print();
          // }
          return (
            <Fragment>
              <div id="Iframe" />
              {/*<WithExportPDF button={button} visibly={false}>*/}
              {/*<ServerReportDemo reports={reports} />*/}
              {/*</WithExportPDF>*/}
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default ServerExportPDF;
