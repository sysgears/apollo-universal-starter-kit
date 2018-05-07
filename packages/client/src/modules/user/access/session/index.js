import Feature from '../connector';
import settings from '../../../../../../../settings';

import LOGOUT from './graphql/Logout.graphql';

const logout = client => client.mutate({ mutation: LOGOUT });

export default new Feature(
  settings.user.auth.access.session.enabled
    ? {
        logout
      }
    : {}
);
