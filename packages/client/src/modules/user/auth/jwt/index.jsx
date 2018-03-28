import { ApolloLink, Observable } from 'apollo-link';
import React from 'react';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';

import { LayoutCenter } from '../../../common/components';
import { getItem, setItem, removeItem } from './tokenStorage';
import Feature from '../connector';
import modules from '../../..';
import settings from '../../../../../../../settings';

import REFRESH_TOKENS_MUTATION from './graphql/RefreshTokens.graphql';
import CURRENT_USER_QUERY from '../../graphql/CurrentUserQuery.graphql';

const setJWTContext = async operation => {
  const accessToken = await getItem('accessToken');
  operation.setContext(context => ({
    ...context,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : null
    }
  }));
};

const isTokenRefreshNeeded = async (operation, result) => {
  let needRefresh = false;
  const refreshToken = await getItem('refreshToken');
  if (refreshToken && operation.operationName !== 'refreshTokens') {
    if (result.errors) {
      for (const error of result.errors) {
        if (error.message && error.message.indexOf('Not Authenticated') >= 0) {
          needRefresh = true;
          break;
        }
      }
    } else if (operation.operationName === 'currentUser' && result.data.currentUser === null) {
      // We have refresh token here, and empty current user received as a network request result,
      // it means we need to refresh tokens
      needRefresh = true;
    }
  }
  return needRefresh;
};

let apolloClient;

const saveTokens = async ({ accessToken, refreshToken }) => {
  await setItem('accessToken', accessToken);
  await setItem('refreshToken', refreshToken);
};

const removeTokens = async () => {
  await removeItem('accessToken');
  await removeItem('refreshToken');
};

const JWTLink = new ApolloLink((operation, forward) => {
  return new Observable(observer => {
    let sub, retrySub;
    (async () => {
      if (['login', 'refreshTokens'].indexOf(operation.operationName) < 0) {
        await setJWTContext(operation);
      }
      try {
        sub = forward(operation).subscribe({
          next: async result => {
            let retry = false;
            if (operation.operationName === 'login') {
              const { data: { login: { tokens: { accessToken, refreshToken } } } } = result;
              await saveTokens({ accessToken, refreshToken });
            } else if (await isTokenRefreshNeeded(operation, result)) {
              try {
                const { data: { refreshTokens: { accessToken, refreshToken } } } = await apolloClient.mutate({
                  mutation: REFRESH_TOKENS_MUTATION,
                  variables: { refreshToken: await getItem('refreshToken') }
                });
                await saveTokens({ accessToken, refreshToken });
                // Retry current operation
                await setJWTContext(operation);
                retrySub = forward(operation).subscribe(observer);
                retry = true;
              } catch (e) {
                // We have received error during refresh - drop tokens and return original request result
                await removeTokens();
              }
            }
            if (!retry) {
              observer.next(result);
              observer.complete();
            }
          },
          error: observer.error.bind(observer),
          complete: () => {}
        });
      } catch (e) {
        observer.error(e);
      }
    })();

    return () => {
      if (sub) sub.unsubscribe();
      if (retrySub) retrySub.unsubscribe();
    };
  });
});

// TODO: shouldn't be needed at all when React Apollo will allow rendering
// all queries as loading: true during SSR
class DataRootComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { ready: false };
  }

  async componentDidMount() {
    const { client } = this.props;
    apolloClient = client;
    const refreshToken = await getItem('refreshToken');
    if (refreshToken) {
      let result;
      try {
        result = client.readQuery({ query: CURRENT_USER_QUERY });
      } catch (e) {
        // We have no current user in the cache, we need to load it to properly draw UI
      }
      if (!result || !result.currentUser) {
        // If we don't have current user but have refresh token, this means our Apollo Cache
        // might be invalid: we received this Apollo Cache from server in __APOLLO_STATE__
        // as generated during server-sider rendering. Server had no idea about our client-side
        // access token and refresh token. In this case we need to trigger our JWT link
        // by sending network request
        const { data: { currentUser } } = await client.query({
          query: CURRENT_USER_QUERY,
          fetchPolicy: 'network-only'
        });
        if (currentUser) {
          // If we have received current user, then we had invalid Apollo Cache previously
          // and we should discard it
          await client.cache.reset();
          await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser } });
          await client.cache.writeData({ data: modules.resolvers.defaults });
        }
      }
    }
    this.setState({ ready: true });
  }

  render() {
    return this.state.ready ? (
      this.props.children
    ) : (
      <LayoutCenter>
        <div className="text-center">App is loading...</div>
      </LayoutCenter>
    );
  }
}

DataRootComponent.propTypes = {
  client: PropTypes.object,
  children: PropTypes.node
};

export default new Feature(
  settings.user.auth.access.jwt.enabled
    ? {
        dataRootComponent: !settings.user.auth.access.session.enabled ? withApollo(DataRootComponent) : undefined,
        link: __CLIENT__ ? JWTLink : undefined,
        logout: removeTokens
      }
    : {}
);
