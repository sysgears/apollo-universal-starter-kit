import chai from 'chai';
import chaiHttp from 'chai-http';

import WebSocket from 'ws';

import createApolloClient from '../../../common/createApolloClient';
import '../../knexdata';
import knex from '../sql/connector';

chai.use(chaiHttp);
chai.should();

let server;
let apollo;

before(async () => {
  require('babel-register')({ presets: ['env'] });

  await knex.migrate.latest();
  await knex.seed.run();

  server = await require('../server').default;

  global.WebSocket = WebSocket;
  apollo = createApolloClient({
    apiUrl: `http://localhost:${process.env['PORT']}/graphql`
  });
});

after(() => {
  if (server) {
    server.close();
    delete global.__TEST_SESSION__;
  }
});

export const getServer = () => server;
export const getApollo = () => apollo;
