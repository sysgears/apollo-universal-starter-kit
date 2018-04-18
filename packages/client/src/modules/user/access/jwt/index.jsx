import { ApolloLink, Observable } from 'apollo-link';
import React from 'react';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';

import { LayoutCenter } from '../../../common/components';
import { getItem, setItem, removeItem } from './tokenStorage';
import Feature from '../connector';
import settings from '../../../../../../../settings';

import REFRESH_TOKENS_MUTATION from './graphql/RefreshTokens.graphql';
import CURRENT_USER_QUERY from '../../graphql/CurrentUserQuery.graphql';

const setJWTContext = async operation => {
  const accessToken = await getItem('accessToken');
  const headers =
    ['login', 'refreshTokens'].indexOf(operation.operationName) < 0 && accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};
  operation.setContext(context => ({
    ...context,
    headers: { ...headers }
  }));
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
    const queue = [];
    (async () => {
      await setJWTContext(operation);
      try {
        sub = forward(operation).subscribe({
          next: result => {
            const promise = (async () => {
              if (operation.operationName === 'login') {
                if (result.data.login.tokens && !result.data.login.errors) {
                  const { data: { login: { tokens: { accessToken, refreshToken } } } } = result;
                  await saveTokens({ accessToken, refreshToken });
                } else {
                  await removeTokens();
                }
              }
              observer.next(result);
            })();
            queue.push(promise);
            if (queue.length > 100) {
              Promise.all(queue).then(() => {
                queue.length = 0;
              });
            }
          },
          error: networkError => {
            (async () => {
              if (networkError.response.status === 401) {
                try {
                  const { data: { refreshTokens: { accessToken, refreshToken } } } = await apolloClient.mutate({
                    mutation: REFRESH_TOKENS_MUTATION,
                    variables: { refreshToken: await getItem('refreshToken') }
                  });
                  await saveTokens({ accessToken, refreshToken });
                  // Retry current operation
                  await setJWTContext(operation);
                  retrySub = forward(operation).subscribe(observer);
                } catch (e) {
                  // We have received error during refresh - drop tokens and return original request result
                  await removeTokens();
                  observer.error(networkError);
                }
              } else {
                observer.error(networkError);
              }
            })();
          },
          complete: () => {
            Promise.all(queue).then(() => {
              queue.length = 0;
              observer.complete();
            });
          }
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
    apolloClient = this.props.client;
    this.state = { ready: settings.user.auth.access.session.enabled };
  }

  async componentDidMount() {
    if (!this.state.ready && (await getItem('refreshToken'))) {
      const { client } = this.props;
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
          await client.resetStore();
          await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser } });
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
        dataRootComponent: withApollo(DataRootComponent),
        link: __CLIENT__ ? JWTLink : undefined,
        logout: removeTokens
      }
    : {}
);
