import chai from 'chai';
import chaiHttp from 'chai-http';
import WebSocket from 'ws';
import { ApolloClient } from 'apollo-client';
import { addApolloLogging } from 'apollo-logger';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import '../../../knexfile';
import knex from '../sql/connector';
import settings from '../../../settings';

chai.use(chaiHttp);
chai.should();

var server;
var apollo;

before(async () => {
  await knex.migrate.latest();
  await knex.seed.run();

  server = require('../server').default;
  const networkInterface = new SubscriptionClient(`ws://localhost:${process.env['PORT']}/graphql`, {}, WebSocket);

  apollo = new ApolloClient({
    networkInterface: settings.apolloLogging ? addApolloLogging(networkInterface) : networkInterface
  });
});

after(() => {
  if (server) {
    server.close();
  }
});

export const getServer = () => server;
export const getApollo = () => apollo;
