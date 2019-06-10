import settings from '@gqlapp/config';

import createDeviceId from '../../common/createDeviceId';

import AccessModule from '../AccessModule';

import DataRootComponent from './DataRootComponent';

import LOGOUT from './graphql/Logout.graphql';
import LOGOUT_FROM_ALL_DEVICES from './graphql/LogoutFromAllDevices.graphql';

const logout = client => client.mutate({ mutation: LOGOUT });
const logoutFromAllDevices = client => {
  const deviceId = createDeviceId();
  client.mutate({ mutation: LOGOUT_FROM_ALL_DEVICES, variables: { deviceId } });
};

export default (settings.auth.session.enabled
  ? new AccessModule({
      dataRootComponent: [DataRootComponent],
      logout: [logout],
      logoutFromAllDevices: [logoutFromAllDevices]
    })
  : undefined);
