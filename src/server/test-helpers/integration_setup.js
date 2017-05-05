import chai from 'chai';
import chaiHttp from 'chai-http';
import WebSocket from 'ws';
import { createNetworkInterface } from 'apollo-client';
import subscriptions from 'subscriptions-transport-ws';

import createApolloClient from '../../common/apollo_client';
import '../../../knexfile';
import knex from '../sql/connector';

chai.use(chaiHttp);
chai.should();

var server;
var apollo;

before(async () => {
  await knex.migrate.latest();
  await knex.seed.run();

  const TEST_PORT = 7070;
  process.env['PORT'] = TEST_PORT;

  server = require('../api_server').default;
  const wsClient = new subscriptions.SubscriptionClient(`ws://localhost:${TEST_PORT}`, {}, WebSocket);

  const networkInterface = subscriptions.addGraphQLSubscriptions(
    createNetworkInterface({ uri: `http://localhost:${TEST_PORT}/graphql` }),
    wsClient
  );

  apollo = createApolloClient(networkInterface);
});

after(() => {
  if (server) {
    server.close();
  }
});

export const getServer = () => server;
export const getApollo = () => apollo;
