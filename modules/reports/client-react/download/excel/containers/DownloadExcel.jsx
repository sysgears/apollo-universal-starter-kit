import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';

import { Button } from '@module/look-client-react';
import { downloadFile, getObjectURLFromArray } from '../../../helpers';

class DownloadExcel extends Component {
  static propTypes = {
    t: PropTypes.func,
    client: PropTypes.object.isRequired,
    fileName: PropTypes.string,
    query: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);
    this.donwloadPDF = this.donwloadPDF.bind(this);
  }

  async donwloadPDF() {
    const { client, query, fileName = 'Report.xlsx' } = this.props;
    const { data } = await client.query({
      query
    });
    const url = getObjectURLFromArray(data.excel);
    downloadFile(url, fileName);
  }

  render() {
    const { children } = this.props;
    return (
      <Button style={{ marginLeft: '10px' }} onClick={this.donwloadPDF}>
        {children}
      </Button>
    );
  }
}

export default withApollo(DownloadExcel);
