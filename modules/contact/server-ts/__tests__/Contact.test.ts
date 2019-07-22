import { expect } from 'chai';

import { getApollo } from '@gqlapp/testing-server-ts';

import CONTACT from '../../client-react/graphql/Contact.graphql';

describe('Contact API works', () => {
  let apollo: any;

  beforeAll(() => {
    apollo = getApollo();
  });

  it('Should return validation errors', async () => {
    try {
      await apollo.mutate({
        mutation: CONTACT,
        variables: {
          input: {
            content: 'Short',
            email: 'InvalidEmail@2.d',
            name: 'N'
          }
        }
      });
    } catch (e) {
      expect(e.graphQLErrors).to.be.an('Array');
    }
  });
});
