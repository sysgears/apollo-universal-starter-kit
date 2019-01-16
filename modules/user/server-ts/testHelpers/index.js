import { LOGIN } from '@module/user-client-react';
import { LOGOUT } from '@module/authentication-client-react';

import { getApollo } from '@module/testing-server-ts';

export const login = async (usernameOrEmail = 'admin', password = 'admin123') =>
  await getApollo().mutate({
    mutation: LOGIN,
    variables: { input: { usernameOrEmail, password } }
  });

export const logout = async () => await getApollo().mutate({ mutation: LOGOUT });
