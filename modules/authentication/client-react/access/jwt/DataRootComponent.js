import React from 'react';
import PropTypes from 'prop-types';

import { Subscription, withApollo } from 'react-apollo';

import { getItem } from '@gqlapp/core-common/clientStorage';
import { removeTokens } from './helpers';

import PageReloader from '../../common/PageReloader';

import SUBSCRIPTION_LOGOUT from './graphql/LogoutFromAllDevicessSubscription.graphql';

class DataRootComponent extends React.Component {
  state = {
    token: ''
  };

  async componentDidMount() {
    const token = await getItem('accessToken');
    this.setState({ token });
  }

  ref = React.createRef();

  onReloadPage = async client => {
    await removeTokens();
    await client.clearStore();
    this.ref.current.reloadPage();
  };

  render() {
    const { token } = this.state;
    return (
      <Subscription subscription={SUBSCRIPTION_LOGOUT} variables={{ token }}>
        {({ data, loading }) => {
          if (data && !loading) {
            this.onReloadPage(this.props.client);
          }
          return <PageReloader ref={this.ref}>{this.props.children}</PageReloader>;
        }}
      </Subscription>
    );
  }
}

DataRootComponent.propTypes = {
  client: PropTypes.object,
  children: PropTypes.node
};

export default withApollo(DataRootComponent);
