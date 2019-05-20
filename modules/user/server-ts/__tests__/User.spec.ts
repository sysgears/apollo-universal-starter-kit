/*eslint-disable no-unused-vars*/
import chai, { expect } from 'chai';
import CURRENT_USER_QUERY from '@gqlapp/user-client-react/graphql/CurrentUserQuery.graphql';
import USER_QUERY from '@gqlapp/user-client-react/graphql/UserQuery.graphql';
import { getApollo } from '@gqlapp/testing-server-ts';

import { login, logout } from '../testHelpers';

describe('User API works', () => {
  let apollo: any;

  beforeAll(() => {
    apollo = getApollo();
  });

  it('User not logged in initially', async () => {
    const result = await apollo.query({ query: CURRENT_USER_QUERY });
    expect(result.data).to.deep.equal({ currentUser: null });
  });

  it('Signing in as ordinary user works', async () => {
    await login('user', 'user1234');
    const result = await apollo.query({ query: CURRENT_USER_QUERY });
    expect(result.data.currentUser.username).to.equal('user');
  });

  it('Signing out as ordinary user works', async () => {
    await logout();
    const result = await apollo.query({ query: CURRENT_USER_QUERY });
    expect(result.data).to.deep.equal({ currentUser: null });
  });

  it("Can't query user profiles as guest", async done => {
    apollo
      .query({ query: USER_QUERY, variables: { id: 1 } })
      .then(() => done('This test is expected to throw an error'))
      .catch((ex: any) => {
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
    beforeEach(async () => {
      await login('user', 'user1234');
    });
    afterEach(async () => {
      await logout();
    });

    it('Can query own user profile', async () => {
      const result = await apollo.query({ query: USER_QUERY, variables: { id: 2 } });
      expect(result.data.user.user.username).to.equal('user');
    });

    it('Cannot query other users profile', async () => {
      try {
        await apollo.query({ query: USER_QUERY, variables: { id: 1 } });
      } catch (e) {
        expect(e.graphQLErrors).to.be.an('Array');
      }
    });
  });

  describe('Tests with authenticated admin', () => {
    beforeEach(async () => {
      await login('admin', 'admin123');
    });
    afterEach(async () => {
      await logout();
    });

    it('Can query own user profile', async () => {
      const result = await apollo.query({ query: USER_QUERY, variables: { id: 1 } });
      expect(result.data.user.user.username).to.equal('admin');
    });

    it('Can query other users profile', async () => {
      const result = await apollo.query({ query: USER_QUERY, variables: { id: 2 } });
      expect(result.data.user.user.username).to.equal('user');
    });
  });
});
