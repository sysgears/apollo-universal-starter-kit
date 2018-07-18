/*eslint-disable no-unused-vars*/
import chai from 'chai';
import { step } from 'mocha-steps';
import { getServer, getApollo } from '../../../testHelpers/integrationSetup';

describe('Contact API works', () => {
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
