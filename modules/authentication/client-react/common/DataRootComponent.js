import React from 'react';
import PropTypes from 'prop-types';

import { Subscription, withApollo } from 'react-apollo';

import settings from '@gqlapp/config';

import createDeviceId from './createDeviceId';

import PageReloader from './PageReloader';

import SUBSCRIPTION_LOGOUT from './graphql/LogoutFromAllDevicessSubscription.graphql';

class DataRootComponent extends React.Component {
  state = {
    userId: '',
    deviceId: createDeviceId()
  };

  componentDidMount() {
    if (this.props.currentUser) {
      this.setState({
        userId: this.props.currentUser.id
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.currentUser && this.props.currentUser) {
      this.setState({
        userId: this.props.currentUser.id
      });
    }
  }

  ref = React.createRef();

  onReloadPage = async client => {
    if (settings.auth.jwt.enabled) {
      const removeTokens = require('../access/jwt/helpers').removeTokens;
      await removeTokens();
    }

    await client.clearStore();
    this.ref.current.reloadPage();
  };

  render() {
    const { userId, deviceId } = this.state;

    const input = {
      deviceId,
      ...(userId && { id: userId })
    };

    return (
      <Subscription subscription={SUBSCRIPTION_LOGOUT} variables={{ input }}>
        {({ loading }) => {
          if (!loading) {
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
  children: PropTypes.node,
  currentUser: PropTypes.object
};

export default withApollo(DataRootComponent);
