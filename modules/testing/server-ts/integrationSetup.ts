import chai from 'chai';
import { Server } from 'http';
import chaiHttp from 'chai-http';
import { ApolloClient } from 'apollo-client';
import WebSocket from 'ws';

import { serverPromise } from '@gqlapp/core-server-ts';
import { createApolloClient } from '@gqlapp/core-common';
import { populateTestDb } from '@gqlapp/database-server-ts';

chai.use(chaiHttp);
chai.should();

let server: Server;
let apollo: ApolloClient<any>;

before(async () => {
  if (!global._babelPolyfill) {
    // tslint:disable-next-line
    require('@babel/register')({ cwd: __dirname + '/../../..', extensions: ['.js', '.ts'], ignore: [ /build\/main.js/ ] });
    require('@babel/polyfill');
  }
  await populateTestDb();

  server = await serverPromise;

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
