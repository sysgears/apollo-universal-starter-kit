import { ApolloLink, Observable, execute } from 'apollo-link';

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

const JWTLink = new ApolloLink((operation, forward) => {
  return new Observable(observer => {
    const refreshToken = window.localStorage.getItem('refreshToken');
    if (!refreshToken || ['login', 'refreshTokens'].indexOf(operation.operationName) >= 0) {
      return forward(operation).subscribe(observer);
    }
    setJWTContext(operation);
    let sub;
    try {
      sub = forward(operation).subscribe({
        next: result => {
          let needTokenRefresh = false;
          if (result.errors) {
            for (const error of result.errors) {
              if (error.message && error.message.indexOf('Not Authenticated') >= 0) {
                needTokenRefresh = true;
                break;
              }
            }
          }
          if (needTokenRefresh) {
            execute(
              new ApolloLink(refreshOperation => {
                forward(refreshOperation).subscribe({
                  next: ({ data: { refreshTokens: { accessToken, refreshToken } } }) => {
                    window.localStorage.setItem('accessToken', accessToken);
                    window.localStorage.setItem('refreshToken', refreshToken);
                    setJWTContext(operation);
                    forward(operation).subscribe(observer);
                  },
                  error: err => {
                    window.localStorage.removeItem('accessToken');
                    window.localStorage.removeItem('refreshToken');
                    observer.error(err);
                  }
                });
              }),
              {
                query: REFRESH_TOKENS_MUTATION,
                variables: { refreshToken: window.localStorage.getItem('refreshToken') }
              }
            );
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
    };
  });
});

const refreshTokens = async client => {
  try {
    const { data: { refreshTokens: { accessToken, refreshToken } } } = await client.mutate({
      mutation: REFRESH_TOKENS_MUTATION,
      variables: { refreshToken: window.localStorage.getItem('refreshToken') }
    });
    window.localStorage.setItem('accessToken', accessToken);
    window.localStorage.setItem('refreshToken', refreshToken);
    return { accessToken, refreshToken };
  } catch (e) {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    return {};
  }
};

const onInit = async client => {
  const refreshToken = window.localStorage.getItem('refreshToken');
  if (refreshToken) {
    const result = client.readQuery({ query: CURRENT_USER_QUERY });
    if (result && !result.currentUser) {
      // If we don't have current user but have refresh token, then
      // It means either our initial Apollo Cache is invalid or we have expired refresh token
      // Below we try to figure out which of these two options is the case
      const { data: { currentUser } } = await client.query({ query: CURRENT_USER_QUERY, fetchPolicy: 'network-only' });
      if (!currentUser) {
        const { accessToken } = await refreshTokens(client, refreshToken);
        if (accessToken) {
          await client.cache.reset();
          await client.cache.writeData({ data: modules.resolvers.defaults });
          await client.query({ query: CURRENT_USER_QUERY, fetchPolicy: 'network-only' });
        }
      }
    }
  }
};

export default new Feature({
  loginHandler,
  onInit,
  link: JWTLink
});
