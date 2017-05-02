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

  server = require('../api_server').default;
  const wsClient = new subscriptions.SubscriptionClient("ws://localhost:8080", {}, WebSocket);

  const networkInterface = subscriptions.addGraphQLSubscriptions(
    createNetworkInterface({ uri: "http://localhost:8080/graphql" }),
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
