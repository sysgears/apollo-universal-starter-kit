import { ApolloLink, Observable } from 'apollo-link';
import React from 'react';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';

import Feature from '../connector';

import REFRESH_TOKENS_MUTATION from './graphql/RefreshTokens.graphql';
import CURRENT_USER_QUERY from '../../graphql/CurrentUserQuery.graphql';

import modules from '../../..';

const loginHandler = async loginResponse => {
  if (loginResponse && loginResponse.tokens) {
    const { accessToken, refreshToken } = loginResponse.tokens;
    window.localStorage.setItem('accessToken', accessToken);
    window.localStorage.setItem('refreshToken', refreshToken);
  }
};

const setJWTContext = operation => {
  const accessToken = window.localStorage.getItem('accessToken');
  operation.setContext({
    credentials: 'same-origin',
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : null
    }
  });
};

const isTokenRefreshNeeded = (operation, result) => {
  if (result.errors) {
    for (const error of result.errors) {
      if (error.message && error.message.indexOf('Not Authenticated') >= 0) {
        return true;
      }
    }
  }
  if (operation.operationName === 'currentUser' && result.data.currentUser === null) {
    // We have refresh token here, and empty current user, it means we need to refresh tokens
    return true;
  }
  return false;
};

let apolloClient;

const JWTLink = new ApolloLink((operation, forward) => {
  const refreshToken = window.localStorage.getItem('refreshToken');
  if (!refreshToken || ['login', 'refreshTokens'].indexOf(operation.operationName) >= 0) {
    return forward(operation);
  } else {
    return new Observable(observer => {
      setJWTContext(operation);
      let sub, retrySub;
      try {
        sub = forward(operation).subscribe({
          next: result => {
            if (isTokenRefreshNeeded(operation, result)) {
              (async () => {
                try {
                  const { data: { refreshTokens: { accessToken, refreshToken } } } = await apolloClient.mutate({
                    mutation: REFRESH_TOKENS_MUTATION,
                    variables: { refreshToken: window.localStorage.getItem('refreshToken') }
                  });
                  window.localStorage.setItem('accessToken', accessToken);
                  window.localStorage.setItem('refreshToken', refreshToken);
                  // Retry current operation
                  setJWTContext(operation);
                  retrySub = forward(operation).subscribe(observer);
                } catch (e) {
                  window.localStorage.removeItem('accessToken');
                  window.localStorage.removeItem('refreshToken');
                  observer.error(e);
                }
              })();
            } else {
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

      return () => {
        if (sub) sub.unsubscribe();
        if (retrySub) retrySub.unsubscribe();
      };
    });
  }
});

class DataRootComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { ready: false };
  }

  async componentDidMount() {
    const { client } = this.props;
    apolloClient = client;
    const refreshToken = window.localStorage.getItem('refreshToken');
    if (refreshToken) {
      const result = client.readQuery({ query: CURRENT_USER_QUERY });
      if (result && !result.currentUser) {
        // If we don't have current user but have refresh token,
        // then we need to trigger our token refresh logic by sending network request
        const { data: { currentUser } } = await client.query({
          query: CURRENT_USER_QUERY,
          fetchPolicy: 'network-only'
        });
        // If we have received current user, then we have invalid Apollo Cache and we should discard it
        if (currentUser) {
          await client.cache.reset();
          await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser } });
          await client.cache.writeData({ data: modules.resolvers.defaults });
        }
      }
    }
    this.setState({ ready: true });
  }

  render() {
    return this.state.ready ? this.props.children : null;
  }
}

DataRootComponent.propTypes = {
  client: PropTypes.object,
  children: PropTypes.node
};

export default new Feature({
  loginHandler,
  dataRootComponent: withApollo(DataRootComponent),
  link: JWTLink
});
