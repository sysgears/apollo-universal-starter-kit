import { ApolloLink, Observable } from 'apollo-link';
import AccessModule from '../AccessModule';
import settings from '../../../../../settings';

import LOGOUT from './graphql/Logout.graphql';
import LOGOUT_FROM_ALL_DEVICES from './graphql/LogoutFromAllDevices.graphql';

const logout = client => client.mutate({ mutation: LOGOUT });
const logoutFromAllDevices = client => client.mutate({ mutation: LOGOUT_FROM_ALL_DEVICES });

const SessionLink = getApolloClient =>
  new ApolloLink((operation, forward) => {
    return new Observable(observer => {
      const apolloClient = getApolloClient();
      let sub, retrySub;
      const queue = [];

      (async () => {
        try {
          sub = forward(operation).subscribe({
            next: result => {
              const promise = (async () => {
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
                if (networkError.response && networkError.response.status === 401) {
                  try {
                    await apolloClient.cache.reset();

                    retrySub = forward(operation).subscribe(observer);
                  } catch (e) {
                    observer.error(e);
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

export default (settings.user.auth.access.session.enabled
  ? new AccessModule({
      logout: [logout],
      createLink: __CLIENT__ ? [getApolloClient => SessionLink(getApolloClient)] : [],
      logoutFromAllDevices: [logoutFromAllDevices]
    })
  : undefined);
