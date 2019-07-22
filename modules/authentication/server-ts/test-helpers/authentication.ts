import { getApollo } from '@gqlapp/testing-server-ts';
import LOGIN from '@gqlapp/user-client-react/graphql/Login.graphql';
import LOGOUT from '@gqlapp/authentication-client-react/access/session/graphql/Logout.graphql';

export const login = async (usernameOrEmail: string = 'admin', password: string = 'admin123') =>
  getApollo().mutate({
    mutation: LOGIN,
    variables: { input: { usernameOrEmail, password } }
  });

export const logout = async () => getApollo().mutate({ mutation: LOGOUT });
