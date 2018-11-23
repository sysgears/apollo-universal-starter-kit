import { ApolloLink, Observable } from 'apollo-link';

import CURRENT_USER_QUERY from '../../graphql/CurrentUserQuery.graphql';
import AccessModule from '../AccessModule';
import settings from '../../../../../../../settings';

import LOGOUT from './graphql/Logout.graphql';

const logout = client => client.mutate({ mutation: LOGOUT });

const createSessionLink = getClientRef => {
  return new ApolloLink((operation, forward) => {
    return new Observable(observer => {
      const sub = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: error => {
          if (error.name === 'AuthenticationError' && error.message === 'SessionExpiredError') {
            (async () => {
              const client = getClientRef();
              await client.cache.reset();
              await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: null } });
            })();
          }
          observer.error(error);
        },
        complete: observer.complete.bind(observer)
      });

      return () => sub.unsubscribe();
    });
  });
};

export default (settings.user.auth.access.session.enabled
  ? new AccessModule({
      createLink: !settings.user.auth.access.jwt.enabled ? [createSessionLink] : [],
      logout: [logout]
    })
  : undefined);
