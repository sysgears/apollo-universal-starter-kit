import { ApolloLink, Observable } from 'apollo-link';
import { getItem, setItem, removeItem } from '@gqlapp/core-common/clientStorage';

import AccessModule from '../AccessModule';
import settings from '../../../../../settings';

import REFRESH_TOKENS_MUTATION from './graphql/RefreshTokens.graphql';

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

const saveTokens = async ({ accessToken, refreshToken }) => {
  await setItem('accessToken', accessToken);
  await setItem('refreshToken', refreshToken);
};

const removeTokens = async () => {
  await removeItem('accessToken');
  await removeItem('refreshToken');
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

export default (settings.auth.jwt.enabled
  ? new AccessModule({
      createLink: __CLIENT__ ? [getApolloClient => JWTLink(getApolloClient)] : [],
      logout: [removeTokens]
    })
  : undefined);
