import settings from '@gqlapp/config';

import AccessModule from '../AccessModule';

import LOGOUT from './graphql/Logout.graphql';

const logout = client => client.mutate({ mutation: LOGOUT });

export default (settings.auth.session.enabled
  ? new AccessModule({
      logout: [logout]
    })
  : undefined);
