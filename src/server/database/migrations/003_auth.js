import settings from '../../../../settings';

let entities = settings.entities;
let config = settings.auth.authentication;

exports.up = function(knex, Promise) {
  let migs = [];

  if (config.enabled !== true) {
    return Promise.all(migs);
  }

  // User Auth tables
  if (entities.users.enabled === true) {
    if (config.password.enabled === true) {
      let fn = knex.schema.createTable('user_password', table => {
        table.timestamps(true, true);
        table
          .integer('user_id')
          .unsigned()
          .unique()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');

        table.string('password');
      });

      migs.push(fn);
    }

    if (config.oauth.enabled === true) {
      let fn = knex.schema.createTable('user_oauths', table => {
        table.timestamps(true, true);
        table
          .integer('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');

        table.string('provider');
        table.string('oauth_id');
        table.unique(['user_id', 'provider', 'oauth_id']);
      });

      migs.push(fn);
    }

    if (config.apikey.enabled === true) {
      let fn = knex.schema.createTable('user_apikeys', table => {
        table.timestamps(true, true);
        table
          .integer('user_id')
          .unsigned()
          .unique()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');

        table.string('name');
        table.string('key');
        table.unique(['user_id', 'name']);
      });

      migs.push(fn);
    }

    if (config.certificate.enabled === true) {
      let fn = knex.schema.createTable('user_certificates', table => {
        table.timestamps(true, true);
        table
          .integer('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');

        table.string('name');
        table.string('serial');

        table.unique(['user_id', 'name']);
      });

      migs.push(fn);
    }
  }

  // Service Account Auth tables
  if (entities.serviceaccounts.enabled === true) {
    if (config.apikey.enabled === true) {
      let fn = knex.schema.createTable('serviceaccount_apikeys', table => {
        table.timestamps(true, true);
        table
          .integer('serviceaccount_id')
          .unsigned()
          .unique()
          .references('id')
          .inTable('serviceaccounts')
          .onDelete('CASCADE');

        table.string('key');
      });

      migs.push(fn);
    }

    if (config.certificate.enabled === true) {
      let fn = knex.schema.createTable('serviceaccount_certificates', table => {
        table.timestamps(true, true);
        table
          .integer('serviceaccount_id')
          .unsigned()
          .unique()
          .references('id')
          .inTable('serviceaccounts')
          .onDelete('CASCADE');

        table.string('serial').unique();
      });

      migs.push(fn);
    }
  }

  return Promise.all(migs);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('serviceaccount_certificates'),
    knex.schema.dropTable('user_certificates'),
    knex.schema.dropTable('user_oauths'),
    knex.schema.dropTable('user_apikeys'),
    knex.schema.dropTable('user_password')
  ]);
};
