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
    const { data } = await apollo.mutate({
      mutation: CONTACT,
      variables: {
        input: {
          content: 'Short',
          email: 'InvalidEmail@2.d',
          name: 'N'
        }
      }
    });

    expect(data.contact)
      .to.have.property('errors')
      .with.length(3);
  });
});
