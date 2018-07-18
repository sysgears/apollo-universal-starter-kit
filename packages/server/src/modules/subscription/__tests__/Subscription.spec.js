/*eslint-disable no-unused-vars*/
// General imports
import chai from 'chai';
import { step } from 'mocha-steps';

// Helpers
import { getServer, getApollo } from '../../../testHelpers/integrationSetup';

describe('Subscription API works', () => {
  let server, apollo;

  before(() => {
    server = getServer();
    apollo = getApollo();
  });

  step('Has GraphiQL endpoint', () => {
    return chai
      .request(server)
      .get('/graphiql')
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.eql({});
      });
  });
});
