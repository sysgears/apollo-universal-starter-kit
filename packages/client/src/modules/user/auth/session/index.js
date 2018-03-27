import { ApolloLink, Observable } from 'apollo-link';

import Feature from '../connector';
import settings from '../../../../../../../settings';

import CURRENT_USER_QUERY from '../../graphql/CurrentUserQuery.graphql';
import LOGOUT from './graphql/Logout.graphql';

const logout = async client => {
  const { data: { logout } } = await client.mutate({ mutation: LOGOUT });
  if (!logout || !logout.errors) {
    await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: null } });
  }
  return logout;
};

const SessionLink = new ApolloLink((operation, forward) => {
  return new Observable(observer => {
    operation.setContext(context => ({
      ...context,
      headers: { 'x-token': window.__CSRF_TOKEN__ }
    }));
    const sub = forward(operation).subscribe(observer);
    return () => sub.unsubscribe();
  });
});

export default new Feature(
  settings.user.auth.access.session.enabled
    ? {
        link: __CLIENT__ ? SessionLink : undefined,
        logout
      }
    : {}
);
