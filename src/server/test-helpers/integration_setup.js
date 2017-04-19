import knex from '../sql/connector';

var server;

before(() => {
  return knex.migrate.latest().then(() => {
    return knex.seed.run();
  }).then(() => {
    server = require('../api_server').default;
  });
});

after(() => {
  if (server) {
    server.close()
  }
});

export default () => server;
