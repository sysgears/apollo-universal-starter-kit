import chai from 'chai';
import { step } from 'mocha-steps';

import { getServer } from '../../testHelpers/integrationSetup';

describe('Chat example API works', () => {
  let server;

  before(() => {
    server = getServer();
  });

  step('Has GraphiQL endpoint', () => {
    return chai
      .request(server)
      .get('/graphiql')
      .end((err, res) => {
        res.status.should.be(200);
        res.body.should.be('{}');
      });
  });
});
