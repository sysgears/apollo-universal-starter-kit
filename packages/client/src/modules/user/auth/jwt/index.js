import { setContext } from 'apollo-link-context';

import Feature from '../connector';

import REFRESH_TOKENS_MUTATION from './graphql/RefreshTokens.graphql';
import CURRENT_USER_QUERY from '../../graphql/CurrentUserQuery.graphql';

// import modules from '../../..';

const loginHandler = async loginResponse => {
  if (loginResponse && loginResponse.tokens) {
    const { accessToken, refreshToken } = loginResponse.tokens;
    window.localStorage.setItem('accessToken', accessToken);
    window.localStorage.setItem('refreshToken', refreshToken);
  }
};

const withToken = setContext(async (operationName, { headers }) => {
  if (['login', 'refreshTokens'].indexOf(operationName) < 0) {
    const accessToken = window.localStorage.getItem('accessToken');
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : null
      }
    };
  }
});

const middleware = async (req, options, next) => {
  next();
};

const refreshTokens = async client => {
  try {
    const { data: { refreshTokens: { accessToken, refreshToken } } } = await client.mutate({
      mutation: REFRESH_TOKENS_MUTATION,
      variables: { refreshToken: window.localStorage.getItem('refreshToken') }
    });
    window.localStorage.setItem('accessToken', accessToken);
    window.localStorage.setItem('refreshToken', refreshToken);
    return true;
  } catch (e) {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    return false;
  }
};

const onInit = async client => {
  const refreshToken = window.localStorage.getItem('refreshToken');
  if (refreshToken) {
    const result = client.readQuery({ query: CURRENT_USER_QUERY });
    if (result && !result.currentUser) {
      const { data: { currentUser } } = await client.query({ query: CURRENT_USER_QUERY, fetchPolicy: 'network-only' });
      if (!currentUser && (await refreshTokens(client, refreshToken))) {
        // await client.cache.reset();
        // await client.cache.writeData({ data: modules.resolvers.defaults });
        await client.query({ query: CURRENT_USER_QUERY, fetchPolicy: 'network-only' });
      }
    }
  }
};

export default new Feature({
  loginHandler,
  middleware,
  onInit,
  link: withToken
});
