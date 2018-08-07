/*eslint-disable no-unused-vars*/
import { expect } from 'chai';
import { step } from 'mocha-steps';

import { getApollo } from '../../../testHelpers/integrationSetup';

import CURRENT_USER_QUERY from '../../../../../client/src/modules/user/graphql/CurrentUserQuery.graphql';
import LOGIN from '../../../../../client/src/modules/user/graphql/Login.graphql';
import LOGOUT from '../../../../../client/src/modules/user/access/session/graphql/Logout.graphql';

describe('User API works', () => {
  let apollo;

  before(() => {
    apollo = getApollo();
  });

  step('User not logged in initially', async () => {
    const result = await apollo.query({ query: CURRENT_USER_QUERY });
    expect(result.data).to.deep.equal({ currentUser: null });
  });

  step('Siging in as ordinary user works', async () => {
    await apollo.mutate({
      mutation: LOGIN,
      variables: { input: { usernameOrEmail: 'user', password: 'user1234' } }
    });
    const result = await apollo.query({ query: CURRENT_USER_QUERY });
    expect(result.data.currentUser.username).to.equal('user');
  });

  step('Signing out as ordinary user works', async () => {
    await apollo.mutate({ mutation: LOGOUT });
    const result = await apollo.query({ query: CURRENT_USER_QUERY });
    expect(result.data).to.deep.equal({ currentUser: null });
  });
});
