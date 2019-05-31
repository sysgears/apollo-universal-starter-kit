import React from 'react';
import PropTypes from 'prop-types';

import { Subscription, withApollo } from 'react-apollo';

import { getItem } from '@gqlapp/core-common/clientStorage';
import { removeTokens } from '../helpers';

import CompReloader from './CompReloader';

import SUBSCRIPTION_LOGOUT from '../graphql/LogoutFromAllDevicessSubscription.graphql';

class DataRootComponent extends React.Component {
  state = {
    token: ''
  };

  ref = React.createRef();

  async componentDidMount() {
    const token = await getItem('accessToken');
    this.setState({ token });
  }

  removeTokensAndClearStore = async client => {
    await removeTokens();
    await client.clearStore();
    this.ref.current.reloadComp();
  };

  render() {
    const { token } = this.state;
    return (
      <Subscription subscription={SUBSCRIPTION_LOGOUT} variables={{ token }}>
        {({ data, loading }) => {
          if (data && !loading) {
            this.removeTokensAndClearStore(this.props.client);
          }
          return <CompReloader ref={this.ref}>{this.props.children}</CompReloader>;
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
