import chai from 'chai';
import { step } from 'mocha-steps';
import { Server } from 'http';

import { getServer } from '../../../testHelpers/integrationSetup';

describe('Upload API works', () => {
  let server: Server;

  before(() => {
    server = getServer();
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
