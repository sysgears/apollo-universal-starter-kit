import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';

import { getItem } from '@gqlapp/core-common/clientStorage';
import settings from '@gqlapp/config';

import Loading from '../components/Loading';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';

// TODO: shouldn't be needed at all when React Apollo will allow rendering
// all queries as loading: true during SSR
class DataRootComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ready: settings.auth.session.enabled };
  }

  async componentDidMount() {
    if (!this.state.ready && (await getItem('refreshToken'))) {
      const { client } = this.props;
      let result;
      try {
        result = await client.readQuery({ query: CURRENT_USER_QUERY });
      } catch (e) {
        // We have no current user in the cache, we need to load it to properly draw UI
      }
      if (!result || !result.currentUser) {
        // If we don't have current user but have refresh token, this means our Apollo Cache
        // might be invalid: we received this Apollo Cache from server in __APOLLO_STATE__
        // as generated during server-sider rendering. Server had no idea about our client-side
        // access token and refresh token. In this case we need to trigger our JWT link
        // by sending network request
        const {
          data: { currentUser }
        } = await client.query({
          query: CURRENT_USER_QUERY,
          fetchPolicy: 'network-only'
        });
        if (currentUser) {
          // If we have received current user, then we had invalid Apollo Cache previously
          // and we should discard it
          await client.clearStore();
          await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser } });
        }
      }
    }
    this.setState({ ready: true });
  }

  render() {
    return this.state.ready ? this.props.children : <Loading />;
  }
}

DataRootComponent.propTypes = {
  client: PropTypes.object,
  children: PropTypes.node
};

export default withApollo(DataRootComponent);
