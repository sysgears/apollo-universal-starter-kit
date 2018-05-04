import Feature from '../connector';
import settings from '../../../../../../../settings';

import LOGOUT from './graphql/Logout.graphql';

const logout = async client => {
  const {
    data: { logout }
  } = await client.mutate({ mutation: LOGOUT });
  return logout;
};

export default new Feature(
  settings.user.auth.access.session.enabled
    ? {
        logout
      }
    : {}
);
