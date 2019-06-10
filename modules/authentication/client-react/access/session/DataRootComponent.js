import React from 'react';
import PropTypes from 'prop-types';

import { Subscription, withApollo } from 'react-apollo';

import createDeviceId from '../../common/createDeviceId';

import PageReloader from '../../common/PageReloader';

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
