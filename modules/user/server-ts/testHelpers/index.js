import LOGIN from '@gqlapp/user-client-react/graphql/Login.graphql';
import LOGOUT from '@gqlapp/user-client-react/access/session/graphql/Logout.graphql';

import { getApollo } from '@gqlapp/testing-server-ts';

export const login = async (usernameOrEmail = 'admin', password = 'admin123') =>
  await getApollo().mutate({
    mutation: LOGIN,
    variables: { input: { usernameOrEmail, password } }
  });

export const logout = async () => await getApollo().mutate({ mutation: LOGOUT });
