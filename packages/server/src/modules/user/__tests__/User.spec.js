/*eslint-disable no-unused-vars*/
// General imports
import chai from 'chai';
import { step } from 'mocha-steps';

// Helpers
import { getServer, getApollo } from '../../../testHelpers/integrationSetup';

describe('User API works', () => {
  let server, apollo;

  before(() => {
    server = getServer();
    apollo = getApollo();
  });

  step('Has GraphQL Playground endpoint', () => {
    return chai
      .request(server)
      .get('/gplayground')
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.eql({});
      });
  });
});
