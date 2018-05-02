import Feature from '../connector';
import settings from '../../../../../../../settings';

import CURRENT_USER_QUERY from '../../graphql/CurrentUserQuery.graphql';
import LOGOUT from './graphql/Logout.graphql';

const logout = async client => {
  const {
    data: { logout }
  } = await client.mutate({ mutation: LOGOUT });
  if (!logout || !logout.errors) {
    await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: null } });
  }
  return logout;
};

export default new Feature(
  settings.user.auth.access.session.enabled
    ? {
        logout
      }
    : {}
);
