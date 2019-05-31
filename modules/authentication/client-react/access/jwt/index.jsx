import { ApolloLink, Observable } from 'apollo-link';

import { getItem } from '@gqlapp/core-common/clientStorage';
import settings from '@gqlapp/config';
import { saveTokens, removeTokens } from './helpers';

import AccessModule from '../AccessModule';

import DataRootComponent from './components/DataRootComponent';

import REFRESH_TOKENS_MUTATION from './graphql/RefreshTokens.graphql';
import LOGOUT_FROM_ALL_DEVICES from './graphql/LogoutFromAllDevices.graphql';

const setJWTContext = async operation => {
  const accessToken = await getItem('accessToken');

  const headers =
    ['login', 'refreshTokens'].indexOf(operation.operationName) < 0 && accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

  operation.setContext(context => ({
    ...context,
    headers
  }));
};

const JWTLink = getApolloClient =>
  new ApolloLink((operation, forward) => {
    return new Observable(observer => {
      const apolloClient = getApolloClient();

      let sub, retrySub;
      const queue = [];
      (async () => {
        if (
          !settings.auth.session.enabled &&
          operation.operationName === 'currentUser' &&
          !(await getItem('refreshToken'))
        ) {
          observer.next({ data: { currentUser: null } });
          observer.complete();
          return;
        }

        await setJWTContext(operation);
        try {
          sub = forward(operation).subscribe({
            next: result => {
              const promise = (async () => {
                if (operation.operationName === 'login') {
                  if (!!result.data && result.data.login.tokens) {
                    const {
                      data: {
                        login: {
                          tokens: { accessToken, refreshToken }
                        }
                      }
                    } = result;
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
                if (
                  networkError.response &&
                  networkError.response.status >= 400 &&
                  networkError.response.status < 500
                ) {
                  try {
                    const { data } = await apolloClient.mutate({
                      mutation: REFRESH_TOKENS_MUTATION,
                      variables: { refreshToken: await getItem('refreshToken') }
                    });

                    if (data && data.refreshTokens) {
                      const { accessToken, refreshToken } = data.refreshTokens;
                      await saveTokens({ accessToken, refreshToken });
                    } else {
                      await removeTokens();
                    }
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

const logoutFromAllDevices = async client => {
  const accessToken = await getItem('accessToken');
  const { data } = await client.mutate({ mutation: LOGOUT_FROM_ALL_DEVICES, variables: { accessToken: accessToken } });
  if (data && data.logoutFromAllDevices) {
    const { accessToken, refreshToken } = data.logoutFromAllDevices;
    await saveTokens({ accessToken, refreshToken });
  } else {
    await removeTokens();
  }
};

export default (settings.auth.jwt.enabled
  ? new AccessModule({
      dataRootComponent: [DataRootComponent],
      createLink: __CLIENT__ ? [getApolloClient => JWTLink(getApolloClient)] : [],
      logout: [removeTokens],
      logoutFromAllDevices: [logoutFromAllDevices]
    })
  : undefined);
