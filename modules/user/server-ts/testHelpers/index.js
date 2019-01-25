import { LOGIN } from '@gqlapp/user-client-react';
import { LOGOUT } from '@gqlapp/authentication-client-react';
import { getApollo } from '@gqlapp/testing-server-ts';

export const login = async (usernameOrEmail = 'admin', password = 'admin123') =>
  await getApollo().mutate({
    mutation: LOGIN,
    variables: { input: { usernameOrEmail, password } }
  });

export const logout = async () => await getApollo().mutate({ mutation: LOGOUT });
