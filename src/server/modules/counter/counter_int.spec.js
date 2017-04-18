import chai from 'chai';
import chaiHttp from 'chai-http';
import { step } from 'mocha-steps';
import { createNetworkInterface } from 'apollo-client';

import createApolloClient from '../../../common/apollo_client'
import knex from '../../sql/connector';
import COUNT_GET_QUERY from '../../../client/modules/counter/graphql/count_get.graphql';

chai.use(chaiHttp);
chai.should();

const networkInterface = createNetworkInterface({ uri: "http://localhost:8080/graphql" });
const apollo = createApolloClient(networkInterface);

describe('Counter example API works', () => {
  let server;

  step('Initialize DB', function(done) {
    this.timeout(5000);

    knex.migrate.latest().then(() =>
      knex.seed.run()
    ).then(() => done());
  });

  step('Start server', () => {
    try {
      server = require('../../api_server').default;
    } catch (e) {

      console.log(e);
    }
  });

  step('Has GraphiQL endpoint', () => {
    chai.request(server).get('/graphiql').end((err, res) => {
      res.status.should.be(200);
      res.body.should.be('{}');
    });
  });

  step('Responds to counter get GraphQL query', done => {
    apollo.query({ query: COUNT_GET_QUERY }).then(result => {
      result.data.should.deep.equal({ count: { amount: 5, __typename: 'Count' } });
      done();
    });
  });
});