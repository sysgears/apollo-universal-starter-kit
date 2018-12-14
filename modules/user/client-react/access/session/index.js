import AccessModule from '../AccessModule';
import settings from '../../../../../settings';

import LOGOUT from './graphql/Logout.graphql';

const logout = client => client.mutate({ mutation: LOGOUT });

export default (settings.user.auth.access.session.enabled
  ? new AccessModule({
      logout: [logout]
    })
  : undefined);
