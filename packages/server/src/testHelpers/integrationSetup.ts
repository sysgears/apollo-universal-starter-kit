import chai from 'chai';
import { Server } from 'http';
import chaiHttp from 'chai-http';
import { ApolloClient } from 'apollo-client';
import WebSocket from 'ws';
import * as path from 'path';

import createApolloClient from '../../../common/createApolloClient';
import '../../knexdata';
import knex from '../sql/connector';

chai.use(chaiHttp);
chai.should();

let server: Server;
let apollo: ApolloClient<any>;

const BABEL_CONFIG = path.resolve(require.resolve('../../../../babel.config.knex.js'));

before(async () => {
  // tslint:disable-next-line
  require('@babel/register')({ cwd: path.dirname(BABEL_CONFIG), configFile: BABEL_CONFIG, ignore: [/[\/\\]node_modules[\/\\]/, /[\/\\]server[\/\\]build[\/\\]/] });
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
