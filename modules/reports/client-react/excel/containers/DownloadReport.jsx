import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';

import { Button } from '@module/look-client-react';
import { translate } from '@module/i18n-client-react';
import query from '../../graphql/Excel.graphql';
import { downloadFile, getObjectURLFromArray } from '../../common';

@translate('ExcelReport')
class DownloadReport extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.donwload = this.donwload.bind(this);
  }

  async donwload() {
    const { client } = this.props;
    const { data } = await client.query({
      query
    });
    const url = getObjectURLFromArray(data.excel);
    downloadFile(url, 'Report.xlsx');
  }

  render() {
    const { t } = this.props;
    return (
      <Button style={{ marginLeft: '10px' }} onClick={this.donwload}>
        {t('downloadExcel')}
      </Button>
    );
  }
}

export default withApollo(DownloadReport);
