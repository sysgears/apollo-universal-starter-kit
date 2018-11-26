import AccessModule from '../AccessModule';
import settings from '../../../../../../../settings';

import LOGOUT from './graphql/Logout.graphql';
import LOGOUT_FROM_ALL_DEVICES from './graphql/LogoutFromAllDevices.graphql';

const logout = client => client.mutate({ mutation: LOGOUT });
const logoutFromAllDevices = client => client.mutate({ mutation: LOGOUT_FROM_ALL_DEVICES });

export default (settings.user.auth.access.session.enabled
  ? new AccessModule({
      logout: [logout],
      logoutFromAllDevices: [logoutFromAllDevices]
    })
  : undefined);
