import LOGIN from '@module/user-client-react/graphql/Login.graphql';
import LOGOUT from '@module/user-client-react/access/session/graphql/Logout.graphql';

import { getApollo } from '../../../testHelpers/integrationSetup';

export const login = async (usernameOrEmail = 'admin', password = 'admin123') =>
  await getApollo().mutate({
    mutation: LOGIN,
    variables: { input: { usernameOrEmail, password } }
  });

export const logout = async () => await getApollo().mutate({ mutation: LOGOUT });
