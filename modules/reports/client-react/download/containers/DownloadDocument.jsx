import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';

import { Button } from '@module/look-client-react';
import { downloadFile, getObjectURLFromArray } from '../../helpers';

class DownloadDocument extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    fileName: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    queryProp: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.donwload = this.donwload.bind(this);
  }

  async donwload() {
    const { client, query, fileName, queryProp } = this.props;
    const { data } = await client.query({
      query
    });
    const url = getObjectURLFromArray(data[queryProp]);
    downloadFile(url, fileName);
  }

  render() {
    const { children } = this.props;
    return (
      <Button style={{ marginLeft: '10px' }} onClick={this.donwload}>
        {children}
      </Button>
    );
  }
}

export default withApollo(DownloadDocument);
