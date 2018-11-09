import chai from 'chai';
import { Server } from 'http';
import chaiHttp from 'chai-http';
import { ApolloClient } from 'apollo-client';
import WebSocket from 'ws';

import createApolloClient from '../../../common/createApolloClient';
import '../../knexdata';
import knex from '../sql/connector';

chai.use(chaiHttp);
chai.should();

let server: Server;
let apollo: ApolloClient<any>;

before(async () => {
  // tslint:disable-next-line
  require('@babel/register')({ cwd: __dirname + '/../../../..' });
  // , configFile: BABEL_CONFIG,
  await knex.migrate.latest();
  await knex.seed.run();

  server = await require('../server').default;

  global.WebSocket = WebSocket;
  // TODO: remove any type after converting the createApolloClient.js file into Typescript
  apollo = createApolloClient({ apiUrl: `http://localhost:${process.env.PORT}/graphql` } as any);
});

after(() => {
  if (server) {
    server.close();
    delete global.__TEST_SESSION__;
  }
});

export const getServer = () => server;
export const getApollo = () => apollo;
