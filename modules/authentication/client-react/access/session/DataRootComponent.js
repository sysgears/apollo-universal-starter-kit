import React from 'react';
import PropTypes from 'prop-types';

import { Subscription, withApollo } from 'react-apollo';

import PageReloader from '../../common/PageReloader';

import SUBSCRIPTION_LOGOUT from './graphql/LogoutFromAllDevicessSubscription.graphql';

class DataRootComponent extends React.Component {
  state = {};

  ref = React.createRef();

  // onReloadPage = async client => {
  //   console.log('onReloadPage --->', 'onReloadPage');
  // };

  render() {
    return (
      <Subscription subscription={SUBSCRIPTION_LOGOUT}>
        {({ loading }) => {
          if (!loading) {
            // this.onReloadPage(this.props.client);
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
