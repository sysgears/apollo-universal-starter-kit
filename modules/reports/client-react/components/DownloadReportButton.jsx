import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';

import { translate } from '@module/i18n-client-react';
import { Button } from '@module/look-client-react';

@translate('reports')
class DownloadReportButton extends Component {
  static propTypes = {
    t: PropTypes.func,
    format: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onDataLoad: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired
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
            style={{ marginRight: '10px' }}
            onClick={async () => {
              this.setState({ isLoading: true });
              const { data } = await client.query({
                query: this.props.query
              });
              this.props.onDataLoad(data[`${this.props.format}Report`]);
              this.setState({ isLoading: false });
            }}
          >
            {this.state.isLoading ? t('loading') : this.props.title}
          </Button>
        )}
      </ApolloConsumer>
    );
  }
}

export default DownloadReportButton;
