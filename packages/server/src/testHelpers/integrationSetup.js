import chai from 'chai';
import chaiHttp from 'chai-http';

import { SchemaLink } from 'apollo-link-schema';
import WebSocket from 'ws';

import createApolloClient from '../../../common/createApolloClient';
import '../../knexfile';
import knex from '../sql/connector';
import schema from '../api/schema';
import modules from '../modules';

chai.use(chaiHttp);
chai.should();

let server;
let apollo;

before(async () => {
  await knex.migrate.latest();
  await knex.seed.run();

  server = require('../server').default;

  const context = await modules.createContext();
  global.WebSocket = WebSocket;
  apollo = createApolloClient({
    apiUrl: `http://localhost:${process.env['PORT']}/graphql`,
    createNetLink: () => new SchemaLink({ schema, context })
  });
});

after(() => {
  if (server) {
    server.close();
  }
});

export const getServer = () => server;
export const getApollo = () => apollo;
