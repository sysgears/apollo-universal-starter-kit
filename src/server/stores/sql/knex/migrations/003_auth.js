import settings from '../../../../../../settings';

let entities = settings.entities;
let authn = settings.auth.authentication;

exports.up = function(knex, Promise) {
  let migs = [];

  // short-circuit
  if (authn.enabled !== true) {
    return Promise.all(migs);
  }

  // User Auth tables
  if (entities.users.enabled === true) {
    if (authn.password.enabled === true) {
      let fn = knex.schema.createTable('user_password', table => {
        table.timestamps(true, true);
        table
          .uuid('user_id')
          .unique()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');

        table.string('password');
      });

      migs.push(fn);
    }

    if (authn.oauth.enabled === true) {
      let fn = knex.schema.createTable('user_oauths', table => {
        table.timestamps(true, true);
        table
          .uuid('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');

        table.string('provider');
        table.string('oauth_id');
        table.unique(['user_id', 'provider', 'oauth_id']);
      });

      migs.push(fn);
    }

    if (authn.apikey.enabled === true) {
      let fn = knex.schema.createTable('user_apikeys', table => {
        table.timestamps(true, true);
        table
          .uuid('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');

        table.string('name');
        table.string('key');
        table.unique(['user_id', 'name']);
      });

      migs.push(fn);
    }

    if (authn.certificate.enabled === true) {
      let fn = knex.schema.createTable('user_certificates', table => {
        table.timestamps(true, true);
        table
          .uuid('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');

        table.string('name');
        table.string('serial');
        table.string('pubkey');

        table.unique(['user_id', 'name']);
      });

      migs.push(fn);
    }
  }

  // Service Account Auth tables
  if (entities.serviceaccounts.enabled === true) {
    if (authn.apikey.enabled === true) {
      let fn = knex.schema.createTable('serviceaccount_apikeys', table => {
        table.timestamps(true, true);
        table
          .uuid('serviceaccount_id')
          .references('id')
          .inTable('serviceaccounts')
          .onDelete('CASCADE');

        table.string('name');
        table.string('key');
        table.unique(['serviceaccount_id', 'name']);
      });

      migs.push(fn);
    }

    if (authn.certificate.enabled === true) {
      let fn = knex.schema.createTable('serviceaccount_certificates', table => {
        table.timestamps(true, true);
        table
          .uuid('serviceaccount_id')
          .references('id')
          .inTable('serviceaccounts')
          .onDelete('CASCADE');

        table.string('name');
        table.string('serial');
        table.string('pubkey');

        table.unique(['serviceaccount_id', 'name']);
      });

      migs.push(fn);
    }
  }

  return Promise.all(migs);
};

exports.down = function(knex, Promise) {
  let migs = [];

  // short-circuit
  if (authn.enabled !== true) {
    return Promise.all(migs);
  }

  if (entities.users.enabled === true) {
    if (authn.password.enabled === true) {
      let fn = knex.schema.dropTable('user_password');
      migs.push(fn);
    }

    if (authn.oauth.enabled === true) {
      let fn = knex.schema.dropTable('user_oauths');
      migs.push(fn);
    }

    if (authn.apikey.enabled === true) {
      let fn = knex.schema.dropTable('user_apikeys');
      migs.push(fn);
    }

    if (authn.certificate.enabled === true) {
      let fn = knex.schema.dropTable('user_certificates');
      migs.push(fn);
    }
  }

  // Service Account Auth tables
  if (entities.serviceaccounts.enabled === true) {
    if (authn.apikey.enabled === true) {
      let fn = knex.schema.dropTable('serviceaccount_apikeys');
      migs.push(fn);
    }

    if (authn.certificate.enabled === true) {
      let fn = knex.schema.dropTable('serviceaccount_certificates');
      migs.push(fn);
    }
  }

  return Promise.all(migs);
};
