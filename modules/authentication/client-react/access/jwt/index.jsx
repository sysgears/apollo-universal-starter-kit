import { ApolloLink, Observable, execute, makePromise } from 'apollo-link';

import { getItem, setItem, removeItem } from '@module/core-common/clientStorage';
import { apiUrl } from '@module/core-common';

import { BatchHttpLink } from 'apollo-link-batch-http';

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

const onRefreshToken = async operation => {
  const link = new BatchHttpLink({
    uri: apiUrl,
    credentials: 'include'
  });

  const context = await operation.getContext();

  const config = {
    query: REFRESH_TOKENS_MUTATION,
    variables: { refreshToken: await getItem('refreshToken') },
    context: { ...context, headers: {} }
  };

  return makePromise(execute(link, config));
};

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
              if (networkError.response && networkError.response.status >= 400 && networkError.response.status < 500) {
                try {
                  if (operation.operationName !== 'refreshTokens') {
                    try {
                      const { data } = await onRefreshToken(operation);

                      if (data && data.refreshTokens) {
                        const { accessToken, refreshToken } = data.refreshTokens;
                        await saveTokens({ accessToken, refreshToken });
                      } else {
                        await removeTokens();
                      }
                    } catch (e) {
                      await removeTokens();
                    }
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
      link: __CLIENT__ ? [JWTLink] : [],
      logout: [removeTokens]
    })
  : undefined);
