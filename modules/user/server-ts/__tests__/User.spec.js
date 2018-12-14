/*eslint-disable no-unused-vars*/
import chai, { expect } from 'chai';
import { step } from 'mocha-steps';
import CURRENT_USER_QUERY from '@module/user-client-react/graphql/CurrentUserQuery.graphql';
import USER_QUERY from '@module/user-client-react/graphql/UserQuery.graphql';
import { getApollo } from '@module/testing-server-ts';

import { login, logout } from '../testHelpers';

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
    await login('user', 'user1234');
    const result = await apollo.query({ query: CURRENT_USER_QUERY });
    expect(result.data.currentUser.username).to.equal('user');
  });

  step('Signing out as ordinary user works', async () => {
    await logout();
    const result = await apollo.query({ query: CURRENT_USER_QUERY });
    expect(result.data).to.deep.equal({ currentUser: null });
  });

  step("Can't query user profiles as guest", async done => {
    apollo
      .query({ query: USER_QUERY, variables: { id: 1 } })
      .then(() => done('This test is expected to throw an error'))
      .catch(ex => {
        // Check for values in the thrown graphQL error object here
        // e.g. message, extensions.code or other
        chai
          .expect(ex.graphQLErrors[0])
          .to.have.property('extensions')
          .with.property('code')
          .to.be.equal('UNAUTHENTICATED');
        // Error received as expected, consider test as done
        done();
      })
      .catch(done);
  });

  describe('Tests with authenticated user', () => {
    before(async () => {
      await login('user', 'user1234');
    });
    after(async () => {
      await logout();
    });

    step('Can query own user profile', async () => {
      const result = await apollo.query({ query: USER_QUERY, variables: { id: 2 } });
      expect(result.data.user.user.username).to.equal('user');
    });

    step('Cannot query other users profile', async () => {
      const result = await apollo.query({ query: USER_QUERY, variables: { id: 1 } });
      expect(result.data.user.user).to.be.null;
    });
  });

  describe('Tests with authenticated admin', () => {
    before(async () => {
      await login('admin', 'admin123');
    });
    after(async () => {
      await logout();
    });

    step('Can query own user profile', async () => {
      const result = await apollo.query({ query: USER_QUERY, variables: { id: 1 } });
      expect(result.data.user.user.username).to.equal('admin');
    });

    step('Can query other users profile', async () => {
      const result = await apollo.query({ query: USER_QUERY, variables: { id: 2 } });
      expect(result.data.user.user.username).to.equal('user');
    });
  });
});
