import { expect } from 'chai';
import { step } from 'mocha-steps';

import { getApollo } from '../../../../packages/server/src/testHelpers/integrationSetup';
import CONTACT from '../../client-react/graphql/Contact.graphql';

describe('Contact API works', () => {
  let apollo: any;

  before(() => {
    apollo = getApollo();
  });

  step('Should return validation errors', async () => {
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
