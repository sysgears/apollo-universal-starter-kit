import settings from '@gqlapp/config';

import AccessModule from '../AccessModule';

import LOGOUT from './graphql/Logout.graphql';
import LOGOUT_FROM_ALL_DEVICES from './graphql/LogoutFromAllDevices.graphql';

const logout = client => client.mutate({ mutation: LOGOUT });
const logoutFromAllDevices = client => client.mutate({ mutation: LOGOUT_FROM_ALL_DEVICES });

export default (settings.auth.session.enabled
  ? new AccessModule({
      logout: [logout],
      logoutFromAllDevices: [logoutFromAllDevices]
    })
  : undefined);
