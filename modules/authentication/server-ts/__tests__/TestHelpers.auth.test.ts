import { expect } from 'chai';
import { ApolloClient } from 'apollo-client';

import { getApollo } from '@gqlapp/testing-server-ts';
import CURRENT_USER_QUERY from '@gqlapp/user-client-react/graphql/CurrentUserQuery.graphql';

import { login, logout } from '../test-helpers';

describe('TestHelpers for authentication work', () => {
  let apollo: ApolloClient<any>;

  beforeAll(() => {
    apollo = getApollo();
  });

  test('User not logged in initially', async () => {
    const result = await apollo.query({ query: CURRENT_USER_QUERY });
    expect(result.data).to.deep.equal({ currentUser: null });
  });

  test('Signing in as ordinary user works', async () => {
    await login('user', 'user1234');
    const result = await apollo.query({ query: CURRENT_USER_QUERY });
    expect(result.data.currentUser.username).to.equal('user');
  });

  test('Signing out as ordinary user works', async () => {
    await logout();
    const result = await apollo.query({ query: CURRENT_USER_QUERY });
    expect(result.data).to.deep.equal({ currentUser: null });
  });

  test('Signing in without parameters as admin works', async () => {
    await login();
    const result = await apollo.query({ query: CURRENT_USER_QUERY });
    expect(result.data.currentUser.username).to.equal('admin');
    await logout();
  });
});
