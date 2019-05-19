import chai from 'chai';
import { Server } from 'http';
import chaiHttp from 'chai-http';
import { ApolloClient } from 'apollo-client';
import WebSocket from 'ws';

import { serverPromise } from '@gqlapp/core-server-ts';
import { createApolloClient } from '@gqlapp/core-common';
import { populateTestDb, knex } from '@gqlapp/database-server-ts';

chai.use(chaiHttp);
chai.should();

let server: Server;
let apollo: ApolloClient<any>;

export const setup = async () => {
  // tslint:disable-next-line
  await populateTestDb();

  server = await serverPromise;
};

export const cleanup = () => {
  if (apollo) {
    // This does not disconnect Apollo Client from server, and we have to use --forceExit for jest
    apollo.stop();
  }
  knex.destroy();
  if (server) {
    server.close();
    delete global.__TEST_SESSION__;
  }
};

export const getServer = () => server;
export const getApollo = () => {
  if (!apollo) {
    global.WebSocket = WebSocket;
    // TODO: remove any type after converting the createApolloClient.js file into Typescript
    apollo = createApolloClient({ apiUrl: `http://localhost:${process.env.PORT}/graphql` } as any);
  }

  return apollo;
};
